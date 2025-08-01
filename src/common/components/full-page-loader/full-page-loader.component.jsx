function FullPageLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Animated ring container */}
        <div className="relative  animate-pulse">
          {/* Spinning border */}

          {/* Logo with fade animation */}
          <img
            src="/assets/images/horizontal-logo.png"
            alt="Logo"
            className="w-[240px] h-[80px] mb-2 animate-pulse"
          />
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default FullPageLoader;
