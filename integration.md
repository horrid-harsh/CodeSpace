Integrate the following sandbox APIs into the frontend:

### 1. Create Project

**Endpoint**
`POST http://localhost/api/sandbox/project`

**Request Body**

```json
{
  "title": "test-title"
}
```

**Response**

```json
{
  "message": "Project created successfully",
  "project": {
    "user": "6a182a0dbbf1e0013a5b24f7",
    "title": "test-title",
    "_id": "6a217ecdc945f3b65c3eefa8",
    "createdAt": "2026-06-04T13:34:05.580Z",
    "__v": 0
  }
}
```

Use the returned `project._id` as the `projectId` for starting a sandbox.

---

### 2. Start Sandbox

**Endpoint**
`POST http://localhost/api/sandbox/start`

**Request Body**

```json
{
  "projectId": "6a217ecdc945f3b65c3eefa8"
}
```

**Response**

```json
{
  "message": "Sandbox created successfully",
  "sandboxId": "019e92d7-9371-75fe-a49e-65cdf8df7ebd",
  "previewUrl": "http://019e92d7-9371-75fe-a49e-65cdf8df7ebd.preview.localhost"
}
```

Store the returned `sandboxId` and `previewUrl` in the frontend state and use `previewUrl` for rendering the live preview.

---

### 3. Fetch Projects

**Endpoint**
`GET http://localhost/api/sandbox/projects`

**Response**

```json
{
  "message": "Projects fetched successfully",
  "projects": [...]
}
```

Display the returned projects list in the Projects page/dashboard and allow users to select a project before starting a sandbox.

Note: All these apis are protected so make sure to include credentials when making API requests.