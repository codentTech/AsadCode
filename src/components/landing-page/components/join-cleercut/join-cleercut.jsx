import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import { CheckCircle } from "lucide-react";
import useJoinCleercut from "./use-join-cleercut";

export default function JoinCleerCut({ closeModal }) {
  const { loading, register, handleSubmit, onSubmit, errors, isSubmitted } =
    useJoinCleercut();

  return (
    <div className="relative w-full transform p-2 transition-all">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} method="post">
          {/* Join Form */}
          <p className="text-sm mb-3 text-gray-600">
            Be among the first to revolutionize your influencer marketing. Enter
            your email to join our waitlist.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <CustomInput
                  name="email"
                  type="email"
                  register={register}
                  errors={errors}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <CustomButton
              type="submit"
              text={!loading && "Secure My Spot"}
              disabled={loading}
              onClick={handleSubmit}
              startIcon={<Loader loading={loading} />}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              By joining, you agree to our{" "}
              <a href="#" className="text-primary hover:text-indigo-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:text-indigo-800">
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      ) : (
        // Success State
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">You're In!</h3>
          </div>

          <div className="text-left bg-blue-50 p-3 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">
              Thank you for joining CleerCut — you've been added to our
              waitlist. As an early access brand, you'll unlock exclusive perks:
            </p>

            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="text-primary mr-2">●</span>
                <span className="text-sm text-gray-600">
                  <span className="text-sm font-semibold">
                    3 Commission-Free Campaigns
                  </span>{" "}
                  to kickstart creator partnerships
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">●</span>
                <span className="text-sm text-gray-600">
                  <span className="text-sm font-semibold">
                    Lifetime Discount
                  </span>{" "}
                  on future subscription plans
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">●</span>
                <span className="text-sm text-gray-600">
                  <span className="text-sm font-semibold">Early Access</span> to
                  premium tools (analytics, smart contracts, campaign insights
                  and more)
                </span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            We're launching soon — keep an eye on your inbox for priority
            onboarding and early setup.
          </p>

          <p className="text-sm text-primary font-semibold">
            Welcome to the future of influencer marketing.
          </p>

          <CustomButton text=" Got it, thanks!" onClick={closeModal} />
        </div>
      )}
    </div>
  );
}
