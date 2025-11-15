import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Channel from "../models/Channel.js";

const router = express.Router();

router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: "All fields are required" });
        if (password.length < 6)
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });

        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) return res.status(409).json({ message: "User already exists" });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            passwordHash,
            avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        username
      )}`,
        });

        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // find channel owned by this user (if any)
        const channel = await Channel.findOne({ owner: user._id }).lean();

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                channelId: channel ? channel._id : null,
            },
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.get("/me", async(req, res) => {
    try {
        const h = req.headers.authorization || "";
        const token = h.startsWith("Bearer ") ? h.slice(7) : null;
        if (!token) return res.status(401).json({ message: "No token" });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).lean();
        if (!user) return res.status(404).json({ message: "User not found" });

        const channel = await Channel.findOne({ owner: user._id }).lean();

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            channelId: channel ? channel._id : null,
        });
    } catch (e) {
        res.status(401).json({ message: "Invalid token" });
    }
});

export default router;