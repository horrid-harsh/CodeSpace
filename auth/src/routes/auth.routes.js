import { Router } from "express";
import User from "../model/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sendAuthNotification } from "../config/mq.js";

const router = Router();

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

      await sendAuthNotification({
        userId: user._id,
        action: "google_login",
        timestamp: new Date(),
        email: emails[0].value,
      });

      if (!user) {
        user = new User({
          googleId: id,
          name: displayName,
          email: emails[0].value,
          avatar: photos[0].value,
        });
        await user.save();
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
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  },
);

export default router;
