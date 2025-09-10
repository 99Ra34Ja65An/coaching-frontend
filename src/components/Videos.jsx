import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [link, setLink] = useState("");

  const fetchVideos = async () => {
    const res = await API.get("/videos");
    setVideos(res.data);
  };

  const addVideo = async (e) => {
    e.preventDefault();
    await API.post("/videos", { link });
    setLink("");
    fetchVideos();
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Manage Videos</h2>
      <form onSubmit={addVideo} className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="YouTube Link"
          className="border p-2 flex-1"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Video
        </button>
      </form>
      <ul>
        {videos.map((video) => (
          <li key={video._id} className="mb-2">
            <a href={video.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {video.link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Videos;
