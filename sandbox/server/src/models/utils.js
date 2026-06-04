import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    console.error("Token verfication failed: ", error.message);
    return null;
  }
}