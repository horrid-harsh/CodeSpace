import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    googleId: { type: String, required: true, unique: true },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export default User;