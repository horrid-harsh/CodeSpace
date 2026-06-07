import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../../assets/images/logo-name-v3.png";

export function Navbar({ onLaunchWorkspace }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 10) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div 
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 pt-6 pb-4 select-none transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isAtTop ? "bg-transparent backdrop-blur-none" : "backdrop-blur-sm bg-[#050505]/60"
        }`}
      >
        {/* Subtle noise texture */}
        <div 
          className={`absolute inset-0 mix-blend-overlay pointer-events-none transition-opacity duration-300 ${
            isAtTop ? "opacity-0" : "opacity-[0.03]"
          }`}
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        
        <nav className="relative z-10 flex justify-between items-center w-full max-w-7xl mx-auto">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="Codespace Logo" 
              className="h-6 w-auto cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button className="text-[#a1a1a1] px-4 py-2 hover:text-white rounded-md transition-colors text-sm font-medium cursor-pointer">
              Features
            </button>
            <button className="text-[#a1a1a1] px-4 py-2 hover:text-white rounded-md transition-colors text-sm font-medium cursor-pointer">
              Company
            </button>
            <button className="text-[#a1a1a1] px-4 py-2 hover:text-white rounded-md transition-colors text-sm font-medium cursor-pointer">
              Resources
            </button>
            <button className="text-[#a1a1a1] px-4 py-2 hover:text-white rounded-md transition-colors text-sm font-medium cursor-pointer">
              Help
            </button>
            <button className="text-[#a1a1a1] px-4 py-2 hover:text-white rounded-md transition-colors text-sm font-medium cursor-pointer">
              Docs
            </button>
            <button className="text-[#a1a1a1] px-4 py-2 hover:text-white rounded-md transition-colors text-sm font-medium cursor-pointer">
              Pricing
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => window.location.href = '/api/auth/google'}
              className="bg-transparent rounded-full text-[#a1a1a1] hover:text-white px-5 py-2 transition-colors text-sm font-medium cursor-pointer">
              Log in
            </button>
            <button 
              onClick={() => window.location.href = '/api/auth/google'}
              className="rounded-full bg-neutral-100 text-neutral-900 px-5 py-2 flex items-center gap-2 hover:bg-white transition-colors text-sm font-medium cursor-pointer"
            >
              Get started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button 
              className="text-[#a1a1a1] hover:text-white transition-colors cursor-pointer p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a] z-[60] flex flex-col transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 pt-6 pb-4 select-none border-b border-white/[0.04]">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="Codespace Logo" 
              className="h-6 w-auto cursor-pointer" 
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
          <button 
            className="text-[#a1a1a1] hover:text-white transition-colors cursor-pointer p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col px-6 mt-6 overflow-y-auto pb-12 select-none">
          <button 
            onClick={onLaunchWorkspace}
            className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-[14px] py-4 font-medium mb-3 flex justify-center items-center gap-2 transition-colors active:bg-white/[0.06]"
          >
            Launch Workspace
          </button>
          
          <button 
            onClick={() => window.location.href = '/api/auth/google'}
            className="w-full text-[#a1a1a1] hover:text-white font-medium py-4 mb-6 transition-colors"
          >
            Log in
          </button>

          <div className="flex flex-col">
            {['Features', 'Resources', 'Docs', 'Pricing'].map((item, index) => (
              <a 
                key={item} 
                href="#" 
                className={`flex justify-between items-center py-[18px] text-white font-medium text-[15px] ${
                  index !== 3 ? 'border-b border-white/[0.06]' : ''
                }`}
              >
                {item}
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
