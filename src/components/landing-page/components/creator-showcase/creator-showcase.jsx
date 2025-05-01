import { ArrowForward } from "@mui/icons-material";

function Showcase({ isCreatorMode }) {
  const categories = [
    {
      title: "Lifestyle & Fashion",
      image: "/assets/images/landing/hero-bg-3.jpeg",
      description: isCreatorMode
        ? "Collaborate with creators who showcase your products authentically in their daily lives."
        : "Partner with brands in the lifestyle & fashion space to amplify your presence.",
      count: isCreatorMode ? "450+ Creators" : "150+ Brands",
    },
    {
      title: "Tech & Gaming",
      image: "/assets/images/landing/hero-bg-2.jpeg",
      description: isCreatorMode
        ? "Partner with tech-savvy creators who know how to review and showcase digital products."
        : "Connect with innovative tech & gaming brands looking for creators like you.",
      count: isCreatorMode ? "320+ Creators" : "100+ Brands",
    },
    {
      title: "Food & Wellness",
      image: "/assets/images/landing/hero-bg.jpeg",
      description: isCreatorMode
        ? "Engage with creators who specialize in culinary arts and healthy lifestyle content."
        : "Collaborate with wellness brands that align with your values and audience.",
      count: isCreatorMode ? "380+ Creators" : "120+ Brands",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            {isCreatorMode
              ? "Our Creators Make The Difference"
              : "Brands Empowering Creators"}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-indigo-600 rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isCreatorMode
              ? "Connect with content creators who bring your brand vision to life"
              : "Discover forward-thinking brands ready to collaborate with top creators"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl overflow-hidden group"
            >
              <div className="rounded-xl overflow-hidden mb-6 h-64">
                <img
                  src={category.image}
                  alt={`${isCreatorMode ? "Creator" : "Brand"} - ${
                    category.title
                  }`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-2">
                <h3 className="text-xl font-bold mb-3 text-indigo-600">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    {category.count}
                  </span>
                  <button className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition">
                    Explore <ArrowForward className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Showcase;
