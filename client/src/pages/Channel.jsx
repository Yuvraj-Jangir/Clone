// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// export default function Channel() {
//   const { id } = useParams(); // Channel ID from URL
//   const { API, authHeaders, user } = useAuth();

//   const [info, setInfo] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showEditor, setShowEditor] = useState(false); // Toggle upload form

//   async function loadChannel() {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${API}/api/channels/${id}`);
//       setInfo(data);

//       const res = await axios.get(`${API}/api/channels/${id}/videos`);
//       setVideos(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadChannel();
//   }, [id]);

//   if (loading) return <div className="container">Loading...</div>;
//   if (!info)
//     return (
//       <div className="container">
//         <p>Channel not found.</p>
//       </div>
//     );

//   const canManage = user && info.owner === user.id;

//   return (
//     <div className="container">
//       {/* Channel Header */}
//       <h2>{info.channelName}</h2>
//       <p style={{ color: "blue" }}>{info.description}</p>
//       <img
//         src={info.channelBanner}
//         alt={`${info.channelName} banner`}
//         style={{
//           width: "100%",
//           maxWidth: "400px",
//           height: "120px",
//           objectFit: "contain",
//           borderRadius: "8px",
//           display: "block",
//           marginBottom: "16px",
//         }}
//       />

//       {/* Upload Video Button */}
//       {canManage && (
//         <>
//           <button
//             className="btn primary"
//             onClick={() => setShowEditor((prev) => !prev)}
//           >
//             {showEditor ? "Cancel Upload" : "Upload Video"}
//           </button>

//           {showEditor && (
//             <Editor
//               onSave={async (video) => {
//                 try {
//                   if (video._id) {
//                     await axios.put(`${API}/api/videos/${video._id}`, video, {
//                       headers: authHeaders(),
//                     });
//                   } else {
//                     await axios.post(
//                       `${API}/api/videos`,
//                       { ...video, channel: info._id },
//                       { headers: authHeaders() }
//                     );
//                   }
//                   setShowEditor(false);
//                   await loadChannel();
//                 } catch (err) {
//                   console.error(err);
//                 }
//               }}
//             />
//           )}
//         </>
//       )}

//       {/* Videos Grid */}
//       <h3>Videos</h3>
//       <div className="grid" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
//         {videos.map((v) => (
//           <div key={v._id} className="card" style={{ width: "250px" }}>
//             <a href={"/watch/" + v._id}>
//               <img
//                 src={v.thumbnailUrl}
//                 alt={v.title}
//                 style={{
//                   width: "100%",
//                   height: "140px",
//                   objectFit: "contain",
//                   borderRadius: "6px",
//                 }}
//               />
//             </a>
//             <div className="p" style={{ padding: "8px 0" }}>
//               <div style={{ fontWeight: 600 }}>{v.title}</div>

//               {canManage && (
//                 <div className="row" style={{ gap: 8, marginTop: 8 }}>
//                   {/* Inline editor for each video */}
//                   <Editor
//                     initial={v}
//                     onSave={async (video) => {
//                       try {
//                         await axios.put(`${API}/api/videos/${v._id}`, video, {
//                           headers: authHeaders(),
//                         });
//                         await loadChannel();
//                       } catch (err) {
//                         console.error(err);
//                       }
//                     }}
//                   />
//                   <button
//                     className="btn"
//                     onClick={async () => {
//                       if (!window.confirm("Delete this video?")) return;
//                       await axios.delete(`${API}/api/videos/${v._id}`, {
//                         headers: authHeaders(),
//                       });
//                       await loadChannel();
//                     }}
//                   >
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

// // Video Editor Component
// function Editor({ initial = {}, onSave }) {
//   const [title, setTitle] = useState(initial.title || "");
//   const [description, setDescription] = useState(initial.description || "");
//   const [videoUrl, setVideoUrl] = useState(initial.videoUrl || "");
//   const [thumbnailUrl, setThumbnailUrl] = useState(initial.thumbnailUrl || "");
//   const [categories, setCategories] = useState(
//     (initial.categories || []).join(",")
//   );

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
  const { id } = useParams();
  const { API, authHeaders, user } = useAuth();

  const [info, setInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadEditor, setShowUploadEditor] = useState(false); // Upload Video toggle
  const [editingVideoId, setEditingVideoId] = useState(null); // Which video is being edited

  async function loadChannel() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/channels/${id}`);
      setInfo(data);
      const res = await axios.get(`${API}/api/channels/${id}/videos`);
      setVideos(res.data);
    } catch (err) {
      console.error(err);
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

  const canManage = user && info.owner === user.id;

  return (
    <div className="container">
      {/* Channel Header */}
      <h2>{info.channelName}</h2>
      <p style={{ color: "blue" }}>{info.description}</p>
      <img
        src={info.channelBanner}
        alt={`${info.channelName} banner`}
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "120px",
          objectFit: "contain",
          borderRadius: "8px",
          display: "block",
          marginBottom: "16px",
        }}
      />

      {/* Upload Video Button */}
      {canManage && (
        <>
          <button
            className="btn primary"
            onClick={() => setShowUploadEditor((prev) => !prev)}
          >
            {showUploadEditor ? "Cancel Upload" : "Upload Video"}
          </button>

          {showUploadEditor && (
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
                  setShowUploadEditor(false);
                  await loadChannel();
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          )}
        </>
      )}

      {/* Videos Grid */}
      <h3>Videos</h3>
      <div
        className="grid"
        style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
      >
        {videos.map((v) => (
          <div key={v._id} className="card" style={{ width: "250px" }}>
            <a href={"/watch/" + v._id}>
              <img
                src={v.thumbnailUrl}
                alt={v.title}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "contain",
                  borderRadius: "6px",
                }}
              />
            </a>
            <div className="p" style={{ padding: "8px 0" }}>
              <div style={{ fontWeight: 600, marginLeft: "20px" }}>
                {v.title}
              </div>

              {/* Edit/Delete buttons */}
              {canManage && (
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="btn"
                    onClick={() =>
                      setEditingVideoId((prev) =>
                        prev === v._id ? null : v._id
                      )
                    }
                  >
                    {editingVideoId === v._id ? "Cancel" : "Edit"}
                  </button>
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

              {/* Video Editor (shown only for this video) */}
              {editingVideoId === v._id && (
                <Editor
                  initial={v}
                  onSave={async (video) => {
                    try {
                      await axios.put(`${API}/api/videos/${v._id}`, video, {
                        headers: authHeaders(),
                      });
                      setEditingVideoId(null); // hide editor after save
                      await loadChannel();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Video Editor Component
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
