import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CountDown from "./components/countdown/count-down.component";
import useTwoFactorAuth from "./use-two-factor-auth.hook";
import Loader from "@/common/components/loader/loader.component";

export default function TwoFactorAuthComponent() {
  const {
    phone,
    otpNumberChangeHandler,
    otpNumber1,
    otpNumber2,
    otpNumber3,
    otpNumber4,
    setIsTimerStop,
    verifyOtpHandler,
    resendOtpHandler,
    isTimerStop,
    loading,
    isOtpVerified,
  } = useTwoFactorAuth();

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-container-header">
          <Link href="/">
            <img alt="img" src="/assets/images/logo.png" />
          </Link>
        </div>

        <div className="form-card">
          <div className="form-header">
            <svg
              width="70"
              height="70"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="35"
                cy="35"
                r="35"
                fill="#1D4ED8"
                fill-opacity="0.1"
              />
              <g clipPath="url(#clip0_3683_91070)">
                <g clipPath="url(#clip1_3683_91070)">
                  <path
                    d="M22.2449 44.9141C22.0965 44.6565 21.7609 44.5707 21.5033 44.719L20.145 45.5074V43.9384C20.145 43.6417 19.903 43.3997 19.6064 43.3997C19.3098 43.3997 19.0678 43.6417 19.0678 43.9384V45.5074L17.7095 44.719C17.4519 44.5707 17.1163 44.6565 16.968 44.9141C16.8196 45.1717 16.9055 45.5074 17.1631 45.6557L18.5292 46.4519L17.1631 47.2481C16.9055 47.3965 16.8196 47.7321 16.968 47.9897C17.1163 48.2473 17.4519 48.3332 17.7095 48.1849L19.0678 47.3965V48.9655C19.0678 49.2621 19.3098 49.5041 19.6064 49.5041C19.903 49.5041 20.145 49.2621 20.145 48.9655V47.3965L21.5033 48.1849C21.7609 48.3332 22.0965 48.2473 22.2449 47.9897C22.3932 47.7321 22.3073 47.3965 22.0497 47.2481L20.6836 46.4519L22.0497 45.6557C22.3073 45.4996 22.401 45.1717 22.2449 44.9141ZM27.2329 47.9819C27.3813 48.2395 27.7169 48.3254 27.9745 48.1771L29.3328 47.3887V48.9577C29.3328 49.2543 29.5748 49.4963 29.8714 49.4963C30.168 49.4963 30.41 49.2543 30.41 48.9577V47.3887L31.7683 48.1771C32.0259 48.3254 32.3615 48.2395 32.5099 47.9819C32.6582 47.7243 32.5723 47.3887 32.3147 47.2403L30.9486 46.4441L32.3147 45.6479C32.5723 45.4996 32.6582 45.1639 32.5099 44.9063C32.3615 44.6487 32.0259 44.5628 31.7683 44.7112L30.41 45.4996V43.9306C30.41 43.6339 30.168 43.3919 29.8714 43.3919C29.5748 43.3919 29.3328 43.6339 29.3328 43.9306V45.4996L27.9745 44.719C27.7169 44.5707 27.3813 44.6565 27.2329 44.9141C27.0846 45.1717 27.1705 45.5074 27.4281 45.6557L28.7942 46.4519L27.4281 47.2403C27.1705 47.3887 27.0846 47.7243 27.2329 47.9819ZM26.265 52.0723V53.0246C26.265 53.251 26.4523 53.4384 26.6787 53.4384H33.0719C33.2983 53.4384 33.4856 53.251 33.4856 53.0246V52.0723C33.4856 51.8459 33.2983 51.6586 33.0719 51.6586H26.6787C26.4445 51.6586 26.265 51.8459 26.265 52.0723ZM41.8459 25.4536H41.7991V23.3303C41.7991 19.638 38.7781 16.5 35.0937 16.5624C31.5107 16.6249 28.6068 19.56 28.6068 23.1586V23.3615C28.6068 23.666 28.8566 23.9158 29.1611 23.9158H30.933C31.2375 23.9158 31.4873 23.666 31.4873 23.3615V23.2991C31.4873 21.3163 32.9782 19.5756 34.961 19.4507C37.1154 19.318 38.9108 21.0275 38.9108 23.1508V25.4458H33.4466V25.4536H28.3961C27.4593 25.4848 26.7021 26.242 26.7021 27.1865V36.788C26.7021 37.7481 27.4827 38.5287 28.4429 38.5287H41.8381C42.7983 38.5287 43.5789 37.7481 43.5789 36.788V27.1943C43.5867 26.2342 42.8061 25.4536 41.8459 25.4536ZM36.1787 32.4244C36.046 32.5181 36.007 32.6195 36.007 32.7757C36.0148 33.4782 36.0148 34.1808 36.007 34.8911C36.0226 35.1877 35.8743 35.4688 35.6089 35.6015C34.9922 35.9137 34.3755 35.4766 34.3755 34.8911V32.7679C34.3755 32.6274 34.3443 32.5259 34.2194 32.4322C33.5793 31.9638 33.3685 31.1598 33.6886 30.4495C34.0008 29.7625 34.758 29.3566 35.4684 29.5049C36.2646 29.661 36.8188 30.3089 36.8266 31.0974C36.85 31.6516 36.6237 32.1043 36.1787 32.4244ZM36.5222 52.0723V53.0246C36.5222 53.251 36.7095 53.4384 36.9359 53.4384H43.3291C43.5555 53.4384 43.7428 53.251 43.7428 53.0246V52.0723C43.7428 51.8459 43.5555 51.6586 43.3291 51.6586H36.9359C36.7095 51.6586 36.5222 51.8459 36.5222 52.0723ZM37.4901 47.9819C37.6385 48.2395 37.9741 48.3254 38.2317 48.1771L39.59 47.3887V48.9577C39.59 49.2543 39.832 49.4963 40.1286 49.4963C40.4252 49.4963 40.6672 49.2543 40.6672 48.9577V47.3887L42.0255 48.1771C42.2831 48.3254 42.6187 48.2395 42.767 47.9819C42.9154 47.7243 42.8295 47.3887 42.5719 47.2403L41.2058 46.4441L42.5719 45.6479C42.8295 45.4996 42.9154 45.1639 42.767 44.9063C42.6187 44.6487 42.2831 44.5628 42.0255 44.7112L40.6672 45.4996V43.9306C40.6672 43.6339 40.4252 43.3919 40.1286 43.3919C39.832 43.3919 39.59 43.6339 39.59 43.9306V45.4996L38.2317 44.7112C37.9741 44.5628 37.6385 44.6487 37.4901 44.9063C37.3418 45.1639 37.4277 45.4996 37.6853 45.6479L39.0514 46.4441L37.6853 47.2403C37.4277 47.3887 37.3418 47.7243 37.4901 47.9819ZM53.5863 51.6586H47.1931C46.9667 51.6586 46.7794 51.8459 46.7794 52.0723V53.0246C46.7794 53.251 46.9667 53.4384 47.1931 53.4384H53.5863C53.8127 53.4384 54 53.251 54 53.0246V52.0723C54 51.8459 53.8127 51.6586 53.5863 51.6586ZM16.4137 53.4384H22.8069C23.0333 53.4384 23.2206 53.251 23.2206 53.0246V52.0723C23.2206 51.8459 23.0333 51.6586 22.8069 51.6586H16.4137C16.1873 51.6586 16 51.8459 16 52.0723V53.0246C16 53.251 16.1873 53.4384 16.4137 53.4384ZM47.7551 47.9819C47.9034 48.2395 48.2391 48.3254 48.4967 48.1771L49.855 47.3887V48.9577C49.855 49.2543 50.097 49.4963 50.3936 49.4963C50.6902 49.4963 50.9322 49.2543 50.9322 48.9577V47.3887L52.2905 48.1771C52.5481 48.3254 52.8837 48.2395 53.032 47.9819C53.1804 47.7243 53.0945 47.3887 52.8369 47.2403L51.4708 46.4441L52.8369 45.6479C53.0945 45.4996 53.1804 45.1639 53.032 44.9063C52.8837 44.6487 52.5481 44.5628 52.2905 44.7112L50.9322 45.4996V43.9306C50.9322 43.6339 50.6902 43.3919 50.3936 43.3919C50.097 43.3919 49.855 43.6339 49.855 43.9306V45.4996L48.4967 44.7112C48.2391 44.5628 47.9034 44.6487 47.7551 44.9063C47.6068 45.1639 47.6927 45.4996 47.9503 45.6479L49.3163 46.4441L47.9503 47.2403C47.6927 47.3887 47.599 47.7243 47.7551 47.9819Z"
                    fill="#1D4ED8"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_3683_91070">
                  <rect
                    width="38"
                    height="38"
                    fill="white"
                    transform="translate(16 16)"
                  />
                </clipPath>
                <clipPath id="clip1_3683_91070">
                  <rect
                    width="38"
                    height="38"
                    fill="white"
                    transform="translate(16 16)"
                  />
                </clipPath>
              </defs>
            </svg>

            <h1 className="mt-4 text-center text-2xl font-bold capitalize not-italic leading-9 text-text-black">
              OTP Verification
            </h1>
            <p className="mt-2 text-center text-sm font-normal  not-italic leading-[17.5px] text-text-dark-gray">
              Please Enter OTP send to{" "}
              <span className="text-black">+{phone}</span>
            </p>
          </div>
          <div className="form-body -mt-2">
            <div className="mb-8 flex flex-col">
              <div className="mb-4 flex gap-4">
                <input
                  id="1"
                  type="text"
                  maxLength={1}
                  placeholder="-"
                  onChange={otpNumberChangeHandler}
                  ref={otpNumber1}
                  className="flex flex h-[43px] w-[50px] flex-row items-center gap-2 rounded-[1px] border-b border-solid border-b-disabled-input px-3 py-[11px] text-center text-[1.4rem] font-medium not-italic leading-[2.1rem] text-text-dark-gray"
                />
                <input
                  id="2"
                  type="text"
                  maxLength={1}
                  placeholder="-"
                  onChange={otpNumberChangeHandler}
                  ref={otpNumber2}
                  className="flex h-[43px] w-[50px] flex-row items-center gap-2 rounded-[1px] border-b border-solid border-b-disabled-input px-3 py-[11px] text-center text-[1.4rem] font-medium not-italic leading-[2.1rem] text-text-dark-gray"
                />
                <input
                  id="3"
                  type="text"
                  maxLength={1}
                  placeholder="-"
                  onChange={otpNumberChangeHandler}
                  ref={otpNumber3}
                  className="flex h-[43px] w-[50px] flex-row items-center gap-2 rounded-[1px] border-b border-solid border-b-disabled-input px-3 py-[11px] text-center text-[1.4rem] font-medium not-italic leading-[2.1rem] text-text-dark-gray"
                />
                <input
                  id="4"
                  type="text"
                  maxLength={1}
                  placeholder="-"
                  onChange={otpNumberChangeHandler}
                  ref={otpNumber4}
                  className="flex h-[43px] w-[50px] flex-row items-center gap-2 rounded-[1px] border-b border-solid border-b-disabled-input px-3 py-[11px] text-center text-[1.4rem] font-medium not-italic leading-[2.1rem] text-text-dark-gray"
                />
              </div>
              <div className="text-right">
                <CountDown
                  stopTimerHandler={setIsTimerStop}
                  isRunTimer={!isTimerStop}
                />
              </div>
            </div>
            <div className="verify-form-btn-c w-full">
              <CustomButton
                type="submit"
                className="btn-primary leading-[16.94px] h-[50px] w-full px-[30px] py-[12px] text-[14px] font-semibold"
                onClick={verifyOtpHandler}
                text={!loading && "Verify Code"}
                startIcon={<Loader loading={loading} />}
                disabled={isOtpVerified}
              />
            </div>
            <div className="otp-form-footer mt-[24px]">
              <p className="text-[12px] font-bold not-italic leading-[18px] text-text-dark-gray">
                Don’t receive code?{" "}
                <button
                  type="button"
                  onClick={resendOtpHandler}
                  className={`text-red-500 ${
                    !isTimerStop ? "!cursor-not-allowed !text-gray-400" : ""
                  } `}
                  disabled={!isTimerStop}
                >
                  Resend SMS
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
