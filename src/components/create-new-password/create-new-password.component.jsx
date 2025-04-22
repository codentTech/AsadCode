import Link from "next/link";
import useCreateNewPassword from "./use-create-new-password.hook";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";

export default function CreateNewPassword() {
  const {
    handleSubmit,
    onSubmit,
    register,
    errors,
    showPassword,
    borderStyle,
    borderSuc,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    loading,
    password,
    confirm,
  } = useCreateNewPassword();

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-container-header">
          <Link href="/">
            <img alt="img" src="/assets/images/logo.png" />
          </Link>
        </div>

        <div className="form-card  ">
          <div className="form-header">
            <img src="/assets/images/lockImg.png" alt="img" />
            <h1 className="pt-4 text-[24px] font-bold capitalize not-italic leading-[36px] text-[#131516]">
              Create new Password
            </h1>
            <p className="text-5 mt-1 font-medium not-italic leading-[30px] text-[#494949]">
              That’s it. Setup your new password
            </p>
          </div>
          <div className="form-body">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group-c gap-[6px]">
                <label className="font-normal text-[14px] leading-[17.5px]">
                  New Password{" "}
                  <span className="form-group-c-label-span ">*</span>
                </label>
                <div className="form-password_wrapper">
                  <CustomInput
                    name="password"
                    placeholder="Enter New password"
                    type={showPassword ? "text" : "password"}
                    register={register}
                    className="form-control-c h-[42px]"
                    errors={errors}
                    isRequired={true}
                    style={errors.password ? borderStyle : borderSuc}
                  />
                  {errors.password ? (
                    <div className="create-new-pass-validation">
                      <div className="innerValidation">
                        {/* <img src="/assets/images/s_error.svg" alt="img" />
                        {errors.password.message} */}
                      </div>
                    </div>
                  ) : (
                    <p className="passText color_bbb">
                      Use 8 or more characters with a mix of letters, numbers &
                      symbols
                    </p>
                  )}
                  {/* todo.. unused code */}{" "}
                  {/* <img
                    role="presentation"
                    alt="img"
                    onClick={toggleShowPassword}
                    className="eye_iocn"
                    src={
                      showPassword
                        ? '/assets/images/pass_icon.png'
                        : '/assets/images/eye.svg'
                    }
                  /> */}
                </div>
              </div>
              <div className="form-group-c mt-6 gap-[6px]">
                <label className="font-normal text-[14px] leading-[17.5px]">
                  Confirm Password{" "}
                  <span className="form-group-c-label-span ">*</span>
                </label>
                <div className="form-password_wrapper">
                  <CustomInput
                    placeholder="Enter confirm password"
                    name="confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    register={register}
                    errors={errors}
                    className="form-control-c h-[42px]"
                    isRequired={true}
                    style={errors.confirm ? borderStyle : borderSuc}
                  />

                  {errors.confirm ? (
                    <div className="create-new-pass-validation">
                      <div className="innerValidation">
                        {/* <img src="/assets/images/s_error.svg" alt="img" />
                        {errors.password.message} */}
                      </div>
                    </div>
                  ) : (
                    <p className="passText color_bbb">
                      Use 8 or more characters with a mix of letters, numbers &
                      symbols
                    </p>
                  )}

                  {/* <div className="create-new-pass-validation">
                    <div className="innerValidation">
                      {errors.confirm ? (
                        <>
                          <img alt="img" src="/assets/images/s_error.svg" />
                          {errors.confirm.message}
                        </>
                      ) : null}
                    </div>
                  </div> */}
                  {/* <img
                    role="presentation"
                    alt="im"
                    onClick={toggleShowConfirmPassword}
                    className="eye_iocn"
                    src={
                      showConfirmPassword
                        ? '/assets/images/pass_icon.png'
                        : '/assets/images/eye.svg'
                    }
                  /> */}
                </div>
              </div>

              <div className="form-btn-c mt-8">
                <CustomButton
                  type="submit"
                  className="btn-primary rounded-[10px] mt-2 h-[50px] w-full px-[30px] py-3 text-base font-semibold leading-6"
                  disabled={!password || !confirm || loading}
                  text={!loading && "Update Password"}
                  startIcon={<Loader loading={loading} />}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
