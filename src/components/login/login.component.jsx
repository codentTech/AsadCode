import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import Link from "next/link";
import useLogin from "./use-login.hook";

export default function Login() {
  // hooks
  const {
    onSubmit,
    isChecked,
    setIsChecked,
    loading,
    register,
    handleSubmit,
    errors,
    email,
    password,
  } = useLogin();

  return (
    <div className="form-wrapper px-2.5 sm:px-4">
      <div className="form-container">
        <div className="form-card w-full max-w-[437px] px-0 py-6 sm:py-10">
          <Link href="/" className="flex justify-center mb-2">
            <img src="/assets/images/horizontal-logo.png" alt="Logo" className="h-8 sm:h-[60px]" />
          </Link>
          <div className="form-header">
            {/* <h1 className="form-header-h1">Login</h1> */}
            <p className="form-header-p text-sm leading-snug sm:text-[20px] sm:leading-[30px]">
              Welcome back. <span className="text-primary">Login</span> to your account
            </p>
          </div>
          <div className="form-body px-3 pt-4 sm:px-6 sm:pt-6">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)} method="post">
              <div className="form-fields">
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

              <div className="mt-3 flex items-center justify-between sm:mt-4">
                <div className="flex gap-[6.5px]" onClick={() => setIsChecked(!isChecked)}>
                  {isChecked ? (
                    <img src="/assets/icons/check.svg" alt="" />
                  ) : (
                    <img src="/assets/icons/uncheck.svg" alt="" />
                  )}

                  <label
                    htmlFor="terms"
                    id="terms"
                    className="fon cursor-pointer text-[10px] font-normal not-italic leading-[16px] sm:text-[12px] sm:leading-[18px]"
                  >
                    Remember Me
                  </label>
                </div>
                <Link
                  href="/forget-password"
                  className="forgotText rounded-xl text-[10px] font-bold leading-[16px] sm:text-xs sm:leading-[18px]"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="form-btn-c mt-4">
                <CustomButton
                  type="submit"
                  className="btn-primary w-full"
                  text={!loading && "Login"}
                  startIcon={<Loader loading={loading} />}
                  disabled={!email || !password || loading}
                />
              </div>

              <div className="form-or-content mt-1">
                <div className="form-or-content-line" />
                <span className="form-or-content-span eading-[18px]">Or</span>
                <div className="form-or-content-line" />
              </div>
              <div className="login-with-provider">
                <button
                  // onClick={() => signInWithGoogle(loginWithOAuth)}
                  className="login-provider-btn"
                  type="button"
                >
                  <img
                    src="/assets/images/google-icon.svg"
                    alt="login with Google"
                    className="h-6 w-6"
                  />
                </button>
                <button
                  // onClick={() => signInWithFacebook(loginWithOAuth)}
                  className="login-provider-btn"
                  type="button"
                >
                  <img
                    src="/assets/images/facebook-icon.svg"
                    alt="login with Facebook"
                    className="h-6 w-6"
                  />
                </button>
                <button
                  // onClick={() => signInWithMicrosoft(loginWithOAuth)}
                  className="login-provider-btn"
                  type="button"
                >
                  <img
                    src="/assets/images/microsoft-icon.svg"
                    alt="login with Microsoft"
                    className="h-[18px] w-[17.93px]"
                  />
                </button>
              </div>
              <div className="text-[10px] font-normal leading-[16px] text-text-dark-gray sm:text-xs sm:leading-[18px]">
                <p className="login mt-4 text-center sm:mt-5">
                  Create an account?
                  <Link href="/onboarding" className="span-link">
                    Signup
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
