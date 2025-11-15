import express from "express";
import Comment from "../models/Comment.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/video/:videoId", async(req, res) => {
    const list = await Comment.find({ video: req.params.videoId })
        .populate("user", "username avatar")
        .sort("-createdAt")
        .lean();
    res.json(list);
});

router.post("/video/:videoId", requireAuth, async(req, res) => {
    const c = await Comment.create({
        video: req.params.videoId,
        user: req.userId,
        text: req.body.text,
    });
    res.status(201).json(c);
});

router.put("/:id", requireAuth, async(req, res) => {
    const c = await Comment.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { $set: { text: req.body.text } }, { new: true });
    if (!c) return res.status(404).json({ message: "Not found or not owner" });
    res.json(c);
});

router.delete("/:id", requireAuth, async(req, res) => {
    const c = await Comment.findOneAndDelete({
        _id: req.params.id,
        user: req.userId,
    });
    if (!c) return res.status(404).json({ message: "Not found or not owner" });
    res.json({ ok: true });
});

export default router;