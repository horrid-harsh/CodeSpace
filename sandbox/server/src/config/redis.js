import Redis from "ioredis";
import { deletePod } from "../kubernetes/pod.js";
import { deleteService } from "../kubernetes/service.js";

export const redis = new Redis(process.env.REDIS_URL);

const subscriber = new Redis(process.env.REDIS_URL);

export async function createSandboxKey(sandboxId) {
    await redis.set(`sandbox:${sandboxId}`, JSON.stringify({
        status: "active",
        createdAt: new Date()
    }), "EX", 600)
}

export async function getProjectActiveSandbox(projectId) {
    return await redis.get(`project:${projectId}:active_sandbox`);
}

export async function setProjectActiveSandbox(projectId, sandboxId) {
    await redis.set(`project:${projectId}:active_sandbox`, sandboxId);
}

export async function isSandboxActive(sandboxId) {
    const exists = await redis.exists(`sandbox:${sandboxId}`);
    return exists === 1;
}

subscriber.config("SET", "notify-keyspace-events", "Ex");

subscriber.subscribe("__keyevent@0__:expired");

subscriber.on("message", async (channel, key) => {
    console.log(`Key expired : ${key}`);

    // Only clean up Kubernetes resources if the expired key is a sandbox
    if (key.startsWith("sandbox:")) {
        const sandboxId = key.split(":")[1];
        await deletePod(sandboxId);
        await deleteService(sandboxId);
    }
});

export default { subscriber };