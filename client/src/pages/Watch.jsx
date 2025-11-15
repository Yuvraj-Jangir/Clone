// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// export default function Watch() {
//   const { id } = useParams();
//   const { API, authHeaders, user } = useAuth();
//   const [v, setV] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [text, setText] = useState("");

//   async function load() {
//     const { data } = await axios.get(API + "/api/videos/" + id);
//     setV(data);
//     const c = await axios.get(API + "/api/comments/video/" + id);
//     setComments(c.data);
//   }

//   useEffect(() => {
//     load();
//   }, [id, API]);

//   async function addComment() {
//     if (!text.trim()) return;
//     await axios.post(API + "/api/comments/video/" + id, { text }, { headers: authHeaders() });
//     setText("");
//     await load();
//   }

//   async function editComment(cid) {
//     const t = prompt("Edit comment:");
//     if (!t) return;
//     await axios.put(API + "/api/comments/" + cid, { text: t }, { headers: authHeaders() });
//     await load();
//   }

//   async function deleteComment(cid) {
//     if (!confirm("Delete?")) return;
//     await axios.delete(API + "/api/comments/" + cid, { headers: authHeaders() });
//     await load();
//   }

//   async function like(d) {
//     await axios.post(API + "/api/videos/" + id + (d === "up" ? "/like" : "/dislike"), {}, { headers: authHeaders() });
//     const { data } = await axios.get(API + "/api/videos/" + id);
//     setV(data);
//   }

//   if (!v) return <div className="container">Loading...</div>;

//   return (
//     <div className="container">
//       <video className="video" controls src={v.videoUrl} />
//       <div className="meta">
//         <h2>{v.title}</h2>
//         <div style={{ color: "blue" }}>
//           {v.channel?.channelName} • {v.views} views
//         </div>
//         <p>{v.description}</p>
//         <div className="row" style={{ gap: 12 }}>
//           <button className="btn" onClick={() => like("up")}>
//             👍 Like {v.likes}
//           </button>
//           <button className="btn" onClick={() => like("down")}>
//             👎 Dislike {v.dislikes}
//           </button>
//         </div>
//         <h3>Comments</h3>
//         {user ? (
//           <div className="row" style={{ gap: 8 }}>
//             <input className="input" placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} />
//             <button className="btn" onClick={addComment}>
//               Post
//             </button>
//           </div>
//         ) : (
//           <p>Please sign in to comment.</p>
//         )}
//         <div>
//           {comments.map((c) => (
//             <div className="comment" key={c._id}>
//               <div className="row">
//                 <img src={c.user?.avatar} width="24" height="24" style={{ borderRadius: 999 }} alt="" /> <b>{c.user?.username || "User"}</b>
//               </div>
//               <div style={{ marginTop: 6 }}>{c.text}</div>
//               {user && c.user && user.id === String(c.user._id) && (
//                 <div className="row" style={{ gap: 8, marginTop: 6 }}>
//                   <button className="btn" onClick={() => editComment(c._id)}>
//                     Edit
//                   </button>
//                   <button className="btn" onClick={() => deleteComment(c._id)}>
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Watch() {
  const { id } = useParams();
  const { API, authHeaders, user } = useAuth();
  const [v, setV] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [otherVideos, setOtherVideos] = useState([]);

  async function load() {
    const { data } = await axios.get(API + "/api/videos/" + id);
    setV(data);

    const c = await axios.get(API + "/api/comments/video/" + id);
    setComments(c.data);

    // Fetch other videos from the same channel
    if (data.channel?._id) {
      const other = await axios.get(
        `${API}/api/channels/${data.channel._id}/videos`
      );
      setOtherVideos(other.data.filter((vid) => vid._id !== id)); // exclude current video
    }
  }

  useEffect(() => {
    load();
  }, [id, API]);

  async function addComment() {
    if (!text.trim()) return;
    await axios.post(
      API + "/api/comments/video/" + id,
      { text },
      { headers: authHeaders() }
    );
    setText("");
    await load();
  }

  async function editComment(cid) {
    const t = prompt("Edit comment:");
    if (!t) return;
    await axios.put(
      API + "/api/comments/" + cid,
      { text: t },
      { headers: authHeaders() }
    );
    await load();
  }

  async function deleteComment(cid) {
    if (!confirm("Delete?")) return;
    await axios.delete(API + "/api/comments/" + cid, {
      headers: authHeaders(),
    });
    await load();
  }

  async function like(d) {
    await axios.post(
      API + "/api/videos/" + id + (d === "up" ? "/like" : "/dislike"),
      {},
      { headers: authHeaders() }
    );
    const { data } = await axios.get(API + "/api/videos/" + id);
    setV(data);
  }

  if (!v) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ display: "flex", gap: 24 }}>
      {/* Main Video */}
      <div style={{ flex: 2 }}>
        <video
          className="video"
          controls
          src={v.videoUrl}
          style={{ width: "100%" }}
        />
        <div className="meta">
          <h2>{v.title}</h2>
          <div style={{ color: "blue", marginBottom: 12 }}>
            {v.channel?.channelName} • {v.views} views
          </div>
          <p>{v.description}</p>
          <div className="row" style={{ gap: 12 }}>
            <button className="btn" onClick={() => like("up")}>
              👍 Like {v.likes}
            </button>
            <button className="btn" onClick={() => like("down")}>
              👎 Dislike {v.dislikes}
            </button>
          </div>

          <h3>Comments</h3>
          {user ? (
            <div className="row" style={{ gap: 8 }}>
              <input
                className="input"
                placeholder="Add a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button className="btn" onClick={addComment}>
                Post
              </button>
            </div>
          ) : (
            <p>Please sign in to comment.</p>
          )}

          <div>
            {comments.map((c) => (
              <div className="comment" key={c._id}>
                <div className="row" style={{ gap: 6 }}>
                  <img
                    src={c.user?.avatar}
                    width="24"
                    height="24"
                    style={{ borderRadius: 999 }}
                    alt=""
                  />{" "}
                  <b>{c.user?.username || "User"}</b>
                </div>
                <div style={{ marginTop: 6 }}>{c.text}</div>
                {user && c.user && user.id === String(c.user._id) && (
                  <div className="row" style={{ gap: 8, marginTop: 6 }}>
                    <button className="btn" onClick={() => editComment(c._id)}>
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => deleteComment(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Videos */}
      <div style={{ flex: 1 }}>
        <h3>More Videos</h3>
        <div className="grid-col">
          {otherVideos.map((vid) => (
            <Link
              key={vid._id}
              to={"/watch/" + vid._id}
              className="row card"
              style={{ gap: 12, marginBottom: 12 }}
            >
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                style={{ width: 120, height: 70, objectFit: "contain" }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{vid.title}</div>
                <div style={{ fontSize: 12, color: "blue" }}>
                  {vid.views} views
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
