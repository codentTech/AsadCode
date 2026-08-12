"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { getCreatorInviteProgress } from "@/common/utils/creator-onboarding-progress.util";
import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";
import { ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";
import useConnectSocial from "./use-connect-social.hook";

const ConnectSocial = ({ onNext, onBack, creatorTypeHint }) => {
  const progress = getCreatorInviteProgress(ONBOARDING_STEPS.CONNECT_SOCIAL);
  const { getPlatformIcon, getPlatformColor } = useGetplatform();
  const {
    platforms,
    mediaKitUrl,
    handleMediaKitUrlChange,
    mediaKitErrors,
    stepError,
    isPlatformConnected,
    getConnectedAccountData,
    handleConnectSocialAccounts,
    loadConnectedAccounts,
    socialConnectLoadingMap,
    handleContinue,
    handleSkip,
    isLoading,
  } = useConnectSocial({ onNext, creatorTypeHint });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 bg-primary p-4 rounded-lg">
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">Connect your socials</h1>
          <p className="text-sm lg:text-md text-white">
            Link accounts so brands can verify your reach — or add a media kit link instead
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              type="button"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <span>
              Step {progress.step} of {progress.total}
            </span>
            <span>{progress.percent}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-primary h-2 rounded-full ${progress.barClass} transition-all duration-500`}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Social accounts</h3>
              <p className="text-xs text-gray-600 mt-1">
                Connect at least one account or add a media kit to continue. You can also skip and
                connect later from your portfolio.
              </p>
            </div>
            <CustomButton
              text="Refresh"
              type="button"
              onClick={loadConnectedAccounts}
              className="btn-outline text-xs px-3 py-1.5"
              startIcon={<RefreshCw className="w-3 h-3" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {platforms.map((platform) => {
              const isConnected = isPlatformConnected(platform);
              const platformColor = getPlatformColor(platform);
              const connectedData = getConnectedAccountData(platform);
              const username =
                connectedData?.profile_data?.username ||
                connectedData?.profile_data?.handle ||
                connectedData?.profile_data?.name ||
                "";
              const isPlatformLoading = Boolean(socialConnectLoadingMap?.[platform]);

              return (
                <div
                  key={platform}
                  className={`relative p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    isConnected
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          isConnected ? platformColor : "bg-gray-100"
                        }`}
                      >
                        {getPlatformIcon(platform)}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-gray-900 text-sm">{platform}</span>
                        {isConnected ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-indigo-500" />
                            <span className="text-xs text-indigo-600 font-medium">Connected</span>
                            {username ? (
                              <span className="text-xs text-gray-500">@{username}</span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Not connected</span>
                        )}
                      </div>
                    </div>
                    {!isConnected ? (
                      <CustomButton
                        text={isPlatformLoading ? "Connecting…" : "Connect"}
                        type="button"
                        className="btn-primary text-xs"
                        disabled={isPlatformLoading}
                        onClick={() => handleConnectSocialAccounts(platform)}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <CustomInput
              label="Media kit link"
              name="mediaKitUrl"
              value={mediaKitUrl}
              onChange={handleMediaKitUrlChange}
              placeholder="https://your-media-kit.com"
              isRequired={false}
              errors={mediaKitErrors}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this if you cannot connect a social account right now.
            </p>
          </div>

          {stepError ? <p className="text-xs text-red-600">{stepError}</p> : null}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <CustomButton
              type="button"
              text="Skip for now"
              className="btn-outline flex-1"
              onClick={handleSkip}
              disabled={isLoading}
            />
            <CustomButton
              type="button"
              text="Continue"
              className="btn-primary flex-1"
              onClick={handleContinue}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectSocial;
