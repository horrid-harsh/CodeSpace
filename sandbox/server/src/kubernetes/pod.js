import { env } from "process";
import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId, projectId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: "sandbox-instance",
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes: [
        {
          name: "workspace-volume",
          emptyDir: {},
        },
      ],
      initContainers: [
        {
          image: "template",
          imagePullPolicy: "IfNotPresent",
          name: "init-container",
          command: ["sh", "-c", "cp -r /workspace/. /seed"],
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/seed",
            },
          ],
        },
      ],
      containers: [
        {
          image: "template",
          imagePullPolicy: "IfNotPresent",
          name: "sandbox-container",
          ports: [{ containerPort: 5173, name: "http" }],
          env: [
            {
              name: "SANDBOX_ID",
              value: sandboxId,
            },
          ],
          resources: {
            requests: { cpu: "250m", memory: "256Mi" },
            limits: { cpu: "500m", memory: "512Mi" },
          },
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/workspace",
            },
          ],
        },
        {
          image: "agent:latest",
          imagePullPolicy: "IfNotPresent",
          name: "agent-container",
          ports: [{ containerPort: 3000, name: "http" }],
          resources: {
            requests: { cpu: "100m", memory: "128Mi" },
            limits: { cpu: "250m", memory: "256Mi" },
          },
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/workspace",
            },
          ],
        },
        {
          image: "sync-agent:latest",
          imagePullPolicy: "IfNotPresent",
          name: "sync-agent-container",
          ports: [{ containerPort: 3000, name: "http" }],
          resources: {
            requests: { cpu: "100m", memory: "128Mi" },
            limits: { cpu: "250m", memory: "256Mi" },
          },
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/workspace",
            },
          ],
          env: [
            {
              name: "PROJECT_ID",
              value: projectId,
            },
            {
              name: "AWS_REGION",
              valueFrom: {
                secretKeyRef: {
                  name: "aws",
                  key: "AWS_REGION",
                }
              }
            },
            {
              name: "AWS_ACCESS_KEY_ID",
              valueFrom: {
                secretKeyRef: {
                  name: "aws",
                  key: "AWS_ACCESS_KEY_ID",
                }
              }
            },
            {
              name: "AWS_SECRET_ACCESS_KEY",
              valueFrom: {
                secretKeyRef: {
                  name: "aws",
                  key: "AWS_SECRET_ACCESS_KEY",
                }
              }
            },
          ],
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: "default",
    body: podManifest,
  });

  return response;
}

export async function deletePod(sandboxId) {
  const response = await k8sCoreV1Api.deleteNamespacedPod(
    {
      name: `sandbox-pod-${sandboxId}`,
      namespace: "default",
    },
    { gracePeriodSeconds: 0 },
  );

  return response;
}
