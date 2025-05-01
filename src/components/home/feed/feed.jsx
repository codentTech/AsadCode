import React, { useState, useEffect } from "react";

const initialPosts = [
  {
    user: "Tesla Inc.",
    avatar: "https://logo.clearbit.com/tesla.com",
    content:
      "Excited to announce our latest innovation in AI and automation! ⚡🚗",
    image:
      "https://cdn.pixabay.com/photo/2019/04/25/11/45/elder-4154624_640.jpg",
    likes: 1340,
    comments: 150,
    shares: 200,
    saves: 85,
  },
  {
    user: "Jessica Carter",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content:
      "Just wrapped up a brand deal with a tech startup — big things coming! 💼💡",
    image:
      "https://cdn.pixabay.com/photo/2019/04/25/11/45/elder-4154624_640.jpg",
    likes: 940,
    comments: 88,
    shares: 40,
    saves: 60,
  },
  {
    user: "SpaceX",
    avatar: "https://logo.clearbit.com/spacex.com",
    content:
      "Falcon 9 successfully launched Starlink satellites into orbit today 🚀🌍",
    image:
      "https://cdn.pixabay.com/photo/2019/04/25/11/45/elder-4154624_640.jpg",
    likes: 2200,
    comments: 310,
    shares: 480,
    saves: 150,
  },
  {
    user: "Leo Martins",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    content: "Can’t believe my last reel hit 100k views — thank you all! 🙌📲",
    image:
      "https://cdn.pixabay.com/photo/2019/04/25/11/45/elder-4154624_640.jpg",
    likes: 1120,
    comments: 97,
    shares: 53,
    saves: 72,
  },
  {
    user: "OpenAI",
    avatar: "https://logo.clearbit.com/openai.com",
    content:
      "GPT-5 is under research! We’re excited about the next evolution of AI 💡🤖",
    image:
      "https://cdn.pixabay.com/photo/2019/04/25/11/45/elder-4154624_640.jpg",
    likes: 5000,
    comments: 720,
    shares: 900,
    saves: 420,
  },
];

const UltraPostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    const shuffled = [...initialPosts].sort(() => Math.random() - 0.5);
    setPosts(shuffled);
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  };

  const handleOutsideClick = () => setOpenDropdownIndex(null);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="w-full mx-auto">
      {posts.map((post, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-lg mb-4 shadow-lg transition-transform transform hover:scale-[1.02] max-w-2xl mx-auto relative"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <img
                src={post.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full mr-3"
              />
              <strong>{post.user}</strong>
            </div>
            <div
              className="cursor-pointer text-xl px-2 rounded hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(index);
              }}
            >
              &#8942;
              {openDropdownIndex === index && (
                <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg p-3 w-40 z-10">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    ✏️ Edit
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    🗑 Delete
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    📌 Save
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    🔗 Share
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mb-3 text-gray-800 text-sm">{post.content}</p>

          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post"
              className="w-full max-h-[500px] object-cover rounded-xl border border-gray-200"
            />
          </div>

          <div className="flex justify-around text-gray-600 text-sm mt-4 border-t pt-4">
            <span className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded cursor-pointer">
              ❤️ {post.likes} Likes
            </span>
            <span className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded cursor-pointer">
              💬 {post.comments} Comments
            </span>
            <span className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded cursor-pointer">
              🔁 {post.shares} Shares
            </span>
            <span className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded cursor-pointer">
              📌 {post.saves} Saves
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UltraPostFeed;
