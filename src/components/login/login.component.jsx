import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import useLogin from "./use-login.hook";
import CustomInput from "@/common/components/custom-input/custom-input.component";

export default function Login() {
  // hooks
  const {
    onSubmit,
    borderStyle,
    borderSuc,
    showPassword,
    isChecked,
    setIsChecked,
    toggleShowPassword,
    router,
    loading,
    register,
    handleSubmit,
    errors,
    email,
    password,
  } = useLogin();

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
            {/* <h1 className="form-header-h1">Login</h1> */}
            <p className="form-header-p">
              Welcome back. <span className="text-primary">Login</span> to your account
            </p>
          </div>
          <div className="form-body">
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

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-[6.5px]" onClick={() => setIsChecked(!isChecked)}>
                  {isChecked ? (
                    <img src="/assets/icons/check.svg" alt="" />
                  ) : (
                    <img src="/assets/icons/uncheck.svg" alt="" />
                  )}

                  <label
                    htmlFor="terms"
                    id="terms"
                    className="fon cursor-pointer text-[12px]
                 font-normal not-italic leading-[18px]"
                  >
                    Remember Me
                  </label>
                </div>
                <Link
                  href="/forget-password"
                  onClick={() => router.push("/forget-password?btnText=Password%20Recovery%20Link")}
                  className="forgotText rounded-xl text-xs font-bold leading-[18px] "
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="form-btn-c mt-[32px]">
                <CustomButton
                  type="submit"
                  className="btn-primary h-[50px] w-full rounded-xl px-[30px] py-3 text-base leading-6"
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
              <div className="text-xs font-normal leading-[18px] text-text-dark-gray">
                <p className="login mt-5 text-center">
                  Create an account?
                  <Link href="/" className="span-link">
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
