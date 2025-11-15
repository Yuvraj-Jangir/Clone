import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MyChannels() {
  const { user, API } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);




//   useEffect(() => {
//     if (!user) return;

//     axios
//       .get(`${API}/api/channels/owner/${user.id}`)
//       .then(({ data }) => {
//         // Ensure we always have an array
//         const chArray = Array.isArray(data) ? data : data ? [data] : [];
//         setChannels(chArray);
//       })
//       .catch((err) => {
//         console.error(err);
//         setChannels([]);
//       })
//       .finally(() => setLoading(false));
//   }, [user, API]);




useEffect(() => {
  if (!user) return;

  axios
    .get(`${API}/api/channels/owner/${user.id}/all`)
    .then(({ data }) => {
      setChannels(data); // now data is an array of channels
    })
    .catch((err) => {
      console.error(err);
      setChannels([]);
    })
    .finally(() => setLoading(false));
}, [user, API]);


  if (!user) return <p>Please sign in to view your channels.</p>;
  if (loading) return <p>Loading your channels...</p>;
  if (channels.length === 0)
    return (
      <p>
        You have no channels yet.{" "}
        <Link to="/create-channel" className="btn primary">
          Create one
        </Link>
      </p>
    );

  return (
    <div className="container">
      <h2>My Channels</h2>
      <div className="grid">
        {channels.map((ch) => (
          <div key={ch._id} className="card">
            <img
              src={ch.channelBanner || "https://via.placeholder.com/400x150"}
              alt={ch.channelName}
            />
            <div className="p">
              <h3>{ch.channelName}</h3>
              <p>{ch.description}</p>
              <Link to={`/channel/${ch._id}`} className="btn primary">
                View Channel
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
