import { useRouter } from "next/navigation";
import Link from "next/link";
import useForgetPassword from "./use-forget-password.hook";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";

export default function ForgetPassword() {
  const router = useRouter();
  const {
    email,
    handleSubmit,
    onSubmit,
    register,
    errors,
    borderStyle,
    borderSuc,
    loading,
  } = useForgetPassword();
  return (
    <div className="form-wrapper">
      <div className="form-container ">
        <div className="form-container-header">
          <Link href="/">
            <img alt="img" src="/assets/images/logo.png" />
          </Link>
        </div>

        <div className="form-card px-6">
          <div className="form-header">
            <img src="/assets/images/searchImg.png" alt="img" />
            <h1 className="pt-4 text-[24px] font-bold capitalize not-italic leading-9 text-[#131516]">
              Find Your Account
            </h1>
            <p className="pt-2 text-center text-[16px] font-medium not-italic leading-[24px] text-[#46474F]">
              Enter the email associated with your account to change your
              password.
            </p>
          </div>
          <div className="flex flex-col items-center pb-0 pt-[36px]">
            <form
              method="post"
              className="w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-group-c">
                <label className="form-group-c-label">
                  Email <span className="form-group-c-label-span ">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  name="email"
                  className="form-group-c-input"
                  placeholder="example@example.com"
                  style={errors.email ? borderStyle : borderSuc}
                />
                {/* <div className="forgot-password-validation">
                  <div>{errors.email}</div>
                </div> */}
              </div>
              <div className="form-btn-c mt-8 flex  justify-center">
                <CustomButton
                  type="submit"
                  className="btn-primary h-[50px] w-full rounded-xl px-[30px] py-3 text-sm font-semibold leading-[17px]"
                  text={!loading && "Send Reset Link"}
                  startIcon={<Loader loading={loading} />}
                  disabled={!email || loading}
                />
              </div>
              <div className="form-btn-c flex justify-center">
                <span
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="inner-link mt-6 text-xs leading-[18px] text-text-dark-gray no-underline"
                >
                  Back to Login
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
