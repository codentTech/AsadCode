"use client";

function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center overflow-hidden">
      {/* Rotating Circle Rings Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-40 h-40">
          {/* Outer Ring - Slow clockwise */}
          <div className="absolute inset-0 border-2 border-indigo-200 rounded-full opacity-50 animate-ping"></div>
          {/* Second Ring - Medium counter-clockwise */}
          <div className="absolute inset-8 border-2 border-indigo-300 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute inset-8 border-2 border-indigo-300 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute inset-8 border-2 border-indigo-300 rounded-full opacity-60 animate-ping"></div>
          {/* Third Ring - Fast clockwise */}
          <div
            className="absolute inset-16 border-2 border-indigo-400 rounded-full opacity-70 animate-ping"
            style={{ animationDuration: "6s" }}
          ></div>
          {/* Inner Ring - Very slow counter-clockwise */}
          <div
            className="absolute inset-24 border-2 border-indigo-500 rounded-full opacity-50 animate-ping"
            style={{ animationDuration: "15s" }}
          ></div>
        </div>
      </div>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-25 animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-200 rounded-full blur-3xl opacity-20 animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-50 rounded-full blur-3xl opacity-30 animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with subtle glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
          <img
            src="/assets/images/horizontal-logo.png"
            alt="Cleercut Logo"
            className="relative w-52 h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }

        @keyframes bounce-dot {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-14px) scale(1.1);
            opacity: 1;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-bounce-dot {
          animation: bounce-dot 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default FullPageLoader;
