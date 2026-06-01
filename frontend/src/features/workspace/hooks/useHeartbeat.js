import { useEffect, useRef, useCallback } from 'react';

const HEARTBEAT_INTERVAL_MS  = 5_000;    // TEST: check every 5s
const ACTIVITY_WINDOW_MS     = 5_000;    // TEST: active = touched UI in last 5s
const AI_GRACE_PERIOD_MS     = 5_000;    // TEST: AI grace 5s
const WARNING_THRESHOLD_MS   = 10_000;   // TEST: warn after 10s idle
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
      const isProcessActive  = isTerminalBusy();

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

  return { recordActivity };
}
