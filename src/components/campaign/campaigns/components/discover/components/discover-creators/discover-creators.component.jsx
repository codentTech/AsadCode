import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import InstagramIcon from "@/common/icons/instagram";
import TiktokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";
import { Bookmark, ChevronRight, Mail, SquarePlus, Trash2 } from "lucide-react";
import useDiscoverDreatorsHook from "./use-discover-creators.hook";

function DiscoverCreators({
  sortOptions,
  selectedShortlist,
  mockNicheCategories,
  handleCreatorPreview,
  handleSaveToShortlist,
  handleMessageCreator,
  getSortedCreators,
  handleRemoveFromShortlist,
}) {
  const { scrollRefs, overflowStates } = useDiscoverDreatorsHook({ mockNicheCategories });

  // Social media icons mapping
  const PlatformIcons = {
    instagram: <InstagramIcon />,
    youtube: <YoutubeIcon />,
    tiktok: <TiktokIcon />,
  };

  const handleSeeMoreClick = (categoryId) => {
    const el = scrollRefs.current[categoryId];
    if (el) {
      el.scrollBy({ left: 300, behavior: "smooth" }); // You can adjust 300 to scroll more/less
    }
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
                No creators in this shortlist yet. Browse the Discover+ feed to add creators.
              </div>
            </div>
          ) : (
            <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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

                      <h4 className="text-base font-medium text-gray-800">{creator.name}</h4>
                      <p className="text-sm text-gray-500 text-center">{creator.location}</p>

                      <div className="flex items-center mt-1 text-yellow-400 text-sm">
                        {"★".repeat(Math.floor(creator.rating))}
                        {"☆".repeat(5 - Math.floor(creator.rating))}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {creator.followers.toLocaleString()} followers
                      </p>

                      <div className="flex justify-center space-x-2 mt-2 text-gray-600 text-md">
                        {creator.platforms.map((platform) => (
                          <span key={platform}>{PlatformIcons[platform] || platform}</span>
                        ))}
                      </div>

                      <div className="flex justify-center mt-3 w-full">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromShortlist(creator.id);
                          }}
                          className="px-1 rounded-full text-blue-600 hover:bg-blue-50 transition"
                          title="Save"
                        >
                          <Trash2 color="#f20707" />
                        </div>
                        <div
                          className="px-1 rounded-full text-green-600 hover:bg-green-50 transition"
                          title="Add"
                        >
                          <SquarePlus color="#666666" />
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageCreator(creator);
                          }}
                          className="px-1 rounded-full text-purple-600 hover:bg-purple-50 transition"
                          title="Message"
                        >
                          <Mail color="#666666" />
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

                {overflowStates[category.id] && (
                  <div
                    onClick={() => handleSeeMoreClick(category.id)}
                    className="text-primary text-sm font-medium flex items-center gap-1 cursor-pointer"
                  >
                    See More
                    <span>
                      <ChevronRight size="15px" />
                    </span>
                  </div>
                )}
              </div>

              <div
                ref={(el) => {
                  scrollRefs.current[category.id] = el;
                }}
                className="flex overflow-x-auto space-x-4 pb-4 mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scroll-smooth snap-x"
              >
                {category.creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex-shrink-0 snap-start w-52 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer bg-gray-100 border border-gray-100"
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
                        <p className="text-sm text-gray-500 text-center">{creator.location}</p>
                        <div className="flex items-center mt-1 text-yellow-400 text-sm">
                          {"★".repeat(Math.floor(creator.rating))}
                          {"☆".repeat(5 - Math.floor(creator.rating))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {creator.followers.toLocaleString()} followers
                        </p>
                        <div className="flex justify-center space-x-2 mt-2 text-gray-600 text-md">
                          {creator.platforms.map((platform) => (
                            <span key={platform}>{PlatformIcons[platform] || platform}</span>
                          ))}
                        </div>
                        <div className="flex justify-center mt-3 w-full">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveToShortlist(creator);
                            }}
                            className="px-1 rounded-full text-blue-600 hover:bg-blue-50 transition"
                            title="Save"
                          >
                            <Bookmark color="#666666" />
                          </div>
                          <div
                            className="px-1 rounded-full text-green-600 hover:bg-green-50 transition"
                            title="Add"
                          >
                            <SquarePlus color="#666666" />
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessageCreator(creator);
                            }}
                            className="px-1 rounded-full text-purple-600 hover:bg-purple-50 transition"
                            title="Message"
                          >
                            <Mail color="#666666" />
                          </div>
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
