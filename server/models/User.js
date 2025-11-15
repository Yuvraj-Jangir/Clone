import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);