import { Close, Menu } from "@mui/icons-material";
import useHeader from "./use-header";
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

function Header() {
  const {
    router,
    scrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    showDropdown,
    setShowDropdown,
    notifications,
  } = useHeader();

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/assets/images/horizontal-logo.png" alt="logo" width={120} height={120} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            prefetch={true}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            Home
          </Link>
          <Link
            href="/#features"
            prefetch={true}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            Features
          </Link>
          <Link
            href="/solution"
            prefetch={true}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            Solutions
          </Link>
          <Link
            href="/pricing"
            prefetch={true}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            Pricing
          </Link>
          <Link
            href="/about-us"
            prefetch={true}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            About
          </Link>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-gray-200 p-2 rounded-full cursor-pointer"
          >
            <Bell size={20} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            {mobileMenuOpen ? <Close className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Quick Dropdown Preview */}
      {showDropdown && (
        <div className="absolute top-12 right-10 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-2 px-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">Recent Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications["brand"].map((notification) => (
              <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{notification.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{notification.title}</p>
                    <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            Home
          </Link>
          <Link
            href="#features"
            className="text-gray-600 hover:text-indigo-600 font-medium transition text-left cursor-pointer"
          >
            Features
          </Link>
          <p
            onClick={() => router.push("/solution")}
            className="text-gray-600 hover:text-indigo-600 font-medium transition text-left cursor-pointer"
          >
            Solutions
          </p>
          <p
            onClick={() => router.push("/pricing")}
            className="text-gray-600 hover:text-indigo-600 font-medium transition text-left cursor-pointer"
          >
            Pricing
          </p>
          <p
            onClick={() => router.push("/about-us")}
            className="text-gray-600 hover:text-indigo-600 font-medium transition text-left cursor-pointer"
          >
            About
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Header;
