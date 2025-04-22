import Link from 'next/link';
import * as yup from 'yup';
import useChangePassword from './use-change-password.hook';
import CustomButton from '@/common/components/custom-button/custom-button.component';

function ChangePassword() {
  const {
    handleSubmit,
    onSubmit,
    borderStyle,
    borderSuc,
    showOldPassword,
    showConfirmPassword,
    showPassword,
    register,
    errors,
    toggleShowOldPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    loader
  } = useChangePassword();
  return (
    <div className="change-pass-wrapper ">
      <div className="change-pass-container">
        <div className="header">
          <Link href="/">
            <img alt="img" src="/assets/images/logo.png" />
          </Link>
        </div>

        <div className="change-pass-form-card ">
          <div className="form-header">
            <img src="/assets/images/lockImg.png" alt="img" />
            <h1>Change Password</h1>
            <p>That’s it. Setup your new password</p>
          </div>
          <div className="form-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group-c">
                {/* todo.. use common input component */}
                <label>
                  Old Password <span>*</span>
                </label>
                <div className="pass_input_div">
                  <input
                    {...register('old')}
                    type={showOldPassword ? 'text' : 'password'}
                    className="form-control-c"
                    placeholder="*****"
                    style={errors.old ? borderStyle : borderSuc}
                  />
                  <div className="change-pass-validation">
                    <div className="innerValidation">
                      {errors.old ? (
                        <>
                          <img alt="img" src="/assets/images/s_error.svg" />
                          {errors.old.message}
                        </>
                      ) : null}
                    </div>
                  </div>
                  <img
                    role="presentation"
                    alt="img"
                    onClick={toggleShowOldPassword}
                    className="eye_iocn"
                    src={
                      showOldPassword
                        ?
                          '/assets/images/pass_icon.png'
                        : '/assets/images/eye.svg'
                    }
                  />
                </div>
              </div>
              <div className="form-group-c">
                <label>
                  New Password <span>*</span>
                </label>
                <div className="pass_input_div">
                  <input
                    {...register('pass')}
                    type={showPassword ? 'text' : 'password'}
                    name="pass"
                    className="form-control-c"
                    placeholder="*****"
                    style={errors.pass ? borderStyle : borderSuc}
                  />
                  <div className="change-pass-validation">
                    <div className="innerValidation">
                      {errors.pass ? (
                        <>
                          <img src="/assets/images/s_error.svg" alt="img" />
                          {errors.pass.message}
                        </>
                      ) : (
                        <p className="passText color_bbb">
                          Use 8 or more characters with a mix of letters, numbers &
                          symbols
                        </p>
                      )}
                    </div>
                  </div>
                  <img
                    role="presentation"
                    alt="img"
                    onClick={toggleShowPassword}
                    className="eye_iocn"
                    src={
                      showPassword
                        ? '/assets/images/pass_icon.png'
                        : '/assets/images/eye.svg'
                    }
                  />
                </div>
              </div>
              <div className="form-group-c">
                <label>
                  Confirm Password <span>*</span>
                </label>
                <div className="pass_input_div">
                  <input
                    {...register('confirm')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm"
                    className="form-control-c"
                    placeholder="*****"
                    style={errors.confirm ? borderStyle : borderSuc}
                  />
                  <div className="change-pass-validation">
                    <div className="innerValidation">
                      {errors.confirm ? (
                        <>
                          <img alt="img" src="/assets/images/s_error.svg" />
                          {errors.confirm.message}
                        </>
                      ) : null}
                    </div>
                  </div>
                  <img
                    role="presentation"
                    alt="img"
                    onClick={toggleShowConfirmPassword}
                    className="eye_iocn"
                    src={
                      showConfirmPassword
                        ? '/assets/images/pass_icon.png'
                        : '/assets/images/eye.svg'
                    }
                  />
                </div>
              </div>

              <div className="form-btn-c">
                <CustomButton
                  type="submit"
                  className="submit-btn"
                  loading={loader}
                  disabled={loader}
                  text="Change Password"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
