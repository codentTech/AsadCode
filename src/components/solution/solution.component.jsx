import useSolution from "./use-solution.hook";

export default function CleerCutSolution() {
  const { isCreatorMode, features } = useSolution();

  return (
    <div className="min-h-screen bg-white">
      {/* Header with mode toggle */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto py-2 md:py-4 px-4 sm:px-6 lg:px-8">
          <div className="mt-4 text-center">
            <h2 className="text-white text-sm md:text-lg xl:text-xl font-extrabold">
              {isCreatorMode
                ? "CleerCut empowers creators to spend less time pitching — and more time getting paid."
                : "CleerCut replaces outdated spreadsheets, ghosted DMs, and overpriced platforms — so you can actually scale."}
            </h2>
            <p className="mt-2 text-white text-sm md:text-lg xl:text-xl">
              {isCreatorMode
                ? "0% commission. Just the standard 3.2% payment processing fee."
                : "Work with creators who deliver, at a price that scales with your business."}
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300"
            >
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">{feature.icon}</div>
                <h3 className="text-sm md:text-lg font-bold ml-4 text-primary">{feature.title}</h3>
              </div>
              <p className="mt-4 text-xs md:text-sm text-gray-600">{feature.description}</p>
              {feature.points.length > 0 && (
                <ul className="mt-4 space-y-3 pl-1 md:pl-5">
                  {feature.points.map((point, i) => (
                    <li
                      key={i}
                      className="relative pl-4 text-xs md:text-sm text-gray-600 leading-relaxed"
                    >
                      <span className="absolute left-0 top-1.5 h-2 w-2 bg-indigo-500 rounded-full"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
