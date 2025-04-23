import CustomButton from "@/common/components/custom-button/custom-button.component";
import {
  Message as MessageIcon,
  MoreHoriz as MoreHorizIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";

function Profile() {
  const avatar =
    "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg";

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

  return (
    <div className="w-1/4 border-l bg-white flex flex-col">
      {/* Selected user profile - modern and clean design */}
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b">
        <div className="relative">
          <Avatar
            src={avatar}
            alt="Sam Waters"
            className="h-20 w-20 border-4 border-white shadow-md"
          >
            S
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
        </div>
        <h3>Sam Waters</h3>

        <p className="primary-text text-center">
          Fitness and lifestyle creator based in Los Angeles
        </p>
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
        <div className="flex gap-2 mt-1 w-full">
          <CustomButton
            className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            text="Follow"
          />
        </div>
      </div>

      {/* Suggested connections - modern card design */}
      <div className="p-4 overflow-y-auto flex-1">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-sm text-gray-700">
            Suggested Connections
          </h4>
          <IconButton
            size="small"
            className="text-gray-400 hover:text-indigo-600"
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
              <button className="ml-2 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-full font-medium">
                Connect
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-center text-indigo-600 text-sm font-medium hover:text-indigo-800 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
          View More
        </button>
      </div>
    </div>
  );
}

export default Profile;
