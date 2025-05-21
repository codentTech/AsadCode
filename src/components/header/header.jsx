import { Close, Menu } from '@mui/icons-material';
import useHeader from './use-header';
import Image from 'next/image';

function Header() {
  const { router, scrolled, mobileMenuOpen, setMobileMenuOpen } = useHeader();
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <Image src="/assets/images/horizontal-logo.png" alt="logo" width={120} height={120} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <p
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            Features
          </p>
          <p className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer">
            Solutions
          </p>
          <p
            onClick={() => router.push('/pricing')}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            Pricing
          </p>
          <p
            onClick={() => {
              console.log('clicked');
              router.push('/about-us');
            }}
            className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            About
          </p>
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-4">
          <p className="text-gray-600 hover:text-indigo-600 font-medium transition text-left cursor-pointer">
            Features
          </p>
          <p className="text-gray-600 hover:text-indigo-600 font-medium transition text-left cursor-pointer">
            Solutions
          </p>
          <p
            onClick={() => router.push('/pricing')}
            className="text-gray-600 hover:text-indigo-600 font-medium transition text-left cursor-pointer"
          >
            Pricing
          </p>
          <p
            onClick={() => router.push('/about-us')}
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
