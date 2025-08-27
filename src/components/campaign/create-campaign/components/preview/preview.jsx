import React from "react";

function Preview({ campaignData, handleChange, isError = false, message = "", errors = {} }) {
  // Calculate commission payment if applicable
  const commissionPayment =
    campaignData.campaign_type === "Affiliate" &&
    campaignData.product_price &&
    campaignData.commission_percentage
      ? (
          (parseFloat(campaignData.product_price) *
            parseFloat(campaignData.commission_percentage)) /
          100
        ).toFixed(2)
      : 0;

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `$${parseFloat(amount).toLocaleString()}` : "";
  };

  // Helper function to format numbers
  const formatNumber = (num) => {
    return num ? parseInt(num).toLocaleString() : "";
  };

  // Helper function to get compensation display
  const getCompensationDisplay = () => {
    switch (campaignData.campaign_type) {
      case "Sponsored Post":
      case "UGC":
        if (campaignData.suggested_min && campaignData.suggested_max) {
          return `Suggested Range: ${formatCurrency(campaignData.suggested_min)} - ${formatCurrency(campaignData.suggested_max)}`;
        } else if (campaignData.fixed_price) {
          return `Fixed Payment: ${formatCurrency(campaignData.fixed_price)}`;
        } else if (campaignData.budget) {
          return `Total Budget: ${formatCurrency(campaignData.budget)} (Private)`;
        }
        return "Fixed Payment";
      case "Gifted":
        return `Product Gifting Only (Value: ${formatCurrency(campaignData.product_value)})`;
      case "Affiliate":
        return `Commission: ${campaignData.commission_percentage}% per sale (${formatCurrency(commissionPayment)} per ${formatCurrency(campaignData.product_price)} item)`;
      default:
        return "Not specified";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Campaign Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {campaignData.campaign_title || "Untitled Campaign"}
        </h1>
        <div className="h-1 bg-indigo-600 rounded-full w-24"></div>
      </div>

      {/* Campaign Image - Simple */}
      {campaignData.campaignImage && (
        <div className="flex justify-center mb-6">
          <img
            src={
              typeof campaignData.campaignImage === "string"
                ? campaignData.campaignImage
                : URL.createObjectURL(campaignData.campaignImage)
            }
            alt="Campaign"
            className="h-32 w-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Main Content - Compact Campaign Overview */}
      <div className="space-y-3">
        {/* Campaign Overview Card */}
        {campaignData.campaign_type && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-indigo-600">
              Campaign Overview
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Campaign Type</span>
              <span className="text-sm font-medium text-indigo-600">
                {campaignData.campaign_type}
              </span>
            </div>
            {campaignData.applicationDeadline && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Application Deadline</span>
                <span className="text-sm text-gray-900 font-medium">
                  {new Date(campaignData.applicationDeadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Niches & Deliverables Card - Only show if data exists */}
        {((campaignData.niches && campaignData.niches.length > 0) ||
          (campaignData.deliverables && campaignData.deliverables.length > 0)) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-indigo-600">
              Content & Niches
            </h3>
            <div className="space-y-3">
              {/* Niches */}
              {campaignData.niches && campaignData.niches.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Target Niches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {campaignData.niches.map((niche, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {campaignData.deliverables && campaignData.deliverables.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Required Deliverables
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {campaignData.deliverables.map((deliverable, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {deliverable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Audience Requirements Card - Only show if data exists */}
        {(campaignData.min_combined_followers ||
          (campaignData.required_platforms && campaignData.required_platforms.length > 0) ||
          Object.entries(campaignData.platformMinimums || {}).some(([_, value]) => value)) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-indigo-600">
              Audience Requirements
            </h3>
            <div className="space-y-3">
              {/* Min Combined Followers */}
              {campaignData.min_combined_followers && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Min Combined Followers</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {formatNumber(campaignData.min_combined_followers)}
                  </span>
                </div>
              )}

              {/* Required Platforms */}
              {campaignData.required_platforms && campaignData.required_platforms.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Required Platforms
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {campaignData.required_platforms.map((platform, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Minimums */}
              {Object.entries(campaignData.platformMinimums || {}).some(([_, value]) => value) && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Platform Minimums
                  </div>
                  <div className="space-y-1">
                    {Object.entries(campaignData.platformMinimums).map(([platform, value]) =>
                      value ? (
                        <div key={platform} className="flex justify-between py-1">
                          <span className="text-xs text-gray-600 capitalize">{platform}</span>
                          <span className="text-xs text-gray-900 font-medium">
                            {formatNumber(value)}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compensation Card - Only show if data exists */}
        {(campaignData.budget ||
          (campaignData.suggested_min && campaignData.suggested_max) ||
          campaignData.fixed_price ||
          campaignData.product_value ||
          campaignData.commission_percentage ||
          campaignData.product_price) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-indigo-600">
              Compensation & Budget
            </h3>
            <div className="space-y-3">
              {/* Campaign Type */}
              {campaignData.campaign_type && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Campaign Type</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {campaignData.campaign_type}
                  </span>
                </div>
              )}

              {/* Budget Details */}
              {campaignData.budget && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatCurrency(campaignData.budget)}{" "}
                    <span className="text-xs text-gray-500">(Private)</span>
                  </span>
                </div>
              )}

              {/* Suggested Range */}
              {campaignData.suggested_min && campaignData.suggested_max && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Suggested Range</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatCurrency(campaignData.suggested_min)} -{" "}
                    {formatCurrency(campaignData.suggested_max)}
                  </span>
                </div>
              )}

              {/* Fixed Price */}
              {campaignData.fixed_price && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fixed Payment</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatCurrency(campaignData.fixed_price)}
                  </span>
                </div>
              )}

              {/* Product Value for Gifted */}
              {campaignData.product_value && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Product Value</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatCurrency(campaignData.product_value)}
                  </span>
                </div>
              )}

              {/* Commission Details for Affiliate */}
              {campaignData.commission_percentage && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Commission Rate</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {campaignData.commission_percentage}%
                  </span>
                </div>
              )}

              {campaignData.product_price && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Product Price</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatCurrency(campaignData.product_price)}
                  </span>
                </div>
              )}

              {/* Commission Calculation */}
              {commissionPayment > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Earnings per Sale</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(commissionPayment)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eligibility & Location Card - Only show if data exists */}
        {(campaignData.isRemote ||
          campaignData.inPersonRequired ||
          campaignData.location_details ||
          campaignData.creator_country ||
          campaignData.creator_city ||
          campaignData.min_age ||
          campaignData.max_age ||
          campaignData.creator_gender ||
          campaignData.creator_language) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-indigo-600">
              Eligibility & Location Requirements
            </h3>
            <div className="space-y-3">
              {/* Location Requirements */}
              {(campaignData.isRemote || campaignData.inPersonRequired) && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Location</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Work Type</span>
                    <span className="text-sm text-indigo-600 font-medium">
                      {[
                        campaignData.isRemote && "Remote",
                        campaignData.inPersonRequired && "In-Person",
                      ]
                        .filter(Boolean)
                        .join(" & ")}
                    </span>
                  </div>

                  {campaignData.inPersonRequired && campaignData.location_details && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Location Details</span>
                      <span className="text-sm text-gray-900 text-right max-w-xs">
                        {campaignData.location_details}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Creator Requirements */}
              {[
                campaignData.creator_country,
                campaignData.creator_city,
                campaignData.min_age,
                campaignData.max_age,
                campaignData.creator_gender,
                campaignData.creator_language,
              ].some(Boolean) && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Creator Requirements
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Country",
                        value: campaignData.creator_country,
                        required: campaignData.countryRequirement === "mandatory",
                      },
                      {
                        label: "City",
                        value: campaignData.creator_city,
                        required: campaignData.cityRequirement === "mandatory",
                      },
                      {
                        label: "Age Range",
                        value:
                          campaignData.min_age || campaignData.max_age
                            ? `${campaignData.min_age || "Any"} - ${campaignData.max_age || "Any"}`
                            : null,
                        required: campaignData.ageRequirement === "mandatory",
                      },
                      {
                        label: "Gender",
                        value: campaignData.creator_gender,
                        required: campaignData.genderRequirement === "mandatory",
                      },
                      {
                        label: "Language",
                        value: campaignData.creator_language,
                        required: campaignData.languageRequirement === "mandatory",
                      },
                    ]
                      .filter((item) => item.value)
                      .map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{item.label}</span>
                          <span className="text-xs text-gray-900 font-medium">
                            {item.value}
                            {item.required && (
                              <span className="text-indigo-600 ml-1">(Required)</span>
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campaign Description & Content Card - Only show if data exists */}
        {(campaignData.short_description ||
          campaignData.long_description ||
          campaignData.hashtags ||
          campaignData.nonNegotiables ||
          (campaignData.questions &&
            campaignData.questions.filter((q) => q.trim()).length > 0)) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 pb-2 border-b border-indigo-600">
              Campaign Brief & Content
            </h3>
            <div className="space-y-3">
              {/* Short Description */}
              {campaignData.short_description && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Campaign Overview
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded">
                    {campaignData.short_description}
                  </p>
                </div>
              )}

              {/* Long Description */}
              {campaignData.long_description && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Detailed Brief
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed max-h-32 overflow-y-auto bg-gray-50 p-3 rounded border">
                    {campaignData.long_description}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {campaignData.hashtags && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Required Hashtags
                  </div>
                  <p className="text-sm text-indigo-600 font-mono bg-indigo-50 p-2 rounded">
                    {campaignData.hashtags}
                  </p>
                </div>
              )}

              {/* Guidelines */}
              {campaignData.nonNegotiables && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Content Guidelines
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                    {campaignData.nonNegotiables}
                  </div>
                </div>
              )}

              {/* Questions for Creators */}
              {campaignData.questions &&
                campaignData.questions.filter((q) => q.trim()).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Application Questions
                    </div>
                    <div className="space-y-2 bg-blue-50 p-3 rounded">
                      {campaignData.questions
                        .filter((q) => q.trim())
                        .map((question, index) => (
                          <div key={index} className="text-sm text-gray-800 flex">
                            <span className="text-indigo-600 font-medium mr-2 flex-shrink-0">
                              {index + 1}.
                            </span>
                            <span>{question}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Final Agreement
        </h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              name="termsAgreed"
              checked={campaignData.termsAgreed || false}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {!campaignData.termsAgreed && (
            <div className="text-sm text-amber-600">
              Please agree to the terms to create your campaign
            </div>
          )}

          {campaignData.termsAgreed && (
            <div className="text-sm text-green-600">✓ Ready to create campaign</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Preview;
