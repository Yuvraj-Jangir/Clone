import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import { quickSort } from "../utils/dsa";
import { useAuth } from "../context/AuthContext";

const CATS = [
  "All",
  "Programming",
  "Education",
  "React",
  "Frontend",
  "Backend",
  "Tutorial",
  "Popular",
  "New",
];

export default function Home() {
  const { API } = useAuth();
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [category, setCategory] = useState("All");
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const url = new URL(API + "/api/videos");
      if (q) url.searchParams.set("search", q);
      if (category && category !== "All") url.searchParams.set("category", category);
      const { data } = await axios.get(url.toString());
      setList(quickSort(data, (a, b) => (b.views || 0) - (a.views || 0)));
    };
    fetch();
  }, [q, category, API]);

  return (
    <div>
      <div className="chips">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={"chip " + (category === c ? "active" : "")}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid">
        {list.map((v) => (
          <VideoCard key={v._id} v={v} />
        ))}
      </div>
    </div>
  );
}
