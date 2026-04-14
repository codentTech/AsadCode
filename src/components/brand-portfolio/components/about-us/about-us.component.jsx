"use client";

function AboutUs({ overview }) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">About the Brand</h3>
          <p className="text-sm text-gray-500 mt-1">
            Share your mission, values, and the type of creator collaborations you’re looking for.
          </p>
        </div>
      </div>

      {overview?.description ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm text-gray-700 leading-6 mt-4">
          {overview.description}
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500 bg-gray-50 mt-4">
          Add a compelling brand story so creators can understand who you are and what you stand
          for.
        </div>
      )}
    </section>
  );
}

export default AboutUs;
