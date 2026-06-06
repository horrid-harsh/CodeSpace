import React, { useState } from 'react';
import logo from "../../../assets/images/logo-name-v3.png";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export function Footer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <footer className="relative w-full flex flex-col pt-20 mt-20 select-none">
      
      {/* Top Section with Wordmark */}
      <div 
        className="w-full relative overflow-hidden h-[14vw]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Base dark wordmark */}
        <div className="absolute inset-0 flex justify-center items-end">
          <img 
            src={logo} 
            alt="Codespace" 
            className="w-[80vw] max-w-5xl opacity-[0.02] select-none pointer-events-none translate-y-[8%]" 
          />
        </div>
        
        {/* Interactive spotlight overlay */}
        <div 
          className="absolute inset-0 flex justify-center items-end pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            WebkitMaskImage: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            maskImage: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat'
          }}
        >
          <img 
            src={logo} 
            alt="Codespace" 
            className="w-[80vw] max-w-5xl opacity-[0.15] select-none pointer-events-none translate-y-[8%]" 
          />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-white/[0.04] relative z-10" />

      {/* Bottom Section */}
      <div className="w-full relative z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-24 md:pb-32 flex flex-col xl:flex-row justify-between gap-16 xl:gap-0">
          
          {/* Left Column */}
          <div className="flex flex-col justify-between max-w-xs">
            <div className="flex flex-col gap-8 md:gap-10">
              <p className="text-[#888] text-[13px] leading-relaxed">
                2261 Market Street #5039<br/>
                San Francisco, CA 94114
              </p>
              
              <div className="flex gap-4">
                <a href="#" className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-[#888] hover:text-white hover:bg-white/5 transition-all">
                  <XIcon />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-[#888] hover:text-white hover:bg-white/5 transition-all">
                  <GithubIcon />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-[#888] hover:text-white hover:bg-white/5 transition-all">
                  <LinkedinIcon />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-[#888] hover:text-white hover:bg-white/5 transition-all">
                  <YoutubeIcon />
                </a>
              </div>
              

            </div>
          </div>

          {/* Right Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-y-12 gap-x-8 lg:gap-16 xl:gap-24 xl:pr-12 w-full xl:w-auto">
            
            {/* Features */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-[13px] font-medium mb-1">Features</h3>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Workspaces</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Sandboxes</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Terminal</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Live Preview</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">AI Assistant</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Collaboration</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Deployments</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Custom Domains</a>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-[13px] font-medium mb-1">Resources</h3>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Changelog</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Security</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Compliance</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Integrations</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Brand</a>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-[13px] font-medium mb-1">Company</h3>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">About</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Customers</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Partners</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Philosophy</a>
            </div>

            {/* Help */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-[13px] font-medium mb-1">Help</h3>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Support</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Status</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Migrate</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Knowledge base</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Legal policies</a>
            </div>

            {/* Community */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-[13px] font-medium mb-1">Community</h3>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Events</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Discord</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Open source</a>
              <a href="#" className="text-[#888] text-[13px] hover:text-white transition-colors">Templates</a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
