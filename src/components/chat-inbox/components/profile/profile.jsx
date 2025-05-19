import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";

function Profile({ isCreatorMode, activeTab }) {
  const suggestedConnections = [
    {
      name: "Michelle Clarke",
      rating: 4.5,
      avatar,
      categories: ["Skincare", "Makeup", "Fashion"],
    },
    {
      name: "Miran Johnson",
      rating: 4.2,
      avatar,
      categories: ["Running", "Fashion", "Fitness"],
    },
    {
      name: "Amir Ebrahim",
      rating: 4.0,
      avatar,
      categories: ["Travel", "Adventure", "Fitness"],
    },
  ];

  const privateNotes = [
    {
      text: "Mention the brand in the first 5 seconds",
      timestamp: "2025-04-23 10:12 AM",
    },
    { text: "Use trending audio", timestamp: "2025-04-23 10:15 AM" },
    {
      text: "Tag the brand and use hashtag #SpringLaunch",
      timestamp: "2025-04-23 10:18 AM",
    },
  ];

  const reviews = [
    {
      avatar: "https://i.pravatar.cc/40?img=1",
      name: "Jane Doe",
      rating: 4,
      date: "2025-04-22",
      message:
        "Amazing collaboration! Delivered on time and exceeded expectations.",
    },
    {
      avatar: "https://i.pravatar.cc/40?img=2",
      name: "John Smith",
      rating: 5,
      date: "2025-04-21",
      message:
        "Professional, creative, and very communicative. Highly recommend!",
    },
  ];

  return (
    <div className="w-1/4 border-l bg-white flex flex-col">
      {/* Selected user profile - modern and clean design */}
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b">
        <div className="relative">
          <Avatar
            src={avatar}
            alt="Sam Waters"
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            S
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
        </div>
        <h3>Sam Waters</h3>

        <p className="primary-text text-center">
          Fitness and lifestyle creator based in Los Angeles
        </p>
        {![1, 2].includes(activeTab) && (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="font-bold text-gray-800">458</div>
                <div className="primary-text">Posts</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="font-bold text-gray-800">24.5K</div>
                <div className="primary-text">Followers</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="font-bold text-gray-800">1.2K</div>
                <div className="primary-text">Following</div>
              </div>
            </div>
          </div>
        )}
        {[3].includes(activeTab) && !isCreatorMode ? (
          <div className="flex gap-2 mt-1 w-full">
            <CustomButton
              className="flex-1 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              text="Accepts"
            />
            <CustomButton
              className="flex-1 py-1.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-danger-loght transition-colors"
              text="Reject"
            />
          </div>
        ) : (
          [3].includes(activeTab) &&
          isCreatorMode && (
            <CustomButton
              className="w-full btn-outline"
              text="Withdraw application"
            />
          )
        )}
      </div>

      {/* Suggested connections - modern card design */}
      {![1, 2, 3, 5].includes(activeTab) && (
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-sm text-gray-700">
              Suggested Connections
            </h4>
            <IconButton
              size="small"
              className="text-gray-400 hover:text-primary"
            >
              <RefreshIcon fontSize="small" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="space-y-3">
            {suggestedConnections.map((connection) => (
              <div
                key={connection.name}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 border border-gray-100 shadow-sm"
              >
                <Avatar
                  src={connection.avatar}
                  alt={connection.name}
                  className="h-10 w-10"
                >
                  {connection.name.charAt(0)}
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-800 truncate">
                    {connection.name}
                  </div>
                  <div className="flex items-center">
                    <div className="text-yellow-500 text-xs mr-1">★★★★</div>
                    <span className="text-xs text-gray-500">
                      {connection.rating}
                    </span>
                  </div>
                </div>
                <button className="ml-2 text-xs bg-indigo-50 text-primary hover:bg-indigo-100 px-2 py-1 rounded-full font-medium">
                  Connect
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-primary text-sm font-medium hover:text-indigo-800 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
            View More
          </button>
        </div>
      )}

      {/* Demographics section */}
      {[3, 5].includes(activeTab) && !isCreatorMode && (
        <div className="overflow-y-auto p-3">
          <AudienceDemographics className="grid grid-cols-1" />
        </div>
      )}

      {[1, 2].includes(activeTab) && (
        <div className="flex flex-col gap-6 p-3 bg-gray-50 rounded-lg shadow-sm overflow-y-auto">
          {/* Contract Info */}
          <div className="bg-white rounded-lg p-4 shadow border">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Contract Agreement
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">🎥</span>
                <span>1 Instagram video</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500">📸</span>
                <span>2 Instagram stories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">📅</span>
                <span>
                  Deadline: <span className="font-semibold">20 May 2025</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">💰</span>
                <span>
                  Price: <span className="font-semibold">$600</span>
                </span>
              </li>
              {activeTab === 2 && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">✔️</span>
                  <span>
                    Payment status:{" "}
                    <span className="font-semibold">Completed</span>
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border">
            <h4 className="text-base font-medium text-gray-800 mb-2">Review</h4>
            <ul className="space-y-3 text-sm text-gray-700 mb-4">
              I had an amazing experience with this company! The customer
              service was top-notch, and the product exceeded my expectations. I
              highly recommend them to anyone looking for quality products and
              excellent service
            </ul>
            <CustomInput placeholder="leave a review" />
          </div>

          {/* Private Notes Section */}
          <div className="bg-white rounded-lg p-4 shadow border">
            <h4 className="text-base font-medium text-gray-800 mb-2">
              Private Notes
            </h4>
            <ul className="space-y-3 text-sm text-gray-700 mb-4">
              {privateNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">📝</span>
                  <div className="flex flex-col">
                    <span>{note.text}</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {note.timestamp}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {!isCreatorMode && <TextArea label="Add a new note..." />}
          </div>
        </div>
      )}

      {[5].includes(activeTab) && isCreatorMode && (
        <div className="overflow-y-auto space-y-2 px-2 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mt-2">Reviews</h3>

          {reviews.map((review, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-lg p-4 shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {review.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.972a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.286 3.972c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.197-1.539-1.118l1.285-3.972a1 1 0 00-.364-1.118L2.05 9.4c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.972z" />
                  </svg>
                ))}
              </div>

              {/* Review Message */}
              <p className="text-xs text-gray-700">{review.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
