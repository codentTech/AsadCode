import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 pt-16 pb-10 shadow-inner border-t border-gray-200 text-center font-inter">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-left">
        {/* Logo & CTA */}
        <div className="flex flex-col items-center lg:items-start col-span-1">
          <img
            src="https://yourdemolink.net/social/wp-content/uploads/2025/04/IMG_2972.png"
            alt="Your Logo"
            className="h-[90px] mb-4"
          />
          <p className="mb-4 text-sm text-gray-600">
            Join our exclusive community and stay ahead with updates.
          </p>
          <a
            href="#"
            className="inline-block mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transform transition"
          >
            Get Started
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold uppercase text-gray-800 mb-3">
            Company
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold uppercase text-gray-800 mb-3">
            Resources
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Case Studies
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold uppercase text-gray-800 mb-3">
            Legal
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="text-center lg:text-left">
          <h3 className="text-base font-semibold uppercase text-gray-800 mb-3">
            Connect With Us
          </h3>
          <ul className="flex justify-center lg:justify-start gap-6 mt-2">
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 text-xl transition"
              >
                <i className="fa fa-facebook"></i>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 text-xl transition"
              >
                <i className="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 text-xl transition"
              >
                <i className="fa fa-instagram"></i>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 text-xl transition"
              >
                <i className="fa fa-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500 font-medium">
        <p>
          &copy; 2025 YourBrand. All Rights Reserved. |{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 transition">
            Sitemap
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
