function FullPageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center relative overflow-hidden">
      <div className="flex gap-2 items-center text-center relative z-10">
        {/* Enhanced spinning rings around logo */}
        <div className="relative mb-8">
          {/* Enhanced logo container */}
          <img
            src="/assets/images/horizontal-logo.png"
            alt="Logo"
            className="w-[200px] h-[87px] object-contain relative z-10 drop-shadow-sm"
          />
        </div>

        {/* Premium loading animation */}
        <div className="flex justify-center items-center space-x-3 mb-7">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="relative">
              <div
                className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-lg"
                style={{
                  animationDelay: `${index * 0.12}s`,
                  animationDuration: "1.2s",
                }}
              ></div>
              <div
                className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 rounded-full animate-ping opacity-40"
                style={{
                  animationDelay: `${index * 0.12}s`,
                  animationDuration: "2s",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Enhanced progress bar */}
        {/* <div className="w-80 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 rounded-full animate-pulse transform origin-left shadow-sm">
              <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 animate-pulse opacity-80"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
            <span className="animate-pulse">Initializing systems...</span>
            <span className="animate-pulse text-blue-600">●●●</span>
          </div>
        </div> */}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(90deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          75% {
            transform: translateY(-10px) rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
}

export default FullPageLoader;
