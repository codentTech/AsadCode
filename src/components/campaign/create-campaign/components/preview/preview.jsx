import React from "react";

function Preview({ campaignData, handleChange }) {
  // Calculate commission payment if applicable
  const commissionPayment =
    campaignData.compensationType === "commission" &&
    campaignData.productPrice &&
    campaignData.commissionPercentage
      ? (
          (parseFloat(campaignData.productPrice) *
            parseFloat(campaignData.commissionPercentage)) /
          100
        ).toFixed(2)
      : 0;
  return (
    <div className="space-y-6">
      <div className="space-y-6 p-2 border border-gray-300 rounded-md bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {campaignData.campaignTitle || "Untitled Campaign"}
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
              {campaignData.campaignTypes.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {campaignData.niches.map((niche) => (
                <span
                  key={niche}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {niche}
                </span>
              ))}
            </div>
          </div>

          {campaignData.campaignImage && (
            <img
              src={campaignData.campaignImage}
              alt="Campaign"
              className="h-24 w-24 object-cover rounded-md"
            />
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700">
            Audience Requirements
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Minimum {campaignData.minCombinedFollowers.toLocaleString() || "0"}{" "}
            combined followers
          </p>

          {Object.entries(campaignData.platformMinimums).some(
            ([_, value]) => value
          ) && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(campaignData.platformMinimums).map(
                ([platform, value]) =>
                  value ? (
                    <div key={platform} className="flex items-center space-x-1">
                      <span className="text-xs capitalize">{platform}:</span>
                      <span className="text-xs font-medium">
                        {parseInt(value).toLocaleString()}
                      </span>
                    </div>
                  ) : null
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700">Compensation</h3>
          <p className="mt-1 text-sm text-gray-600">
            {campaignData.compensationType === "fixed"
              ? "Fixed Payment"
              : campaignData.compensationType === "gifted"
                ? "Product Gifting Only (No Payment)"
                : campaignData.compensationType === "commission"
                  ? `Commission-Based: ${campaignData.commissionPercentage}% per sale ($${commissionPayment} per item)`
                  : "Not specified"}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700">Logistics</h3>
          <p className="mt-1 text-sm text-gray-600">
            {campaignData.isRemote ? "Remote" : ""}
            {campaignData.inPersonRequired
              ? campaignData.isRemote
                ? " / In-Person Required"
                : "In-Person Required"
              : ""}
          </p>

          {campaignData.inPersonRequired && campaignData.locationDetails && (
            <p className="mt-1 text-xs text-gray-600">
              {campaignData.locationDetails}
            </p>
          )}

          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-700">
              Required Platforms:
            </h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {campaignData.requiredPlatforms.map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {campaignData.applicationDeadline && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Deadline:</span>{" "}
              {new Date(campaignData.applicationDeadline).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700">Description</h3>
          <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
            {campaignData.shortDescription || "No description provided."}
          </p>

          {campaignData.longDescription && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">
                Detailed Brief:
              </h4>
              <div className="mt-1 text-xs text-gray-600 whitespace-pre-line p-3 bg-gray-50 rounded-md">
                {campaignData.longDescription}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            name="termsAgreed"
            checked={campaignData.termsAgreed}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>
      </div>
    </div>
  );
}

export default Preview;
