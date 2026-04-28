"use client";

function AboutUs({ overview }) {
  return (
    <section className="rounded-lg bg-white p-3 shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">About the Brand</h3>
          <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
            Share your mission, values, and the type of creator collaborations you’re looking for.
          </p>
        </div>
      </div>

      {overview?.description ? (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-700 sm:mt-4 sm:p-4 sm:text-sm">
          {overview.description}
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500 sm:mt-4 sm:p-6 sm:text-sm">
          Add a compelling brand story so creators can understand who you are and what you stand
          for.
        </div>
      )}
    </section>
  );
}

export default AboutUs;
