import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import JoinCleerCut from "@/components/landing-page/components/join-cleercut/join-cleercut";
import { Instagram, LinkedIn } from "@mui/icons-material";
import Link from "next/link";
import useFooter from "./use-footer.hook";

const Footer = () => {
  const { isOpen, setIsOpen, closeModal, termsHref, privacyHref, cookieHref } = useFooter();

  return (
    <footer className="bg-white -indigo-200 py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex flex-col items-center lg:items-start col-span-1">
              <Link href="/">
                <img
                  src="/assets/images/horizontal-logo.png"
                  alt="Your Logo"
                  className="h-[90px]"
                />
              </Link>
              <p className="mb-4 text-sm text-gray-600">
                Email us at <span className="text-primary">partnerships@cleercut.com</span>
              </p>
              <CustomButton text="Get Started" onClick={() => setIsOpen(true)}></CustomButton>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about-us"
                    className="hover:text-primary text-sm text-gray-600 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-primary text-sm text-gray-600 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary text-sm text-gray-600 transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={termsHref}
                    className="hover:text-primary text-sm text-gray-600 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href={privacyHref}
                    className="hover:text-primary text-sm text-gray-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={cookieHref}
                    className="hover:text-primary text-sm text-gray-600 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-primary mt-8 pt-8 text-center md:text-left md:flex md:justify-between md:items-center">
          <p className="text-sm font-bold text-gray-600">© 2025 CleerCut. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-4">
            <Link
              href="https://www.linkedin.com/company/cleercut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-800 transition-colors"
            >
              <LinkedIn />
            </Link>
            <Link
              href="https://www.instagram.com/cleercut?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-800 transition-colors"
            >
              <Instagram />
            </Link>
          </div>
        </div>
      </div>

      <Modal title="Join CleerCut" show={isOpen} onClose={closeModal}>
        <JoinCleerCut closeModal={closeModal} />
      </Modal>
    </footer>
  );
};

export default Footer;
