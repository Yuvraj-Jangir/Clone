// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// export default function Channel() {
//   const { id } = useParams(); // channel owner id
//   const { API, authHeaders, user } = useAuth();
//   const nav = useNavigate();

//   const [info, setInfo] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     setLoading(true);
//     try {
//       // fetch channel by owner ID
//       const { data } = await axios.get(`${API}/api/channels/owner/${id}`);
//       setInfo(data);

//       // fetch videos
//       const v = await axios.get(`${API}/api/channels/${data._id}/videos`);
//       setVideos(v.data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!user) {
//       nav("/signin");
//     } else {
//       load();
//     }
//   }, [id, user]);

//   // Check if logged-in user is owner
//   const canManage = user && info && user.id === info.owner;

//   // CRUD operations
//   async function createOrUpdate(video) {
//     try {
//       if (video._id) {
//         await axios.put(`${API}/api/videos/${video._id}`, video, {
//           headers: authHeaders(),
//         });
//       } else {
//         await axios.post(
//           `${API}/api/videos`,
//           { ...video, channel: info._id },
//           { headers: authHeaders() }
//         );
//       }
//       await load();
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   async function del(vId) {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
//     await axios.delete(`${API}/api/videos/${vId}`, { headers: authHeaders() });
//     await load();
//   }

//   if (loading) return <div className="container">Loading...</div>;

//   if (!info)
//     return (
//       <div className="container">
//         <p>Channel not found. You may need to create one first.</p>
//         {user && <Link to="/create-channel" className="btn primary">Create Channel</Link>}
//       </div>
//     );

//   return (
//     <div className="container">
//       <h2>{info.channelName}</h2>
//       <p style={{ color: "var(--muted)" }}>{info.description}</p>

//       {canManage && <Editor onSave={createOrUpdate} />}

//       <h3>Videos</h3>
//       <div className="grid">
//         {videos.map((v) => (
//           <div key={v._id} className="card">
//             <Link to={"/watch/" + v._id}>
//               <img src={v.thumbnailUrl} alt={v.title} />
//             </Link>
//             <div className="p">
//               <div style={{ fontWeight: 600 }}>{v.title}</div>
//               {canManage && (
//                 <div className="row" style={{ gap: 8 }}>
//                   <Editor initial={v} onSave={createOrUpdate} />
//                   <button className="btn" onClick={() => del(v._id)}>
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function Editor({ initial = {}, onSave }) {
//   const [title, setTitle] = useState(initial.title || "");
//   const [description, setDescription] = useState(initial.description || "");
//   const [videoUrl, setVideoUrl] = useState(initial.videoUrl || "");
//   const [thumbnailUrl, setThumbnailUrl] = useState(initial.thumbnailUrl || "");
//   const [categories, setCategories] = useState((initial.categories || []).join(","));

//   return (
//     <div className="card" style={{ padding: 12, margin: "12px 0" }}>
//       <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
//         <input
//           className="input"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <input
//           className="input"
//           placeholder="Video URL"
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//         />
//         <input
//           className="input"
//           placeholder="Thumbnail URL"
//           value={thumbnailUrl}
//           onChange={(e) => setThumbnailUrl(e.target.value)}
//         />
//         <input
//           className="input"
//           placeholder="Categories (comma-separated)"
//           value={categories}
//           onChange={(e) => setCategories(e.target.value)}
//         />
//         <button
//           className="btn primary"
//           onClick={() =>
//             onSave({
//               ...(initial._id ? { _id: initial._id } : {}),
//               title,
//               description,
//               videoUrl,
//               thumbnailUrl,
//               categories: categories
//                 .split(",")
//                 .map((s) => s.trim())
//                 .filter(Boolean),
//             })
//           }
//         >
//           {initial._id ? "Update" : "Upload"}
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Channel() {
  const { id } = useParams(); // channel ID from URL
  const { API, authHeaders, user } = useAuth();

  const [info, setInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadChannel() {
    setLoading(true);
    try {
      // Fetch channel info by ID
      const { data } = await axios.get(`${API}/api/channels/${id}`);
      setInfo(data);

      // Fetch all videos for this channel
      const res = await axios.get(`${API}/api/channels/${id}/videos`);
      setVideos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChannel();
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (!info)
    return (
      <div className="container">
        <p>Channel not found.</p>
      </div>
    );

  // Check if logged-in user is owner
  const canManage = user && info.owner === user.id;

  return (
    <div className="container">
      <h2>{info.channelName}</h2>
      <p style={{ color: "var(--muted)" }}>{info.description}</p>

      {canManage && (
        <Editor
          onSave={async (video) => {
            try {
              if (video._id) {
                await axios.put(`${API}/api/videos/${video._id}`, video, {
                  headers: authHeaders(),
                });
              } else {
                await axios.post(
                  `${API}/api/videos`,
                  { ...video, channel: info._id },
                  { headers: authHeaders() }
                );
              }
              await loadChannel();
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      <h3>Videos</h3>
      <div className="grid">
        {videos.map((v) => (
          <div key={v._id} className="card">
            <a href={"/watch/" + v._id}>
              <img src={v.thumbnailUrl} alt={v.title} />
            </a>
            <div className="p">
              <div style={{ fontWeight: 600 }}>{v.title}</div>
              {canManage && (
                <div className="row" style={{ gap: 8 }}>
                  <Editor
                    initial={v}
                    onSave={async (video) => {
                      try {
                        await axios.put(`${API}/api/videos/${v._id}`, video, {
                          headers: authHeaders(),
                        });
                        await loadChannel();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                  <button
                    className="btn"
                    onClick={async () => {
                      if (!window.confirm("Delete this video?")) return;
                      await axios.delete(`${API}/api/videos/${v._id}`, {
                        headers: authHeaders(),
                      });
                      await loadChannel();
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Video editor component
function Editor({ initial = {}, onSave }) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [videoUrl, setVideoUrl] = useState(initial.videoUrl || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initial.thumbnailUrl || "");
  const [categories, setCategories] = useState(
    (initial.categories || []).join(",")
  );

  return (
    <div className="card" style={{ padding: 12, margin: "12px 0" }}>
      <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <input
          className="input"
          placeholder="Thumbnail URL"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
        <input
          className="input"
          placeholder="Categories (comma-separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
        <button
          className="btn primary"
          onClick={() =>
            onSave({
              ...(initial._id ? { _id: initial._id } : {}),
              title,
              description,
              videoUrl,
              thumbnailUrl,
              categories: categories
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        >
          {initial._id ? "Update" : "Upload"}
        </button>
      </div>
    </div>
  );
}
