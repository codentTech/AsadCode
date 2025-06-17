import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import {
  AlertTriangle,
  BarChart3,
  Database,
  Download,
  Eye,
  FileText,
  Globe,
  Info,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const DataPrivacyPage = () => {
  const [privacySettings, setPrivacySettings] = useState({
    // Profile Visibility
    profilePublic: true,
    showRealName: false,
    showLocation: true,
    showSocialLinks: true,
    showFollowerCount: true,
    showEngagementRates: false,

    // Data Collection
    allowPerformanceTracking: true,
    allowBehaviorAnalytics: false,
    allowThirdPartyIntegration: true,
    allowMarketResearch: false,
    collectLocationData: false,

    // Data Sharing
    shareWithPartners: false,
    shareAggregateData: true,
    sharePerformanceData: false,
    allowDataExport: true,

    // Marketing & Personalization
    personalizedRecommendations: true,
    targetedMarketing: false,
    cookieTracking: true,
    crossPlatformTracking: false,

    // Communication
    dataUpdateNotifications: true,
    securityAlerts: true,
    policyChangeNotifications: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("visibility");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSettingChange = (key, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving privacy settings:", privacySettings);
    setHasChanges(false);
    // Implement save logic
  };

  const handleExportData = () => {
    console.log("Exporting user data");
    setShowExportModal(false);
    // Implement data export logic
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion requested");
    setShowDeleteModal(false);
    // Implement account deletion logic
  };

  const PrivacyToggle = ({
    title,
    description,
    icon: Icon,
    settingKey,
    badge = null,
    warning = false,
  }) => (
    <div
      className={`flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
        warning ? "border-orange-200 bg-orange-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start space-x-3 flex-1">
        <div className={`p-2 rounded-lg ${warning ? "bg-orange-100" : "bg-gray-100"}`}>
          <Icon className={`h-4 w-4 ${warning ? "text-orange-600" : "text-gray-600"}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            {badge && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  badge === "Recommended"
                    ? "bg-green-100 text-green-800"
                    : badge === "Required"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="ml-4">
        <CustomSwitch
          name={settingKey}
          checked={privacySettings[settingKey]}
          onChange={(e) => handleSettingChange(settingKey, e.target.checked)}
          inlineLabel={false}
        />
      </div>
    </div>
  );

  const dataCategories = [
    {
      name: "Profile Information",
      description: "Your name, bio, profile picture, and contact details",
      size: "2.3 MB",
      lastUpdated: "2024-06-15",
    },
    {
      name: "Campaign Data",
      description: "Campaign history, performance metrics, and earnings",
      size: "15.7 MB",
      lastUpdated: "2024-06-16",
    },
    {
      name: "Analytics Data",
      description: "Engagement rates, audience demographics, and performance insights",
      size: "8.2 MB",
      lastUpdated: "2024-06-16",
    },
    {
      name: "Communication History",
      description: "Messages, notifications, and interaction logs",
      size: "4.1 MB",
      lastUpdated: "2024-06-14",
    },
    {
      name: "Usage Analytics",
      description: "Platform usage patterns, clicks, and behavioral data",
      size: "12.5 MB",
      lastUpdated: "2024-06-16",
    },
  ];

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-6 rounded-lg text-white mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Shield className="h-6 w-6 text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">Data Privacy</h1>
          </div>
          <p className="">Manage how CleerCut uses your profile and performance data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg border">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("visibility")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "visibility"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Eye className="h-4 w-4 inline mr-2" />
                    Profile Visibility
                  </button>
                  <button
                    onClick={() => setActiveTab("collection")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "collection"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Database className="h-4 w-4 inline mr-2" />
                    Data Collection
                  </button>
                  <button
                    onClick={() => setActiveTab("sharing")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "sharing"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    Data Sharing
                  </button>
                  <button
                    onClick={() => setActiveTab("marketing")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "marketing"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 inline mr-2" />
                    Marketing
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "visibility" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Profile Visibility Settings
                    </h3>

                    <PrivacyToggle
                      title="Public Profile"
                      description="Make your profile visible to brands and other users"
                      icon={Globe}
                      settingKey="profilePublic"
                      badge="Recommended"
                    />

                    <PrivacyToggle
                      title="Show Real Name"
                      description="Display your real name instead of username"
                      icon={Users}
                      settingKey="showRealName"
                    />

                    <PrivacyToggle
                      title="Show Location"
                      description="Display your city/region on your profile"
                      icon={Globe}
                      settingKey="showLocation"
                    />

                    <PrivacyToggle
                      title="Show Social Media Links"
                      description="Display links to your social media accounts"
                      icon={Users}
                      settingKey="showSocialLinks"
                      badge="Recommended"
                    />

                    <PrivacyToggle
                      title="Show Follower Count"
                      description="Display your social media follower counts"
                      icon={BarChart3}
                      settingKey="showFollowerCount"
                    />

                    <PrivacyToggle
                      title="Show Engagement Rates"
                      description="Display detailed engagement rate statistics"
                      icon={BarChart3}
                      settingKey="showEngagementRates"
                    />
                  </div>
                )}

                {activeTab === "collection" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Data Collection Preferences
                    </h3>

                    <PrivacyToggle
                      title="Performance Tracking"
                      description="Allow CleerCut to track campaign performance and analytics"
                      icon={BarChart3}
                      settingKey="allowPerformanceTracking"
                      badge="Required"
                    />

                    <PrivacyToggle
                      title="Behavior Analytics"
                      description="Track how you use the platform to improve your experience"
                      icon={Settings}
                      settingKey="allowBehaviorAnalytics"
                    />

                    <PrivacyToggle
                      title="Third-party Integrations"
                      description="Allow connections with social media platforms and analytics tools"
                      icon={Globe}
                      settingKey="allowThirdPartyIntegration"
                      badge="Recommended"
                    />

                    <PrivacyToggle
                      title="Market Research"
                      description="Participate in anonymous market research studies"
                      icon={FileText}
                      settingKey="allowMarketResearch"
                    />

                    <PrivacyToggle
                      title="Location Data"
                      description="Collect location data for local campaign opportunities"
                      icon={Globe}
                      settingKey="collectLocationData"
                      warning={true}
                    />
                  </div>
                )}

                {activeTab === "sharing" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Data Sharing Preferences
                    </h3>

                    <PrivacyToggle
                      title="Share with Partners"
                      description="Allow CleerCut to share your data with trusted brand partners"
                      icon={Users}
                      settingKey="shareWithPartners"
                      warning={true}
                    />

                    <PrivacyToggle
                      title="Aggregate Data Sharing"
                      description="Include your data in anonymized aggregate reports"
                      icon={BarChart3}
                      settingKey="shareAggregateData"
                    />

                    <PrivacyToggle
                      title="Performance Data Sharing"
                      description="Share campaign performance data with brand partners"
                      icon={BarChart3}
                      settingKey="sharePerformanceData"
                    />

                    <PrivacyToggle
                      title="Allow Data Export"
                      description="Enable data export requests for compliance purposes"
                      icon={Download}
                      settingKey="allowDataExport"
                      badge="Recommended"
                    />
                  </div>
                )}

                {activeTab === "marketing" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Marketing & Personalization
                    </h3>

                    <PrivacyToggle
                      title="Personalized Recommendations"
                      description="Use your data to suggest relevant campaigns and opportunities"
                      icon={BarChart3}
                      settingKey="personalizedRecommendations"
                      badge="Recommended"
                    />

                    <PrivacyToggle
                      title="Targeted Marketing"
                      description="Show you targeted ads based on your interests and behavior"
                      icon={BarChart3}
                      settingKey="targetedMarketing"
                    />

                    <PrivacyToggle
                      title="Cookie Tracking"
                      description="Use cookies to enhance your browsing experience"
                      icon={Settings}
                      settingKey="cookieTracking"
                    />

                    <PrivacyToggle
                      title="Cross-Platform Tracking"
                      description="Track your activity across different devices and platforms"
                      icon={Globe}
                      settingKey="crossPlatformTracking"
                      warning={true}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Data Export Section */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Download className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Data</h3>
              </div>

              <p className="text-gray-600 mb-4">
                Download a copy of your data or request account deletion. These actions may take up
                to 30 days to process.
              </p>

              <div className="space-y-3">
                {dataCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-900">{category.size}</div>
                      <div className="text-xs text-gray-500">
                        Updated {new Date(category.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <CustomButton
                  text="Download All Data"
                  className="btn-secondary"
                  icon={Download}
                  onClick={() => setShowExportModal(true)}
                />
                <CustomButton
                  text="Delete Account"
                  className="btn-danger"
                  icon={Trash2}
                  onClick={() => setShowDeleteModal(true)}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Communication Preferences */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>

              <div className="space-y-4">
                <PrivacyToggle
                  title="Data Updates"
                  description="Notify when your data is updated"
                  icon={Info}
                  settingKey="dataUpdateNotifications"
                />

                <PrivacyToggle
                  title="Security Alerts"
                  description="Important security notifications"
                  icon={Shield}
                  settingKey="securityAlerts"
                  badge="Required"
                />

                <PrivacyToggle
                  title="Policy Changes"
                  description="Updates to privacy policy and terms"
                  icon={FileText}
                  settingKey="policyChangeNotifications"
                  badge="Required"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Data Size</span>
                  <span className="text-sm font-medium text-gray-900">42.8 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Export</span>
                  <span className="text-sm font-medium text-gray-900">Never</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Created</span>
                  <span className="text-sm font-medium text-gray-900">Jan 15, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Retention</span>
                  <span className="text-sm font-medium text-gray-900">Active</span>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-3">
                <CustomButton
                  text="Save Changes"
                  className={`btn-primary w-full ${!hasChanges ? "opacity-50 cursor-not-allowed" : ""}`}
                  icon={Save}
                  onClick={handleSave}
                  disabled={!hasChanges}
                />

                <CustomButton
                  text="Reset to Defaults"
                  className="btn-secondary w-full"
                  icon={RefreshCw}
                  onClick={() => {
                    // Reset to default settings
                    setHasChanges(true);
                  }}
                />
              </div>

              {hasChanges && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    You have unsaved changes. Don't forget to save your privacy preferences.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Export Your Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div className="text-sm text-blue-800">
                      Your data export will be prepared and sent to your email address within 24-48
                      hours. The export will include all data categories listed above.
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <CustomButton
                    text="Cancel"
                    className="btn-secondary flex-1"
                    onClick={() => setShowExportModal(false)}
                  />
                  <CustomButton
                    text="Request Export"
                    className="btn-primary flex-1"
                    icon={Download}
                    onClick={handleExportData}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                    <div className="text-sm text-red-800">
                      <strong>Warning:</strong> This action is irreversible. All your data,
                      campaigns, and earnings history will be permanently deleted after 30 days.
                    </div>
                  </div>
                </div>

                <CustomInput label="Type 'DELETE' to confirm" placeholder="DELETE" required />

                <div className="flex space-x-3 pt-4">
                  <CustomButton
                    text="Cancel"
                    className="btn-secondary flex-1"
                    onClick={() => setShowDeleteModal(false)}
                  />
                  <CustomButton
                    text="Delete Account"
                    className="btn-danger flex-1"
                    icon={Trash2}
                    onClick={handleDeleteAccount}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy Info */}
        <div className="mt-6 bg-gray-100 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">Privacy Policy</h3>
              <p className="text-sm text-gray-600 mt-1">
                Learn more about how CleerCut collects, uses, and protects your data. Read our full{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                  Privacy Policy
                </a>{" "}
                and
                <a href="#" className="text-indigo-600 hover:text-indigo-700 underline ml-1">
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DataPrivacyPage;
