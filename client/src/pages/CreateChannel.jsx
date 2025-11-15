import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function CreateChannel() {
  const { API, authHeaders, user } = useAuth();
  const nav = useNavigate();
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [channelBanner, setChannelBanner] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!channelName.trim()) {
      setError("Channel name is required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        API + "/api/channels",
        { channelName, description, channelBanner },
        { headers: authHeaders() }
      );
      // Navigate to My Channels page after creation
      nav("/my-channels");
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div
        className="card"
        style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}
      >
        <h2>Create Your Channel</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            className="input"
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="input"
            placeholder="Banner URL (optional)"
            value={channelBanner}
            onChange={(e) => setChannelBanner(e.target.value)}
          />
          {error && <div style={{ color: "tomato" }}>{error}</div>}
          <button className="btn primary" disabled={loading}>
            {loading ? "Creating..." : "Create Channel"}
          </button>
        </form>
      </div>
    </div>
  );
}
