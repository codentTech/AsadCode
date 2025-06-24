import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Plus,
  Twitter,
  X,
  Youtube,
  Link,
  Globe,
} from "lucide-react";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { AddCircle } from "@mui/icons-material";

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState([
    {
      platform: "instagram",
      url: "",
      icon: Instagram,
      name: "Instagram",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      platform: "youtube",
      url: "",
      icon: Youtube,
      name: "YouTube",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      platform: "twitter",
      url: "",
      icon: Twitter,
      name: "Twitter",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      platform: "facebook",
      url: "",
      icon: Facebook,
      name: "Facebook",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      platform: "linkedin",
      url: "",
      icon: Linkedin,
      name: "LinkedIn",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
  ]);

  const [customPlatforms, setCustomPlatforms] = useState([]);
  const [newPlatform, setNewPlatform] = useState({ name: "", url: "" });

  const handleSocialLinkChange = (platform, url) => {
    setSocialLinks((links) =>
      links.map((link) => (link.platform === platform ? { ...link, url } : link))
    );
  };

  const addCustomPlatform = () => {
    if (newPlatform.name && newPlatform.url) {
      setCustomPlatforms([...customPlatforms, { ...newPlatform, id: Date.now() }]);
      setNewPlatform({ name: "", url: "" });
    }
  };

  const removeCustomPlatform = (id) => {
    setCustomPlatforms(customPlatforms.filter((platform) => platform.id !== id));
  };

  const onSubmit = () => {
    const allLinks = {
      socialLinks: socialLinks.filter((link) => link.url),
      customPlatforms,
    };
    console.log("Social links data:", allLinks);
    alert("Social links updated successfully!");
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Social Links</h1>
          <p className="text-sm mt-1">
            Connect your social media profiles to showcase your brand presence
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-2 sm:p-4 lg:p-6">
            {/* Popular Platforms Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column - Major Platforms */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                    <Link className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Popular Platforms
                  </h2>
                </div>

                <div className="space-y-2 sm:space-y-4">
                  {socialLinks.slice(0, 3).map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <CustomInput
                        key={link.platform}
                        label={link.name}
                        placeholder={`Enter your ${link.name} URL`}
                        type="url"
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(link.platform, e.target.value)}
                        startIcon={
                          <div className={`${link.bgColor} p-1 rounded`}>
                            <IconComponent className={`h-4 w-4 ${link.color}`} />
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Additional Platforms */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                    <Globe className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Professional Networks
                  </h2>
                </div>

                <div className="space-y-2 sm:space-y-4">
                  {socialLinks.slice(3).map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <CustomInput
                        key={link.platform}
                        label={link.name}
                        placeholder={`Enter your ${link.name} URL`}
                        type="url"
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(link.platform, e.target.value)}
                        startIcon={
                          <div className={`${link.bgColor} p-1 rounded`}>
                            <IconComponent className={`h-4 w-4 ${link.color}`} />
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom Platforms Section */}
            <div className="mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <Plus className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Custom Platforms
                </h2>
              </div>

              {/* Add New Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <CustomInput
                  placeholder="Platform name (e.g., TikTok)"
                  value={newPlatform.name}
                  onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                  startIcon={<Globe className="h-4 w-4" />}
                />
                <CustomInput
                  type="url"
                  placeholder="Platform URL"
                  value={newPlatform.url}
                  onChange={(e) => setNewPlatform({ ...newPlatform, url: e.target.value })}
                  startIcon={<Link className="h-4 w-4" />}
                />

                <div className="flex justify-end">
                  <button
                    className="w-auto bg-gray-200 p-2 rounded-full"
                    onClick={addCustomPlatform}
                  >
                    <AddCircle className="text-primary" />
                  </button>
                </div>
              </div>

              {/* Custom Platforms List */}
              {customPlatforms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Added Platforms</h3>
                  {customPlatforms.map((platform) => (
                    <div
                      key={platform.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded">
                            <Globe className="h-3 w-3 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {platform.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{platform.url}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCustomPlatform(platform.id)}
                        className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
              <CustomButton
                text="Reset"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => {
                  setSocialLinks(socialLinks.map((link) => ({ ...link, url: "" })));
                  setCustomPlatforms([]);
                  setNewPlatform({ name: "", url: "" });
                }}
              />
              <CustomButton
                text="Save Changes"
                onClick={onSubmit}
                className="btn-primary w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SocialLinks;
