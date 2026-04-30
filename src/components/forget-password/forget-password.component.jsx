"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import Link from "next/link";
import useForgotPassword from "./use-forgot-password.hook";

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    errors,
    email,
    onSubmit,
    isLoading,
    isSuccess,
    isError,
    message,
    goToLogin,
  } = useForgotPassword();

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
              <span className="text-primary">Forgot password</span>
            </p>
            <p className="mt-2 text-sm text-text-dark-gray">
              Enter your account email and we will send you a link to reset your password.
            </p>
          </div>
          <div className="form-body">
            {isSuccess ? (
              <div className="w-full text-center">
                <p className="text-sm text-neutral-700">
                  {message ||
                    "We sent password reset instructions to your email. Check your inbox and spam folder."}
                </p>
                <CustomButton
                  type="button"
                  className="btn-primary mt-6 h-[50px] w-full rounded-xl px-[30px] py-3 text-base leading-6"
                  text="Back to login"
                  onClick={goToLogin}
                />
              </div>
            ) : (
              <form className="w-full" onSubmit={handleSubmit(onSubmit)} method="post">
                <div className="form-fields">
                  <CustomInput
                    label="Email"
                    name="email"
                    register={register}
                    errors={errors}
                    placeholder="you@example.com"
                    isRequired={true}
                  />
                </div>

                <div className="form-btn-c mt-4">
                  <CustomButton
                    type="submit"
                    className="btn-primary w-full"
                    text={!isLoading && "Send reset link"}
                    loading={isLoading}
                    disabled={!email || isLoading}
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
