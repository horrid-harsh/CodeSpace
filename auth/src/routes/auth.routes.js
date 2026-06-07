import { Router } from "express";
import User from "../model/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sendAuthNotification } from "../config/mq.js";

const router = Router();

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  async (req, res) => {
    try {
      const { id, displayName, emails, photos } = req.user;
      let user = await User.findOne({ googleId: id });

      if (!user) {
        console.log("New user detected. Creating account for:", emails[0].value);
        user = new User({
          googleId: id,
          name: displayName,
          email: emails[0].value,
          avatar: photos[0].value,
        });
        await user.save();
      } else {
        console.log("Existing user logged in:", user._id);
      }

      try {
        await sendAuthNotification({
          userId: user._id,
          action: "google_login",
          timestamp: new Date(),
          email: emails[0].value,
        });
      } catch (notifyErr) {
        console.error("Failed to send auth notification:", notifyErr);
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },
);

export default router;
