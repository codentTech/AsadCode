import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { Building2, Camera, Globe, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ProfileInformation = () => {
  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      brandName: "",
      bio: "",
      website: "",
      logo: null,
    },
  });

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    console.log("Profile data:", data);
  };

  return (
    <SidebarLayout>
      <div className="mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Profile Information</h1>
          <p className="text-sm mt-1">
            Create an impressive brand profile that attracts the right creators
          </p>
        </div>
        {/* Main Form */}
        <div className="rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="w-full flex flex-col md:flex-row justify-between gap-6">
              {/* Logo Upload Section */}
              <div className="w-full flex flex-col justify-center items-center rounded-lg text-center border">
                <div className="relative inline-block p-4 md:p-0">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-lg overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-5 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
                <h3 className="text-xs md:text-base text-gray-600 mb-2">Brand Logo</h3>
                <p className="text-xs md:text-base text-gray-600 pb-4 md:pb-0">
                  Upload your brand logo (JPG, PNG, max 5MB)
                </p>
              </div>

              <div className="w-full space-y-3">
                <div className="w-full bg-white/50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    Brand Details
                  </h3>
                  <CustomInput
                    label="Brand Name"
                    name="brandName"
                    register={register}
                    errors={errors}
                    placeholder="Enter your brand name"
                    isRequired={true}
                    startIcon={<Building2 className="h-4 w-4" />}
                  />
                </div>

                <div className="bg-white/50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    Website
                  </h3>
                  <CustomInput
                    label="Website URL"
                    name="website"
                    register={register}
                    errors={errors}
                    placeholder="https://yourbrand.com"
                    startIcon={<Globe className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-white/50 p-6 mt-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Brand Bio
              </h3>
              <TextArea
                label="Brand Description"
                name="bio"
                register={register}
                errors={errors}
                placeholder="Tell creators about your brand, values, and what makes you unique..."
                isRequired={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <CustomButton text="Save" type="submit" className="btn-primary" />
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ProfileInformation;
