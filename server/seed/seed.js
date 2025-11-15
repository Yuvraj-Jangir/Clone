import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    await Promise.all([
        User.deleteMany({}),
        Channel.deleteMany({}),
        Video.deleteMany({}),
        Comment.deleteMany({}),
    ]);

    const passwordHash = await bcrypt.hash("Password123!", 10);
    const user = await User.create({
        username: "JohnDoe",
        email: "john@example.com",
        passwordHash,
        avatar: "https://example.com/avatar/johndoe.png",
    });
    const channel = await Channel.create({
        channelName: "Code with John",
        owner: user._id,
        description: "Coding tutorials and tech reviews by John Doe.",
        channelBanner: "https://example.com/banners/john_banner.png",
        subscribers: 5200,
    });

    const sampleVideos = [{
            title: "Learn React in 30 Minutes",
            description: "A quick tutorial to get started with React.",
            videoUrl: "http://localhost:5001/videos/react.mp4",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
            categories: ["Programming", "Frontend", "React", "Education"],
        },
        {
            title: "Learn React in 30 Minutes",
            description: "A quick tutorial to get started with React.",
            videoUrl: "http://localhost:5001/videos/react.mp4",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
            categories: ["Programming", "Frontend", "React", "Education"],
        },
        {
            title: "Learn React in 30 Minutes",
            description: "A quick tutorial to get started with React.",
            videoUrl: "http://localhost:5001/videos/react.mp4",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
            categories: ["Programming", "Frontend", "React", "Education"],
        },
    ];

    const videos = await Promise.all(
        sampleVideos.map((v) =>
            Video.create({
                ...v,
                channel: channel._id,
                uploader: user._id,
                views: 15200,
                likes: 1023,
                dislikes: 45,
            })
        )
    );

    await Comment.create({
        video: videos[0]._id,
        user: user._id,
        text: "Great video! Very helpful.",
    });

    console.log("Seeded");
    process.exit(0);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});