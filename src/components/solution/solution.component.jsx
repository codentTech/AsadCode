import { Check } from "lucide-react";
import useSolution from "./use-solution.hook";

export default function CleerCutSolution() {
  const { isCreatorMode, features } = useSolution();

  return (
    <div className="min-h-screen bg-white">
      {/* Header with mode toggle */}
      <header className="bg-primary text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-4 text-center">
            <h2 className="text-white text-xl font-extrabold">
              {isCreatorMode
                ? "CleerCut empowers creators to spend less time pitching — and more time getting paid."
                : "CleerCut replaces outdated spreadsheets, ghosted DMs, and overpriced platforms — so you can actually scale."}
            </h2>
            <p className="mt-2 text-indigo-100 text-lg">
              {isCreatorMode
                ? "0% commission. Just the standard 2.9% payment processing fee."
                : "Work with creators who deliver, at a price that scales with your business."}
            </p>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300"
            >
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold ml-4 text-primary">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                {feature.description}
              </p>
              {feature.points.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 mt-1 text-primary" size={18} />
                      <span className="text-sm text-gray-600">{point}</span>
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
