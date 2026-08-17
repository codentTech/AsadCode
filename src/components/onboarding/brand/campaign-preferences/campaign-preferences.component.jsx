import React from "react";
import {
  Video,
  Wifi,
  Globe2,
  DollarSign,
  Camera,
  Gift,
  Percent,
  CheckCircle,
  Users,
  TrendingUp,
  MapPin,
  X,
  Globe,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useBrandCampaignPreferences from "./use-campaign-preferences.hook";
import OnboardingStepLayout from "../../components/onboarding-step-layout/onboarding-step-layout.component";
import SearchableNicheInput from "@/components/campaign-refactored/shared/searchable-niche-input/searchable-niche-input.component";

const BrandCampaignPreferences = ({ onNext, onResumeStep, isActive = true }) => {
  const { register, handleSubmit, errors, onSubmit, setValue, getValues, watch, isLoading } =
    useBrandCampaignPreferences({ onNext, onResumeStep, isActive });

  const filmingPreference = watch("filming_preference");
  const selectedCampaignTypes = watch("campaign_types");
  const selectedNiches = watch("target_niches");
  const selectedCreatorSizes = watch("creator_sizes");
  const selectedGeographicFocus = watch("geographic_focus");

  const filmingOptions = [
    {
      id: "in-person",
      label: "In person filming",
      desc: "Creators visit your location",
      icon: Video,
      color: "text-purple-600",
    },
    {
      id: "remote",
      label: "Remote filming",
      desc: "Creators film from their location",
      icon: Wifi,
      color: "text-blue-600",
    },
    {
      id: "both",
      label: "Both options",
      desc: "Flexible filming approach",
      icon: Globe2,
      color: "text-green-600",
    },
  ];

  const campaignTypes = [
    {
      id: "sponsored",
      label: "Sponsored Post",
      desc: "Pay creators to post on their social media",
      icon: DollarSign,
      popularity: 95,
      avgCost: "$200-800",
    },
    {
      id: "ugc",
      label: "UGC Content",
      desc: "Creators make content for your brand to use",
      icon: Camera,
      popularity: 88,
      avgCost: "$300-1200",
    },
    {
      id: "gifted",
      label: "Gifted Campaign",
      desc: "Free products in exchange for posts",
      icon: Gift,
      popularity: 92,
      avgCost: "$50-500 value",
    },
    {
      id: "affiliate",
      label: "Affiliate Marketing",
      desc: "Commission-based partnerships",
      icon: Percent,
      popularity: 76,
      avgCost: "5-20% commission",
    },
  ];

  const creatorSizes = [
    {
      id: "micro",
      label: "Micro (1k–10k)",
      icon: Users,
      points: [
        "Lower reach, but often higher engagement rates",
        "More likely to accept gifted product vs. paid collabs",
        "Good for niche or grassroots campaigns",
      ],
    },
    {
      id: "mid",
      label: "Mid (10k–100k)",
      icon: TrendingUp,
      points: [
        "Strong balance of reach + engagement",
        "Typically expect monetary compensation",
        "Good content quality + proven track record",
      ],
    },
    {
      id: "macro",
      label: "Macro (100k+)",
      icon: Globe2,
      points: [
        "Maximum reach + brand awareness",
        "Higher costs, less likely to accept gifted product",
        "Best for large campaigns + viral potential",
      ],
    },
  ];

  const geographicFocus = [
    { id: "local", label: "Local", desc: "Specific cities/regions", icon: MapPin },
    { id: "national", label: "National", desc: "Country-wide campaigns", icon: Globe },
    { id: "global", label: "Global", desc: "International reach", icon: Globe2 },
  ];

  const toggleSelection = (item, selectedArray, field) => {
    const prev = getValues(field) || [];
    if (prev.includes(item)) {
      setValue(
        field,
        prev.filter((i) => i !== item),
        { shouldValidate: true }
      );
    } else {
      setValue(field, [...prev, item], { shouldValidate: true });
    }
  };

  const handleTargetNichesChange = (niches) => {
    setValue("target_niches", niches, { shouldValidate: true });
  };

  const handleTargetNicheRemove = (niche) => {
    const current = getValues("target_niches") || [];
    const updated = current.filter((item) => item !== niche);
    setValue("target_niches", updated, { shouldValidate: true });
  };

  return (
    <OnboardingStepLayout
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <CustomButton
          text="Continue Setup"
          className="btn-primary w-full sm:ml-auto sm:w-auto"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        />
      }
    >
          <div className="grid gap-3 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Filming Preference */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Filming Requirements <span className="text-red-500">*</span>
                </h3>
                <div className="space-y-3">
                  {filmingOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = filmingPreference === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() =>
                          setValue("filming_preference", option.id, { shouldValidate: true })
                        }
                        className={`
                          p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-200"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`
                              p-2 rounded-lg flex-shrink-0
                              ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                            `}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900">{option.label}</h4>
                            <p className="text-xs text-gray-600">{option.desc}</p>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-indigo-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.filming_preference && (
                  <p className="text-xs text-red-600 mt-2">{errors.filming_preference.message}</p>
                )}
              </div>

              {/* Campaign Types */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Campaign Types <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {campaignTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedCampaignTypes?.includes(type.id);
                    return (
                      <div
                        key={type.id}
                        onClick={() =>
                          toggleSelection(type.id, selectedCampaignTypes, "campaign_types")
                        }
                        className={`
                          p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-200"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`
                                p-2 rounded-lg flex-shrink-0
                                ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                              `}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900">{type.label}</h4>
                              <p className="text-xs text-gray-600">{type.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {isSelected && (
                              <CheckCircle className="h-4 w-4 text-indigo-500 ml-auto mt-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.campaign_types && (
                  <p className="text-xs text-red-600 mt-2">{errors.campaign_types.message}</p>
                )}
              </div>

              {/* Geographic Focus */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Geographic Focus</h3>
                <div className="grid grid-cols-1 gap-3">
                  {geographicFocus.map((geo) => {
                    const Icon = geo.icon;
                    const isSelected = selectedGeographicFocus?.includes(geo.id);
                    return (
                      <div
                        key={geo.id}
                        onClick={() =>
                          toggleSelection(geo.id, selectedGeographicFocus, "geographic_focus")
                        }
                        className={`
                          p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-200"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`
                              p-2 rounded-lg flex-shrink-0
                              ${isSelected ? "bg-indigo-500" : "bg-gray-100"}
                            `}
                          >
                            {typeof Icon === "string" ? (
                              <span className="text-lg">{Icon}</span>
                            ) : (
                              <Icon
                                className={`h-5 w-5 ${isSelected ? "text-white" : "text-gray-500"}`}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900">{geo.label}</h4>
                            <p className="text-xs text-gray-600">{geo.desc}</p>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-indigo-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.geographic_focus && (
                  <p className="text-xs text-red-600 mt-2">{errors.geographic_focus.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Target Niches */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Target Niches</h3>
                <SearchableNicheInput
                  selectedNiches={selectedNiches || []}
                  onNichesChange={handleTargetNichesChange}
                  handleNicheRemove={handleTargetNicheRemove}
                  placeholder="Search and add target niches"
                />

                {errors.target_niches && (
                  <p className="text-xs text-red-600 mt-2">{errors.target_niches.message}</p>
                )}
              </div>

              {/* Creator Sizes */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Preferred Creator Size</h3>
                <div className="space-y-4">
                  {creatorSizes.map((size) => {
                    const Icon = size.icon;
                    const isSelected = selectedCreatorSizes?.includes(size.id);
                    return (
                      <div
                        key={size.id}
                        onClick={() =>
                          toggleSelection(size.id, selectedCreatorSizes, "creator_sizes")
                        }
                        className={`
                          p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-200"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`
                                p-2 rounded-lg flex-shrink-0
                                ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                              `}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bol text-gray-900">{size.label}</h4>
                              <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside">
                                {size.points.map((point, index) => (
                                  <li key={index} className="leading-snug">
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.creator_sizes && (
                  <p className="text-xs text-red-600 mt-2">{errors.creator_sizes.message}</p>
                )}
              </div>
            </div>
          </div>
    </OnboardingStepLayout>
  );
};

export default BrandCampaignPreferences;
