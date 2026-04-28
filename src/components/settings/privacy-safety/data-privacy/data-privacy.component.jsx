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
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Data Privacy</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">Manage your data and account</p>
      </div>

      <div className="rounded-lg border bg-white p-3 sm:p-6">
        <div className="mb-3 flex items-center space-x-2 sm:mb-4">
          <Download className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">Your Data</h3>
        </div>

        <p className="mb-4 text-xs text-gray-600 sm:mb-6 sm:text-sm">
          Download a copy of your data or request account deletion. These actions may take up to 30
          days to process.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:space-x-3 sm:gap-0">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2.5 sm:p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-3 sm:p-6">
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
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div className="text-xs text-blue-800 sm:text-sm">
                    Your data export will be prepared and sent to your email address within 24-48
                    hours. The export will include all data categories listed above.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:space-x-3 sm:gap-0">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2.5 sm:p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-3 sm:p-6">
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
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                  <div className="text-xs text-red-800 sm:text-sm">
                    <strong>Warning:</strong> This action is irreversible. All your data, campaigns,
                    and earnings history will be permanently deleted after 30 days.
                  </div>
                </div>
              </div>

              <CustomInput label="Type 'DELETE' to confirm" placeholder="DELETE" required />

              <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:space-x-3 sm:gap-0">
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
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-100 p-3 sm:mt-6 sm:p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h3 className="text-xs font-medium text-gray-800 sm:text-sm">Privacy Policy</h3>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
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
