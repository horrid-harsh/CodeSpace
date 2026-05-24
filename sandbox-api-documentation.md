# Sandbox API Documentation

## Base URL

```txt
http://localhost
```

---

# 1. Health Check

## Endpoint

```http
GET /api/sandbox/health
```

## Request Body

```json
{}
```

## Response

```json
{
  "message": "Sandbox API is healthy",
  "status": "success"
}
```

---

# 2. Start Sandbox

## Endpoint

```http
POST /api/sandbox/start
```

## Request Body

```json
{}
```

## Response

```json
{
  "message": "Sandbox created successfully",
  "sandboxId": "019e4f28-935c-74a6-929c-f447e2e2e1d8",
  "previewUrl": "http://019e4f28-935c-74a6-929c-f447e2e2e1d8.preview.localhost"
}
```

## Notes

- `sandboxId` uniquely identifies sandbox/container
- `previewUrl` is live frontend preview URL

---

# 3. Sandbox Agent Base URL

## Format

```txt
http://{sandboxId}.agent.localhost
```

## Example

```txt
http://019e4f28-935c-74a6-929c-f447e2e2e1d8.agent.localhost
```

---

# 4. Agent Health Check

## Endpoint

```http
GET /
```

## Response

```json
{
  "message": "Hello from sandbox agent!",
  "status": "success"
}
```

---

# 5. List Files

## Endpoint

```http
GET /list-files
```

## Response

```json
{
  "message": "Files listed successfully",
  "files": [
    ".dockerignore",
    ".gitignore",
    "README.md",
    "src/App.jsx"
  ]
}
```

---

# 6. Read Files

## Endpoint

```http
GET /read-files?files=src/App.jsx
```

## Query Params

| Param | Type | Description |
|---|---|---|
| files | string | File path |

## Response

```json
{
  "message": "Files contents",
  "files": [
    {
      "/src/App.jsx": "file content here"
    }
  ]
}
```

---

# 7. Update Files

## Endpoint

```http
POST /update-files
```

## Request Body

```json
{
  "updates": [
    {
      "file": "src/App.jsx",
      "content": "updated file content"
    }
  ]
}
```

## Response

```json
{
  "message": "Files updated successfully"
}
```

---

# 8. Create Files

## Endpoint

```http
POST /create-files
```

## Request Body

```json
{
  "files": [
    {
      "file": "dummy.txt",
      "content": "This is some dummy content"
    }
  ]
}
```

## Response

```json
{
  "message": "Files creation results",
  "results": [
    {
      "/workspace/dummy.txt": "File created successfully"
    }
  ]
}
```

---

# 9. Delete Files

## Endpoint

```http
POST /delete-files
```

## Request Body

```json
{
  "files": [
    "dummy.txt"
  ]
}
```

## Response

```json
{
  "message": "Files deletion results",
  "results": [
    {
      "dummy.txt": "Deleted successfully"
    }
  ]
}
```

---

# 10. AI Code Generation

## Endpoint

```http
POST /api/ai/invoke
```

## Request Body

```json
{
  "message": "Change 'Get Started' heading to 'Harshwardhan'.",
  "projectId": "019e4f28-935c-74a6-929c-f447e2e2e1d8"
}
```

## Streaming Logs Response

```json
{"log":"Listing files in the project directory...\n"}

{"log":"Files listed successfully. Files: .dockerignore,.gitignore,README.md,dockerfile,eslint.config.js,index.html,package-lock.json,package.json,vite.config.js,src/App.jsx"}

{"log":"Reading files from the project directory...src/App.jsx\n"}

{"log":"Files read successfully.\n"}

{"log":"Updating files in the project directory...src/App.jsx\n"}

{"log":"Files updated successfully.\n"}
```
## Notes

- API responds as a streamed log output
- Frontend should render logs in realtime
- AI automatically:
  1. Lists project files
  2. Reads relevant files
  3. Updates project files
  4. Deletes project files (only files that the AI has permission to modify/delete)
- Changes reflect instantly in preview URL via Vite HMR

---

# 11. Terminal Socket.IO Connection

## Socket URL

```txt
http://{sandboxId}.agent.localhost
```

For browser code, use the agent URL above and do not set the `Host` header manually.

For API clients such as Postman that connect through `http://localhost/socket.io`, set:

| Key | Value |
|---|---|
| Host | `{sandboxId}` |

## Example

```txt
http://019e4f28-935c-74a6-929c-f447e2e2e1d8.agent.localhost
```

Browser code cannot set the `Host` header because browsers block that unsafe header automatically. Use the agent subdomain URL so the browser sends the correct host naturally.

---

# 12. Terminal Events

## Client → Server

### terminal-input

```json
{
  "input": "ls -a"
}
```

---

## Server → Client

### terminal-output

```json
{
  "output": "src App.jsx"
}
```

---

# 13. Preview URL Format

## Format

```txt
http://{sandboxId}.preview.localhost
```

## Example

```txt
http://019e4f28-935c-74a6-929c-f447e2e2e1d8.preview.localhost
```

---

# Frontend Notes

- Frontend uses Vite proxy for `/api`
- Terminal is realtime via Socket.IO
- File operations are sandbox scoped
- Each sandbox acts like isolated container/project
- Preview URL renders live frontend app
- Agent URL handles filesystem operations

# Terminal UI Requirements

Frontend must use xterm.js for terminal rendering.

Requirements:

- Use xterm.js as the terminal renderer
- Connect terminal using Socket.IO
- Render realtime streaming output
- Send terminal input commands to backend
- Properly handle ANSI escape sequences
- Support reconnect/disconnect states
- Auto-resize terminal with container
- Maintain persistent terminal session per sandbox

Recommended packages:

npm install xterm socket.io-client
npm install @xterm/addon-fit
npm install @xterm/addon-web-links

Recommended setup:

xterm.js for rendering
@xterm/addon-fit for responsive sizing
socket.io-client for realtime communication

The terminal should feel similar to:

Replit terminal
CodeSandbox terminal
Cursor terminal
VSCode integrated terminal
