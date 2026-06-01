# TTL Heartbeat & Activity Management — Implementation Plan
**Project:** Codespace | **Target File:** `WorkspacePage.jsx` (+ supporting files)

---

## The Problem, Precisely

Once the IDE loads, all meaningful communication flows over **persistent WebSockets** — the terminal (`socket.io` + `node-pty`), Vite HMR, and the Agent file sync. The Router's Express middleware only sees the initial HTTP upgrade handshake, not the ongoing traffic. So from the Router's perspective, the user vanishes the moment the workspace finishes loading — and Redis counts down to zero regardless of what's actually happening on screen.

---

## Solution Architecture

Three inputs feed a single decision: **send a heartbeat ping, or don't.**

```
┌─────────────────────────────────────────────────────┐
│                  WorkspacePage.jsx                  │
│                                                     │
│  [User Activity]   [AI State]   [Terminal Activity] │
│       │                │               │            │
│       └────────────────┴───────────────┘            │
│                        │                            │
│              ┌─────────▼──────────┐                 │
│              │  isWorkspaceActive │                 │
│              │  (computed, 30s)   │                 │
│              └─────────┬──────────┘                 │
│                        │                            │
│          ┌─────────────┼──────────────┐             │
│        active        idle           warning         │
│          │             │               │            │
│      Send ping    No ping sent    Show warning UI   │
│  (every 60s)    TTL counts down   + grace ping      │
└─────────────────────────────────────────────────────┘
```

---

## Implementation

### 1. The `useHeartbeat` Hook

Create `src/hooks/useHeartbeat.js`. This is the entire brain of the system.

```javascript
import { useEffect, useRef, useCallback } from 'react';

const HEARTBEAT_INTERVAL_MS  = 60_000;   // ping every 60s
const ACTIVITY_WINDOW_MS     = 90_000;   // user active = touched UI in last 90s
const AI_GRACE_PERIOD_MS     = 30_000;   // treat AI as active for 30s after it finishes
const WARNING_THRESHOLD_MS   = 120_000;  // warn user at 2 min idle (TTL is 10 min — warn at 8 min)
const PING_ENDPOINT          = (sandboxId) =>
  `http://${sandboxId}.agent.localhost/api/status/healthz`;

/**
 * @param {object} options
 * @param {string}   options.sandboxId       - The active sandbox UUID
 * @param {boolean}  options.isAiWorking     - True when AI orchestrator is processing
 * @param {boolean}  options.isTerminalBusy  - True when terminal has recent output
 * @param {function} options.onIdleWarning   - Called when workspace goes idle (show warning)
 * @param {function} options.onActivityResume - Called when activity resumes (hide warning)
 */
