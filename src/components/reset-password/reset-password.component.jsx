"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import Link from "next/link";
import useResetPassword from "./use-reset-password.hook";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    errors,
    newPassword,
    confirmPassword,
    onSubmit,
    isLoading,
    isSuccess,
    isError,
    message,
    token,
    goToLogin,
  } = useResetPassword();

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-card">
          <Link href="/" className="flex justify-center mb-2">
            <img
              src="/assets/images/horizontal-logo.png"
              alt="Logo"
              className="h-[40px] sm:h-[60px]"
            />
          </Link>
          <div className="form-header">
            <p className="form-header-p">
              <span className="text-primary">Set new password</span>
            </p>
            <p className="mt-2 text-sm text-text-dark-gray">
              Choose a new password for your CleerCut account.
            </p>
          </div>
          <div className="form-body">
            {!token ? (
              <div className="w-full text-center">
                <p className="text-sm text-red-600">
                  This reset link is invalid or missing. Request a new one from the login page.
                </p>
                <CustomButton
                  type="button"
                  className="btn-primary mt-6 h-[50px] w-full rounded-xl px-[30px] py-3 text-base leading-6"
                  text="Back to login"
                  onClick={goToLogin}
                />
              </div>
            ) : isSuccess ? (
              <div className="w-full text-center">
                <p className="text-sm text-neutral-700">Your password was updated. Redirecting to login…</p>
                <CustomButton
                  type="button"
                  className="btn-primary mt-6 h-[50px] w-full rounded-xl px-[30px] py-3 text-base leading-6"
                  text="Go to login"
                  onClick={goToLogin}
                />
              </div>
            ) : (
              <form className="w-full" onSubmit={handleSubmit(onSubmit)} method="post">
                <div className="form-fields">
                  <CustomInput
                    label="New password"
                    name="newPassword"
                    type="password"
                    register={register}
                    errors={errors}
                    placeholder="New password"
                    isRequired={true}
                  />
                  <CustomInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    register={register}
                    errors={errors}
                    placeholder="Confirm new password"
                    isRequired={true}
                  />
                </div>
                {isError && message ? (
                  <p className="mt-2 text-sm text-red-600">{message}</p>
                ) : null}
                <div className="form-btn-c mt-[32px]">
                  <CustomButton
                    type="submit"
                    className="btn-primary h-[50px] w-full rounded-xl px-[30px] py-3 text-base leading-6"
                    text={!isLoading && "Update password"}
                    startIcon={<Loader loading={isLoading} />}
                    disabled={!newPassword || !confirmPassword || isLoading}
                  />
                </div>
                <div className="text-xs font-normal leading-[18px] text-text-dark-gray mt-6 text-center">
                  <Link href="/login" className="span-link">
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
