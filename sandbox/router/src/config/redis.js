import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
    console.log("Connected to Redis successfully");
});

redis.on("error", (err) => {
    console.log("Error in Redis connection: ", err);
});

export async function refreshTTL(sandboxId) {
    await redis.expire(`sandbox:${sandboxId}`, 60 * 20);
    console.log("Refreshed TTL for sandbox: ", sandboxId);
}

export async function getTTL(sandboxId) {
    return await redis.ttl(`sandbox:${sandboxId}`);
}