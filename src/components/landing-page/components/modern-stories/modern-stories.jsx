import { useState } from "react";

const stories = [
  { name: "Your Story", isPlaceholder: true },
  { name: "Sophia", src: "https://i.pravatar.cc/150?img=11" },
  { name: "Amazon", src: "https://logo.clearbit.com/amazon.com" },
  { name: "Liam", src: "https://i.pravatar.cc/150?img=25" },
  { name: "Tesla", src: "https://logo.clearbit.com/tesla.com" },
  { name: "Noah", src: "https://i.pravatar.cc/150?img=16" },
  { name: "Apple", src: "https://logo.clearbit.com/apple.com" },
  { name: "Microsoft", src: "https://logo.clearbit.com/microsoft.com" },
  { name: "Twitter", src: "https://logo.clearbit.com/twitter.com" },
];

const ModernStories = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = (e) => {
    const el = e.target;
    const percent = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;
    setScrollPercent(percent);
  };

  return (
    <div className="max-w-full p-5 bg-white/60 backdrop-blur-md rounded-2xl mx-auto shadow-xl overflow-hidden">
      <div
        className="flex overflow-x-auto gap-5 px-2 py-5 scroll-smooth scrollbar-hide"
        onScroll={handleScroll}
      >
        {stories.map((story, idx) => (
          <div
            key={idx}
            className="flex-none w-20 text-center cursor-pointer relative"
          >
            {story.isPlaceholder ? (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  Y
                </div>
                <div className="absolute bottom-[20px] right-[38px] w-5 h-5 bg-purple-600 text-white text-xs rounded-full border-2 border-white flex items-center justify-center z-10 transition-transform duration-300">
                  +
                </div>
              </>
            ) : (
              <img
                src={story.src}
                alt={story.name}
                className="w-16 h-16 rounded-full border-2 border-purple-600 object-cover shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
              />
            )}
            <span className="mt-2 block text-sm font-medium text-gray-800 truncate">
              {story.name}
            </span>
          </div>
        ))}
      </div>

      {/* <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full transition-transform duration-200"
          style={{ width: `${scrollPercent}%` }}
        ></div>
      </div> */}
    </div>
  );
};

export default ModernStories;
