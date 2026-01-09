import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { AlertTriangle, Download, FileText, Info, Trash2, X } from "lucide-react";
import { useState } from "react";

const DataPrivacyPage = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportData = () => {
    // TODO: Implement data export logic
    setShowExportModal(false);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Data Privacy</h1>
        <p className="text-sm mt-1">Manage your data and account</p>
      </div>

      {/* Data Management Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Download className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Your Data</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Download a copy of your data or request account deletion. These actions may take up to 30
          days to process.
        </p>

        <div className="flex space-x-3">
          <CustomButton
            text="Download Data"
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
                    <strong>Warning:</strong> This action is irreversible. All your data, campaigns,
                    and earnings history will be permanently deleted after 30 days.
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
    </>
  );
};

export default DataPrivacyPage;