export function useHeartbeat({
  sandboxId,
  isAiWorking,
  isTerminalBusy,
  onIdleWarning,
  onActivityResume,
}) {
  const lastActivityRef      = useRef(Date.now());
  const lastAiActiveRef      = useRef(null);
  const isIdleWarningShownRef = useRef(false);

  // ── Activity signal: user input events ──────────────────────────────────
  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (isIdleWarningShownRef.current) {
      isIdleWarningShownRef.current = false;
      onActivityResume?.();
    }
  }, [onActivityResume]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    // Throttle: update ref at most once per 5s to avoid perf hit
    let lastUpdate = 0;
    const handler = () => {
      const now = Date.now();
      if (now - lastUpdate > 5_000) {
        lastUpdate = now;
        recordActivity();
      }
    };
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, [recordActivity]);

  // ── Track AI active → grace period ──────────────────────────────────────
  useEffect(() => {
    if (isAiWorking) {
      lastAiActiveRef.current = Date.now();
    }
  }, [isAiWorking]);

  // ── The heartbeat loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!sandboxId) return;

    const interval = setInterval(async () => {
      const now                = Date.now();
      const timeSinceActivity  = now - lastActivityRef.current;
      const timeSinceAi        = lastAiActiveRef.current
                                   ? now - lastAiActiveRef.current
                                   : Infinity;

      const isUserActive     = timeSinceActivity  < ACTIVITY_WINDOW_MS;
      const isAiActive       = isAiWorking || timeSinceAi < AI_GRACE_PERIOD_MS;
      const isProcessActive  = isTerminalBusy;

      const shouldPing = isUserActive || isAiActive || isProcessActive;

      if (shouldPing) {
        // Active — ping the router to refresh Redis TTL
        if (isIdleWarningShownRef.current) {
          isIdleWarningShownRef.current = false;
          onActivityResume?.();
        }
        try {
          await fetch(PING_ENDPOINT(sandboxId), {
            method: 'GET',
            signal: AbortSignal.timeout(5_000),
          });
        } catch {
          // Silent fail — a missed ping is not fatal; TTL has enough runway
        }
      } else {
        // Idle — decide whether to warn
        if (timeSinceActivity > WARNING_THRESHOLD_MS && !isIdleWarningShownRef.current) {
          isIdleWarningShownRef.current = true;
          onIdleWarning?.();
        }
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [sandboxId, isAiWorking, isTerminalBusy, onIdleWarning, onActivityResume]);
}
```

---

### 2. Terminal Activity Signal

The terminal communicates over `socket.io`. Detect output activity by listening for incoming data events on the existing socket — no new WebSocket needed.

In `src/hooks/useTerminal.js` (or wherever the terminal socket is managed), expose an `isTerminalBusy` flag:

```javascript
// Add inside your existing terminal socket setup
const lastTerminalOutputRef = useRef(0);
const TERMINAL_ACTIVE_WINDOW_MS = 10_000; // output in last 10s = busy

socket.on('terminal:output', () => {
  lastTerminalOutputRef.current = Date.now();
});

// Computed flag — re-evaluated on each heartbeat tick
const isTerminalBusy = () =>
  Date.now() - lastTerminalOutputRef.current < TERMINAL_ACTIVE_WINDOW_MS;
```

Pass this as a prop or context value to `useHeartbeat`.

---

### 3. Idle Warning Component

Create `src/components/IdleWarningBanner.jsx`:

```jsx
import { useEffect, useState } from 'react';

const TTL_SECONDS        = 600;   // must match Redis TTL
const WARNING_AT_SECONDS = 120;   // warn when 2 min remain

export function IdleWarningBanner({ visible, onStayActive, secondsRemaining }) {
  if (!visible) return null;

  return (
    <div className="
      fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      flex items-center gap-4
      bg-yellow-950 border border-yellow-700
      text-yellow-200 text-sm
      px-5 py-3 rounded-xl shadow-xl
      animate-slide-up
    ">
      <span className="text-yellow-400 text-base">⚠</span>
      <span>
        Your workspace is idle —{' '}
        <strong>pod will be deleted in ~{secondsRemaining}s</strong>
      </span>
      <button
        onClick={onStayActive}
        className="
          ml-2 px-3 py-1 rounded-md
          bg-yellow-700 hover:bg-yellow-600
          text-yellow-100 font-medium text-xs
          transition-colors
        "
      >
        Keep alive
      </button>
    </div>
  );
}
```

The **"Keep alive"** button calls `recordActivity()` (passed down from `useHeartbeat`) which resets `lastActivityRef`, which causes the next heartbeat tick to send a ping.

---

### 4. Wiring It Into `WorkspacePage.jsx`

```jsx
import { useState, useCallback } from 'react';
import { useHeartbeat } from '../hooks/useHeartbeat';
import { IdleWarningBanner } from '../components/IdleWarningBanner';

export function WorkspacePage({ sandboxId }) {
  const [idleWarningVisible, setIdleWarningVisible] = useState(false);
  const [secondsRemaining, setSecondsRemaining]     = useState(120);

  // Pull from your existing AI state hook — whatever flag goes true
  // when the AI orchestrator is processing a request
  const { isAiWorking } = useAiAgent();          // your existing hook
  const { isTerminalBusy } = useTerminal();       // updated to expose this flag

  const handleIdleWarning = useCallback(() => {
    setIdleWarningVisible(true);
    // Start a local countdown for display purposes only
    let remaining = 120;
    const countdown = setInterval(() => {
      remaining -= 1;
      setSecondsRemaining(remaining);
      if (remaining <= 0) clearInterval(countdown);
    }, 1_000);
  }, []);

  const handleActivityResume = useCallback(() => {
    setIdleWarningVisible(false);
    setSecondsRemaining(120);
  }, []);

  useHeartbeat({
    sandboxId,
    isAiWorking,
    isTerminalBusy,
    onIdleWarning:     handleIdleWarning,
    onActivityResume:  handleActivityResume,
  });

  return (
    <>
      {/* ... existing layout: explorer, preview, terminal, agent panel ... */}

      <IdleWarningBanner
        visible={idleWarningVisible}
        secondsRemaining={secondsRemaining}
        onStayActive={handleActivityResume}
      />
    </>
  );
}
```

---

### 5. Router — `/api/status/healthz` Endpoint

The ping target needs to exist and trigger `refreshTTL`. Add to the Router service:

```javascript
// router/src/index.js (or routes.js)

// This route must be registered BEFORE the proxy middleware
// so it's handled directly rather than forwarded to the agent container
app.get('/api/status/healthz', (req, res) => {
  const sandboxId = extractSandboxId(req.hostname); // your existing helper
  if (sandboxId) {
    refreshTTL(sandboxId); // your existing Redis TTL refresh
  }
  res.status(200).json({ status: 'ok', ts: Date.now() });
});
```

> **Important:** Register this route before `app.use(proxyMiddleware)`. Otherwise the request gets forwarded to the agent container, which refreshes nothing.

---

## Decision Logic Summary

| User active (90s) | AI working | Terminal busy | Result |
|:-----------------:|:----------:|:-------------:|--------|
| ✅ | any | any | Ping sent, TTL reset |
| ❌ | ✅ | any | Ping sent, TTL reset |
| ❌ | ❌ (grace) | any | Ping sent, TTL reset |
| ❌ | ❌ | ✅ | Ping sent, TTL reset |
| ❌ | ❌ | ❌ | No ping — warn at 8 min idle, TTL expires at 10 min |

---

## Verification Checklist

| # | Test | Expected |
|---|------|----------|
| 1 | Type in terminal continuously | Sandbox stays alive indefinitely |
| 2 | Move mouse / click UI | Sandbox stays alive indefinitely |
| 3 | Walk away from keyboard, no AI running | Warning banner appears after ~8 min idle |
| 4 | Click "Keep alive" on banner | Banner dismisses, ping sent, TTL reset |
| 5 | Walk away and ignore warning | Pod deleted after 10 min, workspace shows disconnected state |
| 6 | Trigger long AI task, hands off keyboard | Sandbox stays alive for duration of AI task + 30s grace |
| 7 | Run `npm install` in terminal, no mouse input | Sandbox stays alive while output is streaming |
| 8 | `npm install` finishes, user walks away | TTL counts down, warning appears, pod eventually deleted |
| 9 | Switch to another browser tab | No mouse/keyboard events fired, TTL counts down naturally |

---

## Configuration Reference

All tunable constants live in `useHeartbeat.js`:

| Constant | Default | Notes |
|----------|---------|-------|
| `HEARTBEAT_INTERVAL_MS` | `60_000` | How often the decision loop runs |
| `ACTIVITY_WINDOW_MS` | `90_000` | How long since last input counts as "active" |
| `AI_GRACE_PERIOD_MS` | `30_000` | How long after AI finishes to keep pinging |
| `WARNING_THRESHOLD_MS` | `120_000` | How long idle before warning banner appears |
| `TERMINAL_ACTIVE_WINDOW_MS` | `10_000` | How long since last terminal output counts as "busy" |

Redis TTL (set in Sandbox Server) should be **600s (10 min)**. The warning fires at 8 min of idle — giving the user a 2-minute window to respond before the pod is deleted.
