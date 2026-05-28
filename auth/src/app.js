import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cookies from 'cookie-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import authRoutes from "../routes/auth.routes.js";

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cookies());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({
        message: "Auth is healthy",
        status: "success",
    })
})

app.get("/api/status/readyz", (req, res) => {
  res.status(200).json({
    message: "Auth is ready",
    status: "success",
  });
});

app.use("/api/auth", authRoutes);

export default app;