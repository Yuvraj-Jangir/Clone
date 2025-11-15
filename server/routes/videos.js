import express from "express";
import Video from "../models/Video.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// query: search, category
router.get("/", async(req, res) => {
    const { search = "", category } = req.query;
    const q = {};
    if (search) q.title = { $regex: search, $options: "i" };
    if (category) q.categories = category;

    let vids = await Video.find(q)
        .populate("channel", "channelName channelBanner subscribers")
        .sort("-createdAt")
        .lean();

    // sort by views desc (if needed)
    vids.sort((a, b) => (b.views || 0) - (a.views || 0));
    res.json(vids);
});

router.get("/:id", async(req, res) => {
    const v = await Video.findById(req.params.id)
        .populate("channel", "channelName channelBanner subscribers")
        .lean();
    if (!v) return res.status(404).json({ message: "Not found" });
    res.json(v);
});

router.post("/", requireAuth, async(req, res) => {
    const {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        channel,
        categories = [],
    } = req.body;
    const v = await Video.create({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        channel,
        categories,
        uploader: req.userId,
    });
    res.status(201).json(v);
});

router.put("/:id", requireAuth, async(req, res) => {
    const v = await Video.findOneAndUpdate({ _id: req.params.id, uploader: req.userId }, { $set: req.body }, { new: true });
    if (!v) return res.status(404).json({ message: "Not found or not owner" });
    res.json(v);
});

router.delete("/:id", requireAuth, async(req, res) => {
    const v = await Video.findOneAndDelete({
        _id: req.params.id,
        uploader: req.userId,
    });
    if (!v) return res.status(404).json({ message: "Not found or not owner" });
    res.json({ ok: true });
});

// like / dislike (no real user tracking in this demo)
router.post("/:id/like", requireAuth, async(req, res) => {
    const v = await Video.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Not found" });
    v.likes += 1;
    await v.save();
    res.json({ likes: v.likes, dislikes: v.dislikes });
});

router.post("/:id/dislike", requireAuth, async(req, res) => {
    const v = await Video.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Not found" });
    v.dislikes += 1;
    await v.save();
    res.json({ likes: v.likes, dislikes: v.dislikes });
});

export default router;