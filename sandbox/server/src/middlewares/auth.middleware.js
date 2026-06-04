import { verifyToken } from "../models/utils.js";

export function authenticateUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing",
        status: "error",
      });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({
        message: "Invalid or expired token",
        status: "error",
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: "error",
    });
  }
}
