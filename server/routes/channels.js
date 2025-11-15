import express from "express";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET channel by owner ID (must be BEFORE /:id)
router.get("/owner/:ownerId", async(req, res) => {
    try {
        const channel = await Channel.findOne({ owner: req.params.ownerId }).lean();
        if (!channel)
            return res
                .status(404)
                .json({ message: "Channel not found for this user" });
        res.json(channel);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// create channel
router.post("/", requireAuth, async(req, res) => {
    const { channelName, description, channelBanner } = req.body;
    const channel = await Channel.create({
        channelName,
        description,
        channelBanner,
        owner: req.userId,
    });
    res.status(201).json(channel);
});

// get by channel id
router.get("/:id", async(req, res) => {
    const c = await Channel.findById(req.params.id).lean();
    if (!c) return res.status(404).json({ message: "Channel not found" });
    res.json(c);
});

// videos for channel
router.get("/:id/videos", async(req, res) => {
    const vids = await Video.find({ channel: req.params.id })
        .populate("channel", "channelName channelBanner subscribers")
        .sort("-createdAt")
        .lean();
    res.json(vids);
});

// GET all channels of the logged-in user
router.get("/mychannels", requireAuth, async(req, res) => {
    try {
        const channels = await Channel.find({ owner: req.userId }).lean();
        res.json(channels);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


router.get("/owner/:ownerId/all", async(req, res) => {
    try {
        const channels = await Channel.find({ owner: req.params.ownerId });
        res.json(channels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;