import React, { useState } from "react";
import {
  faImage,
  faVideo,
  faLink,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PostFeed = () => {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

  const addPost = () => {
    if (postText.trim() === "") return;
    setPosts([{ text: postText }, ...posts]);
    setPostText("");
  };

  return (
    <div className="flex justify-center bg-[#f0f2f5]">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-5">
        {/* Create Post Section */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <textarea
              className="w-full bg-gray-100 p-3 rounded-md text-sm resize-none focus:outline-none focus:bg-gray-200"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-around text-blue-600 text-sm font-medium">
            <button className="flex items-center gap-2 hover:text-blue-800 transition">
              <FontAwesomeIcon icon={faImage} /> Photo
            </button>
            <button className="flex items-center gap-2 hover:text-blue-800 transition">
              <FontAwesomeIcon icon={faVideo} /> Video
            </button>
            <button className="flex items-center gap-2 hover:text-blue-800 transition">
              <FontAwesomeIcon icon={faLink} /> Link
            </button>
            <button className="flex items-center gap-2 hover:text-blue-800 transition">
              <FontAwesomeIcon icon={faChartBar} /> Poll
            </button>
          </div>

          <button
            onClick={addPost}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-md hover:from-blue-600 hover:to-blue-700 transition"
          >
            Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className="mt-6 space-y-4">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow-md text-sm"
            >
              {post.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostFeed;
