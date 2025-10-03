import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  createCampaign,
  getCreatorApplications,
} from "@/provider/features/campaigns/campaigns.slice";
import { CAMPAIGN_STATUS } from "@/common/constants/campaign.constant";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  campaignTitle: Yup.string()
    .required("Campaign title is required")
    .min(3, "Campaign title must be at least 3 characters"),
  brandName: Yup.string()
    .required("Brand name is required")
    .min(2, "Brand name must be at least 2 characters"),
  typeOfWork: Yup.string().required("Type of work is required"),
  niches: Yup.array()
    .min(1, "At least one niche is required")
    .required("Niche selection is required"),
  platforms: Yup.array()
    .min(1, "At least one platform is required")
    .required("Platform selection is required"),
  deliverables: Yup.array(),
  completionDate: Yup.string(),
  compensation: Yup.string(),
});

/**
 * Custom hook for tracking external campaigns
 *
 * Handles form state management and API integration for creating
 * external campaigns that creators want to track in CleerCut
 */
export default function useTrackExternalCampaign() {
  const dispatch = useDispatch();

  // Redux state
  const {
    isLoading: createLoading,
    isSuccess: createSuccess,
    isError: createError,
    message: createMessage,
  } = useSelector((state) => state.campaigns.createCampaign || {});

  // Local state for modal visibility
  const [showModal, setShowModal] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      campaignTitle: "",
      brandName: "",
      typeOfWork: "",
      niches: [],
      platforms: [],
      deliverables: [],
      completionDate: "",
      compensation: "",
    },
  });

  // Watch form values
  const formData = watch();

  // Open modal
  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  // Close modal and reset form
  const closeModal = useCallback(() => {
    setShowModal(false);
    reset(); // Reset form on close
  }, [reset]);

  // Transform external campaign data to match backend DTO structure
  const transformExternalCampaignData = useCallback((formData) => {
    // Map platform values to proper format
    const platformMap = {
      tiktok: "TikTok",
      instagram: "Instagram",
      youtube: "YouTube",
      other: "Other",
    };

    // Transform deliverables to array of strings (only if provided)
    const deliverables =
      formData.deliverables && formData.deliverables.length > 0
        ? formData.deliverables.map((d) => d.displayText)
        : undefined;

    // Map platforms
    const required_platforms = formData.platforms.map((p) => platformMap[p] || p);

    // Build campaign data object with only provided values
    const campaignData = {
      // Basic Info (required)
      brand_name: formData.brandName,
      campaign_title: formData.campaignTitle,
      campaign_type: formData.typeOfWork, // Already in correct backend enum format
      niches: formData.niches,

      // Platforms (required)
      required_platforms: required_platforms,
      min_combined_followers: "0",

      // Compensation (conditional)
      compensation_type: formData.compensation ? "PAID" : "GIFTED_PRODUCT",

      // Description (required by backend)
      short_description: `External campaign: ${formData.campaignTitle} by ${formData.brandName}`,

      // External campaign marker
      source_platform: "OTHER",
      status: CAMPAIGN_STATUS.ACTIVE,
    };

    // Add optional fields only if provided
    if (deliverables) {
      campaignData.deliverables = deliverables;
    }

    if (formData.compensation) {
      const parsedBudget = parseFloat(formData.compensation);
      if (!isNaN(parsedBudget) && parsedBudget > 0) {
        campaignData.budget = parsedBudget;
      }
    }

    if (formData.completionDate) {
      campaignData.application_deadline = formData.completionDate;
      campaignData.campaign_deadline = formData.completionDate;
    }

    return campaignData;
  }, []);

  // Handle form submission (called by React Hook Form)
  const onSubmit = useCallback(
    async (formValues) => {
      // Transform form data to match backend structure
      const campaignData = transformExternalCampaignData(formValues);

      // Dispatch create campaign action
      const result = await dispatch(createCampaign(campaignData)).unwrap();

      if (result.success) {
        // Refresh the campaign list to show the newly created external campaign
        await dispatch(getCreatorApplications("HIRED"));

        // Close modal and reset form on success
        closeModal();
        return result;
      }
    },
    [dispatch, transformExternalCampaignData, closeModal]
  );

  return {
    // State
    showModal,
    createLoading,
    createSuccess,
    createError,
    createMessage,
    formData,
    errors,

    // React Hook Form
    register,
    handleSubmit,
    setValue,
    watch,

    // Actions
    openModal,
    closeModal,
    onSubmit,
  };
}
