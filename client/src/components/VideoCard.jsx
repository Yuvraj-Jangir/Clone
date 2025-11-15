import React from "react"; 
import { Link } from "react-router-dom";

export default function VideoCard({ v }) {
  return (
    <Link to={"/watch/" + v._id} className="card">
      <img src={v.thumbnailUrl} alt="" />
      <div className="p">
        <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{v.title}</div>
        <div style={{ color: "blue", fontSize: 14 }}>
          {v.channel?.channelName || "Unknown"} • {v.views} views
        </div>
      </div>
    </Link>
  );
}
