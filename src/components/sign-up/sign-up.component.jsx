"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import Link from "next/link";
import useSignUp from "./use-sign-up.hook";

function SignUp() {
  const {
    firstName,
    lastName,
    handleSubmit,
    onSubmit,
    register,
    errors,
    isChecked,
    loading,
    setIsChecked,
    email,
    password,
  } = useSignUp();

  return (
    <div className="form-wrapper">
      <div className="form-container mb-0 pb-0">
        <div className="form-card pt-[42.1px]">
          <div className="flex flex-col items-center px-6 py-0">
            <h1 className="form-header-h1">Sign up</h1>
            <p className="form-header-p mt-2">
              Welcome. Please enter your details{" "}
            </p>
          </div>
          <div className="form-body pt-[20px]">
            <form className=" w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-fields">
                <CustomInput
                  label="First Name"
                  name="firstName"
                  register={register}
                  errors={errors}
                  placeholder="Enter first name"
                  isRequired={true}
                />
                <CustomInput
                  label="Last Name"
                  name="lastName"
                  register={register}
                  errors={errors}
                  placeholder="Enter last name"
                  isRequired={true}
                />
                <CustomInput
                  label="Email/Username"
                  name="email"
                  register={register}
                  errors={errors}
                  placeholder="Enter Email or Username"
                  isRequired={true}
                />

                <CustomInput
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  errors={errors}
                  placeholder="*******"
                  isRequired={true}
                />
              </div>

              <div className="mt-4 flex gap-[6.5px]">
                {isChecked ? (
                  <img
                    src="/assets/icons/check.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => setIsChecked(!isChecked)}
                  />
                ) : (
                  <img
                    src="/assets/icons/uncheck.svg"
                    alt=""
                    className="cursor-pointer"
                    onClick={() => setIsChecked(!isChecked)}
                  />
                )}

                <Link
                  href="/terms-and-conditions"
                  className="text-[12px] not-italic leading-[18px] underline hover:no-underline"
                >
                  Terms & Conditions
                </Link>
              </div>

              <div className="form-btn-c mt-8">
                <CustomButton
                  type="submit"
                  className="btn-primary h-[50px] w-full rounded-xl px-[30px] py-3 text-base font-semibold leading-6"
                  text={!loading && "Sign up"}
                  startIcon={<Loader loading={loading} />}
                  disabled={
                    !firstName ||
                    !lastName ||
                    !email ||
                    !password ||
                    !isChecked ||
                    loading
                  }
                />
              </div>
              <div className="form-or-content mt-[24px]">
                <div className="form-or-content-line" />
                <span className="form-or-content-span eading-[18px]">Or</span>
                <div className="form-or-content-line" />
              </div>
              <div className="login-with-provider m-0 mt-[24px]">
                <button
                  // onClick={() => signInWithGoogle(signUpWithOAuth)}
                  className="login-provider-btn"
                  type="button"
                >
                  <img
                    src="/assets/images/google-icon.svg"
                    alt="login with Google"
                    className="h-6 w-6"
                  />
                </button>
              </div>
              <div className="form_links mt-[32px] text-center text-xs font-normal leading-[18px]">
                <label className="login">Already have an account?</label>
                <Link href="/login" className="span-link">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
