import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import DeleteIconRed from "@/common/icons/deletered.icon";
import { ArrowForward, EmailOutlined } from "@mui/icons-material";
import useDiscoverDreatorsHook from "./use-discover-creators.hook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

function DiscoverCreators({
  sortOptions,
  selectedShortlist,
  mockNicheCategories,
  handleCreatorPreview,
  handleSaveToShortlist,
  handleMessageCreator,
  getSortedCreators,
}) {
  const { router } = useDiscoverDreatorsHook();

  // Social media icons mapping
  const PlatformIcons = {
    instagram: <InstagramIcon />,
    youtube: <YouTubeIcon />,
    tiktok: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  };
  return (
    <div className="flex-1 p-3 overflow-y-auto">
      {selectedShortlist ? (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-primary text-bold">{selectedShortlist.name}</h3>

            <SimpleSelect
              placeHolder="Select an option"
              options={sortOptions}
              className="w-full max-w-[200px]"
            />
          </div>

          {getSortedCreators().length === 0 ? (
            <div className="text-center py-10">
              <div className="text-gray-500">
                No creators in this shortlist yet. Browse the Discover+ feed to
                add creators.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {getSortedCreators().map((creator) => (
                <div
                  key={creator.id}
                  className="w-full rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-100"
                  onClick={() => handleCreatorPreview(creator)}
                >
                  <div className="p-4">
                    <div className="flex flex-col items-center">
                      <img
                        src={creator.profileImage}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full mb-3 object-cover"
                      />

                      <h4 className="text-base font-medium text-gray-800">
                        {creator.name}
                      </h4>
                      <p className="text-sm text-gray-500 text-center">
                        {creator.location}
                      </p>

                      <div className="flex items-center mt-1 text-yellow-400 text-sm">
                        {"★".repeat(Math.floor(creator.rating))}
                        {"☆".repeat(5 - Math.floor(creator.rating))}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {creator.followers.toLocaleString()} followers
                      </p>

                      <div className="flex justify-center space-x-2 mt-2 text-gray-600 text-md">
                        {creator.platforms.map((platform) => (
                          <span key={platform}>
                            {PlatformIcons[platform] || platform}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-center items-center gap-2 mt-3 w-full">
                        <div
                          onClick={() => handleRemoveFromShortlist(creator.id)}
                        >
                          <DeleteIconRed />
                        </div>
                        <button
                          className="px-1 rounded-full text-green-600 hover:bg-green-50 transition"
                          title="Add"
                        >
                          ➕
                        </button>
                        <div
                          className="ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageCreator(creator);
                          }}
                        >
                          <EmailOutlined sx={{ color: "gray" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-primary text-bold mb-3">Discover Creators</h1>
          {mockNicheCategories.map((category) => (
            <div key={category.id} className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h4>{category.name}</h4>
                <div className="text-primary text-sm hover:underline font-medium flex items-center gap-1">
                  See More
                  <span>
                    <ArrowForward sx={{ size: "10px" }} />
                  </span>
                </div>
              </div>

              <div className="flex overflow-x-auto space-x-4 pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                {category.creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex-shrink-0 w-52 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-100"
                    onClick={() => handleCreatorPreview(creator)}
                  >
                    <div className="p-4">
                      <div className="flex flex-col items-center">
                        <img
                          src={creator.profileImage}
                          alt={creator.name}
                          className="w-16 h-16 rounded-full mb-3 object-cover"
                        />

                        <h4>{creator.name}</h4>
                        <p className="text-sm text-gray-500 text-center">
                          {creator.location}
                        </p>

                        <div className="flex items-center mt-1 text-yellow-400 text-sm">
                          {"★".repeat(Math.floor(creator.rating))}
                          {"☆".repeat(5 - Math.floor(creator.rating))}
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          {creator.followers.toLocaleString()} followers
                        </p>

                        <div className="flex justify-center space-x-2 mt-2 text-gray-600 text-md">
                          {creator.platforms.map((platform) => (
                            <span key={platform}>
                              {PlatformIcons[platform] || platform}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-center mt-3 w-full">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveToShortlist(creator);
                            }}
                            className="px-1 rounded-full text-blue-600 hover:bg-blue-50 transition"
                            title="Save"
                          >
                            🔖
                          </button>

                          <button
                            className="px-1 rounded-full text-green-600 hover:bg-green-50 transition"
                            title="Add"
                          >
                            ➕
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessageCreator(creator);
                            }}
                            className="px-1 rounded-full text-purple-600 hover:bg-purple-50 transition"
                            title="Message"
                          >
                            ✉️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscoverCreators;
