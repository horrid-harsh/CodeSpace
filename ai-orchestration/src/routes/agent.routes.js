import { Router } from "express";
import agent from "../agents/code.agent.js";

const agentRouter = Router();

agentRouter.post("/invoke", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await agent.invoke({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message,
    });
  }
});

export default agentRouter;
