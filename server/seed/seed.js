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
            title: "JavaScript Crash Course",
            description: "Quick intro to JavaScript basics.",
            videoUrl: "http://localhost:5001/videos/javascript.mp4",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/500px-JavaScript-logo.png",
            categories: ["Programming", "JavaScript", "Frontend", "Tutorial"],
        },
        {
            title: "Express.js Deep Dive",
            description: "Learn how to build backend APIs with Express.js.",
            videoUrl: "http://localhost:5001/videos/express.mp4",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
            categories: ["Programming", "Backend", "Express", "Node"],
        },
        {
            title: "React Tutorial",
            description: "Understand React fundamentals step by step.",
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

    console.log("Seeded ✔");
    process.exit(0);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});