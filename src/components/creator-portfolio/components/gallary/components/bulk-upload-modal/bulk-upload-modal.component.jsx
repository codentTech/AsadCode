import { FileVideo, Image, Upload, X } from "lucide-react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useBulkUploadModal from "./use-bulk-upload-modal.hook";

const FILE_TYPES = [
  { value: "video", label: "Video", icon: FileVideo },
  { value: "image", label: "Image", icon: Image },
];

export default function BulkUploadModal({ show, onClose, niches = [] }) {
  const {
    formData,
    handleChange,
    handleSubmit,
    handleClose,
    handleFilesSelect,
    handleRemoveFile,
    handleBrowse,
    fileInputRef,
    selectedFiles,
    uploadProgress,
    totalFiles,
    isUploading,
    nicheOptions,
  } = useBulkUploadModal({ show, onClose, niches });

  return (
    <Modal show={show} title="Bulk Upload" onClose={handleClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Type Toggle */}
        <div className="flex flex-col gap-[6px] text-xs font-medium capitalize not-italic leading-6 text-text-black">
          <span>File Type</span>
          <div className="grid grid-cols-2 gap-2">
            {FILE_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange("file_type", type.value)}
                  className={`py-2 px-4 border-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.file_type === type.value
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* File Picker */}
        <div className="flex flex-col gap-[6px] text-xs font-medium capitalize not-italic leading-6 text-text-black">
          <span>
            Files <span className="text-red-500">*</span>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept={formData.file_type === "video" ? "video/*" : "image/*"}
            multiple
            onChange={handleFilesSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleBrowse}
            disabled={isUploading}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="mx-auto w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 normal-case">
              Click to browse multiple files
            </p>
            <p className="text-xs text-gray-400 mt-1 normal-case">
              {formData.file_type === "video"
                ? "MP4, MOV, AVI, WEBM up to 50MB each"
                : "JPEG, PNG, WEBP up to 50MB each"}
            </p>
          </button>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700 capitalize">
              Selected Files ({selectedFiles.length})
            </p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {file.type.startsWith("video/") ? (
                      <FileVideo className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    ) : (
                      <Image className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    )}
                    <span className="text-xs text-gray-700 truncate normal-case">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </div>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && totalFiles > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 normal-case">
              <span>Uploading...</span>
              <span>
                {uploadProgress} / {totalFiles}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${totalFiles > 0 ? (uploadProgress / totalFiles) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {nicheOptions.length > 0 && (
          <SimpleSelect
            label="Niche (Optional)"
            placeHolder="Select a niche"
            options={nicheOptions}
            value={formData.niche_id}
            onChange={(option) => handleChange("niche_id", option.value)}
          />
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800 normal-case">
            <strong>Note:</strong> All uploaded files are labeled as unpublished
            samples. Metrics are not tracked for uploaded content.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
          <CustomButton
            className="btn-cancel"
            text="Cancel"
            onClick={handleClose}
            type="button"
            disabled={isUploading}
          />
          <CustomButton
            className="btn-primary"
            text={
              isUploading
                ? `Uploading ${uploadProgress}/${totalFiles}...`
                : `Upload${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}`
            }
            type="submit"
            disabled={isUploading || !selectedFiles.length}
          />
        </div>
      </form>
    </Modal>
  );
}
