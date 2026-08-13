"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { CheckCircle, Link2, RefreshCw, Share2, Users } from "lucide-react";
import OnboardingStepLayout from "../../components/onboarding-step-layout/onboarding-step-layout.component";
import useConnectSocial from "./use-connect-social.hook";

const ConnectSocial = ({ onNext, creatorTypeHint }) => {
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
    <OnboardingStepLayout
      footer={
        <>
          <CustomButton
            type="button"
            text="Skip for now"
            className="btn-outline w-full sm:w-auto"
            onClick={handleSkip}
            disabled={isLoading}
            loading={isLoading}
          />

          <CustomButton
            type="button"
            text="Continue"
            className="btn-primary w-full sm:ml-auto sm:w-auto"
            onClick={handleContinue}
            disabled={isLoading}
          />
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <section className="flex items-start gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Connect your reach</h3>
            <p className="mt-0.5 text-[11px] leading-snug text-gray-600 sm:text-xs">
              Link one account or add a media kit. You can skip and connect later from your
              portfolio.
            </p>
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
                  <Users className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-semibold text-gray-900">Social accounts</h3>
              </div>
              <CustomButton
                text="Refresh"
                type="button"
                onClick={loadConnectedAccounts}
                className="btn-outline shrink-0"
                startIcon={<RefreshCw className="h-3 w-3" />}
              />
            </div>
            <p className="mb-2 text-[11px] leading-snug text-gray-600 sm:text-xs">
              Connect at least one platform so brands can verify your reach.
            </p>

            <div className="grid gap-2 sm:grid-cols-1">
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
                    className={`flex items-center gap-2.5 rounded-md border px-2.5 py-2 ${
                      isConnected ? "border-primary bg-indigo-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isConnected ? platformColor : "bg-white ring-1 ring-gray-200"
                      }`}
                    >
                      {getPlatformIcon(platform)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-900">{platform}</p>
                      {isConnected ? (
                        <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[10px] text-gray-600 sm:text-xs">
                          <CheckCircle className="h-3 w-3 shrink-0 text-primary" />
                          <span className="shrink-0 font-medium text-primary">Connected</span>
                          {username ? (
                            <span className="min-w-0 truncate text-gray-500">@{username}</span>
                          ) : null}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">Not connected</p>
                      )}
                    </div>
                    {!isConnected ? (
                      <CustomButton
                        text="Connect"
                        type="button"
                        className="btn-primary shrink-0"
                        disabled={isPlatformLoading}
                        loading={isPlatformLoading}
                        onClick={() => handleConnectSocialAccounts(platform)}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <Link2 className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">Media kit</h3>
            </div>
            <p className="mb-2 text-[11px] leading-snug text-gray-600 sm:text-xs">
              Use a link if you cannot connect a social account right now.
            </p>
            <CustomInput
              label="Media kit link"
              name="mediaKitUrl"
              value={mediaKitUrl}
              onChange={handleMediaKitUrlChange}
              placeholder="https://your-media-kit.com"
              isRequired={false}
              errors={mediaKitErrors}
            />
          </section>
        </div>

        {stepError ? (
          <p className="w-full bg-red-50 border border-red-200 rounded-md p-2 text-left text-xs leading-snug text-red-600 sm:flex-1 sm:px-3 sm:text-left">
            {stepError}
          </p>
        ) : null}
      </div>
    </OnboardingStepLayout>
  );
};

export default ConnectSocial;
