"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Check, Sparkles, Star } from "lucide-react";
import usePreparingWorkspace from "./use-preparing-workspace.hook";

const PreparingWorkspace = ({ onReady }) => {
  const {
    position,
    percent,
    stage,
    checklist,
    isComplete,
    circumference,
    strokeOffset,
    sparkles,
    showReplay,
    handleReplay,
  } = usePreparingWorkspace({ onReady });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-3 py-8 sm:px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute h-64 w-64 rounded-full bg-indigo-200/70 blur-3xl sm:h-80 sm:w-80"
          style={{
            left: `calc(8% + ${position.x}px)`,
            top: `calc(18% + ${position.y}px)`,
            transition: "all 0.3s ease",
          }}
        />
        <div
          className="absolute h-80 w-80 rounded-full bg-violet-200/60 blur-3xl sm:h-96 sm:w-96"
          style={{
            right: `calc(10% + ${position.x * -1}px)`,
            bottom: `calc(12% + ${position.y * -1}px)`,
            transition: "all 0.5s ease",
          }}
        />
        <div
          className="absolute h-48 w-48 rounded-full bg-primary/20 blur-3xl"
          style={{
            left: `calc(48% + ${position.y}px)`,
            top: `calc(8% + ${position.x}px)`,
            transition: "all 0.4s ease",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-white/80 bg-white/90 p-5 shadow-2xl backdrop-blur-md sm:rounded-lg sm:p-8">
        <div className="relative -mx-5 mb-4 min-h-[9.5rem] sm:-mx-8 sm:min-h-[10.5rem]">
          <div className="pointer-events-none absolute inset-0">
            {sparkles.map((sparkle) => (
              <Star
                key={sparkle.id}
                className="pw-sparkle absolute fill-current text-primary"
                style={{
                  top: `${sparkle.top}%`,
                  left: `${sparkle.left}%`,
                  width: sparkle.size,
                  height: sparkle.size,
                  animationDelay: `${sparkle.delay}s`,
                  animationDuration: `${sparkle.duration}s`,
                  ["--pw-drift-x"]: `${sparkle.driftX}px`,
                  ["--pw-drift-y"]: `${sparkle.driftY}px`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 flex h-full min-h-[9.5rem] items-center justify-center sm:min-h-[10.5rem]">
            <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            <svg className="h-28 w-28 -rotate-90 sm:h-32 sm:w-32" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                className="stroke-indigo-100"
                strokeWidth="4"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                className="stroke-primary transition-[stroke-dashoffset] duration-200 ease-linear"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isComplete ? (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white sm:h-12 sm:w-12">
                  <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
              ) : (
                <>
                  <Sparkles className="mb-0.5 h-4 w-4 text-primary" />
                  <span className="text-lg font-bold tabular-nums text-gray-900 sm:text-xl">
                    {percent}%
                  </span>
                </>
              )}
            </div>
            </div>
          </div>
        </div>

        <div className="mb-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
            {isComplete ? "Ready" : "Please wait"}
          </p>
          <h1 className="mt-1 text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
            {stage.title}
          </h1>
          <p className="mt-1 max-w-sm text-[11px] leading-snug text-gray-600 sm:text-xs md:text-sm">
            {stage.detail}
          </p>
        </div>

        <div className="relative z-10 mb-4 h-1.5 overflow-hidden rounded-full bg-indigo-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-200 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="relative z-10 space-y-2">
          {checklist.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 ${
                item.done
                  ? "border-indigo-200 bg-indigo-50"
                  : item.active
                    ? "border-primary/40 bg-white"
                    : "border-gray-100 bg-gray-50"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  item.done
                    ? "bg-primary text-white"
                    : item.active
                      ? "border-2 border-primary bg-white text-primary"
                      : "border border-gray-300 bg-white text-gray-400"
                }`}
              >
                {item.done ? <Check className="h-3 w-3" /> : null}
              </span>
              <span
                className={`text-xs font-medium sm:text-sm ${
                  item.done ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <p className="relative z-10 mt-4 text-center text-[10px] text-gray-500 sm:text-xs">
          Don’t close this page — we’re finishing things up for you.
        </p>

        {showReplay && isComplete ? (
          <div className="relative z-10 mt-4 flex justify-center">
            <CustomButton
              text="Replay preview"
              type="button"
              className="btn-outline"
              onClick={handleReplay}
            />
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes pw-sparkle-float {
          0%,
          100% {
            transform: translate(0, 0) scale(0.7) rotate(-14deg);
            opacity: 0.2;
          }
          50% {
            transform: translate(var(--pw-drift-x, 8px), var(--pw-drift-y, -10px)) scale(1.2)
              rotate(12deg);
            opacity: 1;
          }
        }
        :global(.pw-sparkle) {
          animation-name: pw-sparkle-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.4));
        }
      `}</style>
    </div>
  );
};

export default PreparingWorkspace;
