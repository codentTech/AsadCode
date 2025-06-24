import React, { useState } from "react";
import {
  Mail,
  Bell,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Settings,
  Shield,
  Clock,
  Zap,
  Save,
  RotateCcw,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";

const EmailPreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    // Campaign & Collaboration
    campaignInvites: true,
    campaignUpdates: true,
    campaignDeadlines: false,
    collaborationRequests: true,

    // Payment & Financial
    paymentAlerts: true,
    invoiceReminders: true,
    paymentConfirmations: true,
    monthlyEarnings: false,

    // Platform Updates
    newFeatures: true,
    platformUpdates: false,
    maintenanceAlerts: true,
    securityAlerts: true,

    // Marketing & Promotional
    weeklyNewsletter: false,
    marketingTips: false,
    promotionalOffers: false,
    partnerOffers: false,

    // Communication Settings
    emailFrequency: "immediate",
    digestTime: "morning",
  });

  const [emailAddress, setEmailAddress] = useState("user@example.com");
  const [backupEmail, setBackupEmail] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving preferences:", preferences);
    setHasChanges(false);
    // Implement save logic
  };

  const handleReset = () => {
    // Reset to default preferences
    setPreferences({
      campaignInvites: true,
      campaignUpdates: true,
      campaignDeadlines: false,
      collaborationRequests: true,
      paymentAlerts: true,
      invoiceReminders: true,
      paymentConfirmations: true,
      monthlyEarnings: false,
      newFeatures: true,
      platformUpdates: false,
      maintenanceAlerts: true,
      securityAlerts: true,
      weeklyNewsletter: false,
      marketingTips: false,
      promotionalOffers: false,
      partnerOffers: false,
      emailFrequency: "immediate",
      digestTime: "morning",
    });
    setHasChanges(true);
  };

  const PreferenceItem = ({ title, description, icon: Icon, preferenceKey, badge = null }) => (
    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3 flex-1">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            {badge && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="ml-4">
        <CustomSwitch
          name={preferenceKey}
          checked={preferences[preferenceKey]}
          onChange={(e) => handlePreferenceChange(preferenceKey, e.target.checked)}
          inlineLabel={false}
        />
      </div>
    </div>
  );

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Email Preferences</h1>
          <p className="text-sm mt-1">
            Manage your email notifications and communication preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Addresses */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Email Addresses</h3>
              </div>

              <div className="flex gap-6">
                <CustomInput
                  label="Primary Email"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter your primary email"
                  required
                />

                <CustomInput
                  label="Backup Email (Optional)"
                  type="email"
                  value={backupEmail}
                  onChange={(e) => setBackupEmail(e.target.value)}
                  placeholder="Enter backup email for important notifications"
                />
              </div>
            </div>

            {/* Campaign & Collaboration */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Campaign & Collaboration</h3>
              </div>

              <div className="space-y-3">
                <PreferenceItem
                  title="Campaign Invites"
                  description="Receive invitations for new campaigns and collaborations"
                  icon={Mail}
                  preferenceKey="campaignInvites"
                  badge="Recommended"
                />

                <PreferenceItem
                  title="Campaign Updates"
                  description="Get notified about updates to your active campaigns"
                  icon={Bell}
                  preferenceKey="campaignUpdates"
                />

                <PreferenceItem
                  title="Campaign Deadlines"
                  description="Reminders about upcoming campaign deadlines"
                  icon={Clock}
                  preferenceKey="campaignDeadlines"
                />

                <PreferenceItem
                  title="Collaboration Requests"
                  description="Direct collaboration requests from brands"
                  icon={Users}
                  preferenceKey="collaborationRequests"
                />
              </div>
            </div>

            {/* Payment & Financial */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Payment & Financial</h3>
              </div>

              <div className="space-y-3">
                <PreferenceItem
                  title="Payment Alerts"
                  description="Notifications when payments are processed"
                  icon={DollarSign}
                  preferenceKey="paymentAlerts"
                  badge="Important"
                />

                <PreferenceItem
                  title="Invoice Reminders"
                  description="Reminders to submit invoices and payment requests"
                  icon={FileText}
                  preferenceKey="invoiceReminders"
                />

                <PreferenceItem
                  title="Payment Confirmations"
                  description="Confirmations when payments are received"
                  icon={DollarSign}
                  preferenceKey="paymentConfirmations"
                />

                <PreferenceItem
                  title="Monthly Earnings Summary"
                  description="Monthly summary of your earnings and performance"
                  icon={Calendar}
                  preferenceKey="monthlyEarnings"
                />
              </div>
            </div>

            {/* Platform Updates */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Platform Updates</h3>
              </div>

              <div className="space-y-3">
                <PreferenceItem
                  title="New Features"
                  description="Learn about new features and improvements"
                  icon={Zap}
                  preferenceKey="newFeatures"
                />

                <PreferenceItem
                  title="Platform Updates"
                  description="General platform news and announcements"
                  icon={Settings}
                  preferenceKey="platformUpdates"
                />

                <PreferenceItem
                  title="Maintenance Alerts"
                  description="Notifications about scheduled maintenance"
                  icon={Settings}
                  preferenceKey="maintenanceAlerts"
                />

                <PreferenceItem
                  title="Security Alerts"
                  description="Important security updates and notices"
                  icon={Shield}
                  preferenceKey="securityAlerts"
                  badge="Critical"
                />
              </div>
            </div>

            {/* Marketing & Promotional */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Marketing & Promotional</h3>
              </div>

              <div className="space-y-3">
                <PreferenceItem
                  title="Weekly Newsletter"
                  description="Weekly roundup of platform news and opportunities"
                  icon={Mail}
                  preferenceKey="weeklyNewsletter"
                />

                <PreferenceItem
                  title="Marketing Tips"
                  description="Tips and best practices for influencer marketing"
                  icon={Zap}
                  preferenceKey="marketingTips"
                />

                <PreferenceItem
                  title="Promotional Offers"
                  description="Special offers and platform promotions"
                  icon={DollarSign}
                  preferenceKey="promotionalOffers"
                />

                <PreferenceItem
                  title="Partner Offers"
                  description="Exclusive offers from our partners and brands"
                  icon={Users}
                  preferenceKey="partnerOffers"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Email Frequency */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Frequency</h3>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="emailFrequency"
                    value="immediate"
                    checked={preferences.emailFrequency === "immediate"}
                    onChange={(e) => handlePreferenceChange("emailFrequency", e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Immediate</div>
                    <div className="text-xs text-gray-500">Receive emails as they happen</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="emailFrequency"
                    value="daily"
                    checked={preferences.emailFrequency === "daily"}
                    onChange={(e) => handlePreferenceChange("emailFrequency", e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Daily Digest</div>
                    <div className="text-xs text-gray-500">Once per day summary</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="emailFrequency"
                    value="weekly"
                    checked={preferences.emailFrequency === "weekly"}
                    onChange={(e) => handlePreferenceChange("emailFrequency", e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Weekly Summary</div>
                    <div className="text-xs text-gray-500">Once per week roundup</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Digest Timing */}
            {(preferences.emailFrequency === "daily" ||
              preferences.emailFrequency === "weekly") && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Time</h3>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="digestTime"
                      value="morning"
                      checked={preferences.digestTime === "morning"}
                      onChange={(e) => handlePreferenceChange("digestTime", e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <div className="text-sm font-medium text-gray-900">Morning (8 AM)</div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="digestTime"
                      value="afternoon"
                      checked={preferences.digestTime === "afternoon"}
                      onChange={(e) => handlePreferenceChange("digestTime", e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <div className="text-sm font-medium text-gray-900">Afternoon (2 PM)</div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="digestTime"
                      value="evening"
                      checked={preferences.digestTime === "evening"}
                      onChange={(e) => handlePreferenceChange("digestTime", e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <div className="text-sm font-medium text-gray-900">Evening (6 PM)</div>
                  </label>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <CustomButton
                  text="Enable All Essential"
                  className="btn-secondary w-full"
                  icon={Bell}
                  onClick={() => {
                    handlePreferenceChange("campaignInvites", true);
                    handlePreferenceChange("paymentAlerts", true);
                    handlePreferenceChange("securityAlerts", true);
                    handlePreferenceChange("maintenanceAlerts", true);
                  }}
                />

                <CustomButton
                  text="Disable All Marketing"
                  className="btn-secondary w-full"
                  icon={Mail}
                  onClick={() => {
                    handlePreferenceChange("weeklyNewsletter", false);
                    handlePreferenceChange("marketingTips", false);
                    handlePreferenceChange("promotionalOffers", false);
                    handlePreferenceChange("partnerOffers", false);
                  }}
                />
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
                  icon={RotateCcw}
                  onClick={handleReset}
                />
              </div>

              {hasChanges && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    You have unsaved changes. Don't forget to save your preferences.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default EmailPreferencesPage;
