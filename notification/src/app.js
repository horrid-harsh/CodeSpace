import express from "express";
import morgan from "morgan";
import {sendEmail} from "./email.js";
import channel from "./mq.js";

const app = express();
app.use(morgan("dev"));

app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({
        message: "Notification Service is healthy",
        status: "success",
    })
})

app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({
        message: "Notification Service is ready",
        status: "success",
    })
})

channel.consume("auth_notification_queue", async (msg) => {
    if(msg !== null) {
        const messageContent = msg.content.toString();
        console.log("Received message from queue: ", messageContent);

        try {
    const { userId, timestamp, email } = JSON.parse(messageContent);

    const subject = "New Login Notification";

    const text =
        `A new login has been detected for your account at ${timestamp}. ` +
        `If this was not you, please secure your account immediately.`;

    const html = `
        <p>A new login has been detected for your account at <strong>${timestamp}</strong></p>
        <p>If this was not you, please secure your account immediately.</p>
    `;

    await sendEmail(email, subject, text, html);
    console.log(`Email sent successfully to ${email}`);
    channel.ack(msg);
} catch (error) {
    console.error("Error processing message:", error);
}
    } else {
        console.log("Received null message.")
    }
})

export default app;