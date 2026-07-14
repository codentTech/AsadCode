import useHero from "@/components/landing-page/components/hero/use-hero";
import useLegalLinks from "@/common/hooks/use-legal-links.hook";

export default function useFooter() {
  const { isOpen, setIsOpen, closeModal } = useHero();
  const { termsHref, privacyHref, cookieHref } = useLegalLinks();
  const currentYear = new Date().getFullYear();

  return {
    isOpen,
    setIsOpen,
    closeModal,
    termsHref,
    privacyHref,
    cookieHref,
    currentYear,
  };
}
