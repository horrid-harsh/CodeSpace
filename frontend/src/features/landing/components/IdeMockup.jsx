import {
  Atom,
  Bot,
  ChevronDown,
  Cloud,
  Container,
  Database,
  ExternalLink,
  FileCode2,
  FileCog,
  FileJson,
  FileText,
  FileType,
  Files,
  Folder,
  Globe,
  Lock,
  RefreshCw,
  SendHorizontal,
  Settings,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useState, useRef } from "react";

function IdeTopBar() {
  return (
    <div className="bg-neutral-900/70 border-b border-white/10 flex px-4 py-2.5 items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#9f9f9f]/80" />
        <span className="w-3 h-3 rounded-full bg-[#b4b4b4]/80" />
        <span className="w-3 h-3 rounded-full bg-[#9d9d9d]/80" />
      </div>
      <div className="rounded-md bg-neutral-800 border border-white/10 flex ml-auto sm:ml-3 px-2 sm:px-3 py-1 items-center gap-1.5 sm:gap-2 min-w-0 flex-1 max-w-[160px] sm:max-w-none">
        <Lock className="w-3 h-3 text-[#a1a1a1] flex-shrink-0" />
        <span className="text-[#a1a1a1] text-xs leading-4 truncate">
          acme-dashboard.preview.localhost
        </span>
      </div>
      <div className="flex ml-auto items-center gap-2 flex-shrink-0">
        <Cloud className="w-4 h-4 text-[#a1a1a1] hidden sm:block" />
        <Settings className="w-4 h-4 text-[#a1a1a1]" />
      </div>
    </div>
  );
}

function IdeExplorer({ className = "" }) {
  return (
    <div className={`bg-neutral-900/40 border-white/10 flex flex-col ${className}`}>
      <div className="border-b border-white/10 flex px-3 py-2 items-center gap-2">
        <Files className="w-3.5 h-3.5 text-[#a1a1a1]" />
        <span className="font-medium uppercase text-[#a1a1a1] text-[10px] tracking-widest">
          Explorer
        </span>
      </div>
      <div className="flex p-2 flex-col flex-1 gap-0.5 overflow-hidden">
        <div className="rounded-md text-neutral-50 text-xs leading-4 flex px-2 py-1 items-center gap-2">
          <ChevronDown className="w-3 h-3 text-[#a1a1a1]" />
          <Folder className="w-3.5 h-3.5 text-[#9d9d9d]" />
          public
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex ml-4 px-2 py-1 items-center gap-2">
          <FileCode2 className="w-3.5 h-3.5" />
          favicon.svg
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex ml-4 px-2 py-1 items-center gap-2">
          <FileCode2 className="w-3.5 h-3.5" />
          icons.svg
        </div>
        <div className="rounded-md text-neutral-50 text-xs leading-4 flex px-2 py-1 items-center gap-2">
          <ChevronDown className="w-3 h-3 text-[#a1a1a1]" />
          <Folder className="w-3.5 h-3.5 text-[#9d9d9d]" />
          src
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex ml-4 px-2 py-1 items-center gap-2">
          <Folder className="w-3.5 h-3.5" />
          assets
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex ml-4 px-2 py-1 items-center gap-2">
          <FileType className="w-3.5 h-3.5" />
          App.css
        </div>
        <div className="rounded-md bg-neutral-800 text-neutral-50 text-xs leading-4 flex ml-4 px-2 py-1 items-center gap-2">
          <FileCode2 className="w-3.5 h-3.5 text-[#9d9d9d]" />
          App.jsx
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex ml-4 px-2 py-1 items-center gap-2">
          <FileType className="w-3.5 h-3.5" />
          index.css
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex ml-4 px-2 py-1 items-center gap-2">
          <FileCode2 className="w-3.5 h-3.5" />
          main.jsx
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex px-2 py-1 items-center gap-2">
          <FileCog className="w-3.5 h-3.5" />
          .dockerignore
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex px-2 py-1 items-center gap-2">
          <Container className="w-3.5 h-3.5" />
          dockerfile
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex px-2 py-1 items-center gap-2">
          <FileCode2 className="w-3.5 h-3.5" />
          index.html
        </div>
        <div className="rounded-md text-[#a1a1a1] text-xs leading-4 flex px-2 py-1 items-center gap-2">
          <FileJson className="w-3.5 h-3.5" />
          package.json
        </div>
      </div>
      <div className="border-t border-white/10 p-3 mt-auto">
        <div className="text-[#a1a1a1] text-[10px] flex items-center gap-2">
          <Database className="w-3 h-3 text-[#9d9d9d]" />
          AWS S3 connected
        </div>
      </div>
    </div>
  );
}

function IdePreview({ className = "" }) {
  return (
    <div className={`bg-neutral-950 border-white/10 flex flex-col ${className}`}>
      <div className="bg-neutral-900/50 border-b border-white/10 flex px-3 py-2 items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9f9f9f]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#b4b4b4]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#9d9d9d]/80" />
        </div>
        <div className="rounded-md bg-neutral-800 border border-white/10 flex px-2 sm:px-3 py-1 items-center flex-1 gap-1.5 sm:gap-2 min-w-0">
          <Globe className="w-3 h-3 text-[#a1a1a1] flex-shrink-0" />
          <span className="text-[#a1a1a1] text-[11px] leading-4 truncate">
            localhost:5173
          </span>
        </div>
        <RefreshCw className="w-3.5 h-3.5 text-[#a1a1a1]" />
        <ExternalLink className="w-3.5 h-3.5 text-[#a1a1a1]" />
      </div>
      <div className="relative flex flex-col justify-center items-center flex-1 overflow-hidden p-6">
        <div className="relative w-14 h-14 rounded-2xl bg-neutral-800 border border-white/10 flex justify-center items-center">
          <Atom className="w-7 h-7 text-[#b4b4b4]" />
        </div>
        <span className="relative font-semibold text-xl leading-7 tracking-tight mt-5">
          Get started
        </span>
        <span className="relative max-w-[250px] text-center text-[#a1a1a1] text-xs leading-5 mt-2">
          Edit
          <span className="font-mono text-neutral-200 mx-1">
            src/App.jsx
          </span>
          and save to test HMR
        </span>
        <div className="relative flex mt-5 items-center gap-3">
          <span className="rounded-full bg-neutral-800 text-[#a1a1a1] text-[10px] border border-white/10 px-3 py-1">
            Vite
          </span>
          <span className="rounded-full bg-neutral-800 text-[#a1a1a1] text-[10px] border border-white/10 px-3 py-1">
            React
          </span>
        </div>
      </div>
    </div>
  );
}

function IdeAgent({ className = "" }) {
  return (
    <div className={`bg-neutral-900/40 flex flex-col border-white/10 ${className}`}>
      <div className="border-b border-white/10 flex px-4 py-2 items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#9d9d9d]" />
        <span className="font-medium text-xs leading-4">
          Codespace Agent
        </span>
      </div>
      <div className="text-center flex p-4 flex-col justify-center items-center flex-1 gap-3 overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-white/10 flex justify-center items-center">
          <Bot className="w-6 h-6 text-[#9d9d9d]" />
        </div>
        <span className="font-medium text-sm leading-5">
          I'm ready to code.
        </span>
        <span className="text-[#a1a1a1] text-xs leading-5">
          What are we building today?
        </span>
      </div>
      <div className="border-t border-white/10 p-3 mt-auto">
        <div className="rounded-lg bg-neutral-950 border border-white/10 flex px-3 py-2 items-center gap-2">
          <span className="text-[#a1a1a1] text-[11px] flex-1 text-left truncate">
            Tell AI what to build...
          </span>
          <div className="w-6 h-6 rounded-md bg-neutral-200 flex justify-center items-center flex-shrink-0">
            <SendHorizontal className="w-3.5 h-3.5 text-neutral-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IdeTerminal({ className = "" }) {
  return (
    <div className={`bg-neutral-900/70 border-white/10 flex flex-col ${className}`}>
      <div className="border-b border-white/10 flex px-4 py-2 items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-[#9d9d9d]" />
        <span className="font-medium text-[11px] leading-4">
          Terminal
        </span>
        <span className="rounded-full bg-neutral-800 text-[#a1a1a1] text-[10px] border border-white/10 flex ml-auto px-2 py-0.5 items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b4b4b4]" />
          Connected
        </span>
      </div>
      <div className="font-mono text-[11px] leading-5 flex px-4 py-3 flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-[#9d9d9d]">~/workspace</span>
          <span className="text-[#606060]">$</span>
          <span className="text-neutral-50">ls</span>
        </div>
        <div className="text-[#a1a1a1] mt-1 flex flex-wrap gap-x-2 gap-y-1">
          <span>README.md</span>
          <span>dockerfile</span>
          <span>eslint.config.js</span>
          <span>index.html</span>
          <span>package.json</span>
          <span>public</span>
          <span>src</span>
          <span>vite.config.js</span>
          <span>package-lock.json</span>
        </div>
        <div className="flex mt-1 items-center gap-2">
          <span className="text-[#9d9d9d]">~/workspace</span>
          <span className="text-[#606060]">$</span>
          <span className="text-neutral-50">npm run dev</span>
        </div>
        <div className="text-[#a1a1a1] mt-1">
          VITE v5.4.0 ready in 612 ms
        </div>
        <div className="text-[#a1a1a1]">
          Local: http://localhost:5173/
        </div>
        <div className="flex mt-1 items-center gap-2">
          <span className="text-[#9d9d9d]">~/workspace</span>
          <span className="text-[#606060]">$</span>
          <span className="inline-block bg-neutral-200 w-1.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

function AnimatedBorder() {
  return (
    <>
      {/* Glowing Bloom Layer */}
      <div 
        className="absolute inset-[-4px] rounded-[20px] pointer-events-none blur-[6px] z-20 overflow-hidden" 
        style={{
          padding: '8px',
          background: 'transparent',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      >
        <div 
          className="absolute top-1/2 left-1/2 animate-spin will-change-transform" 
          style={{
            width: '2500px',
            height: '2500px',
            marginLeft: '-1250px',
            marginTop: '-1250px',
            animationDuration: '14s',
            animationTimingFunction: 'linear',
            background: 'conic-gradient(from 0deg, transparent 0 330deg, rgba(255,255,255,0.1) 350deg, rgba(255,255,255,0.5) 360deg)'
          }} 
        />
      </div>

      {/* Sharp Trail Layer */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none z-20 overflow-hidden" 
        style={{
          padding: '1px',
          background: 'transparent',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      >
        <div 
          className="absolute top-1/2 left-1/2 animate-spin will-change-transform" 
          style={{
            width: '2500px',
            height: '2500px',
            marginLeft: '-1250px',
            marginTop: '-1250px',
            animationDuration: '14s',
            animationTimingFunction: 'linear',
            background: 'conic-gradient(from 0deg, transparent 0 340deg, rgba(255,255,255,0.1) 355deg, rgba(255,255,255,0.3) 358deg, rgba(255,255,255,1) 359deg, rgba(255,255,255,1) 360deg)'
          }} 
        />
      </div>
    </>
  );
}

function IdeDesktopLayout() {
  return (
    <div className="hidden md:block relative z-10 mt-16 w-full max-w-7xl mx-auto select-none px-12 pb-16">
      <div className="relative shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] rounded-2xl">
        <AnimatedBorder />
        <div className="backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden relative z-10">
          <IdeTopBar />
          <div className="flex flex-col">
            <div className="grid grid-cols-12 h-[30rem]">
              <IdeExplorer className="col-span-3 border-r" />
              <IdePreview className="col-span-6 border-r" />
              <IdeAgent className="col-span-3" />
            </div>
            <IdeTerminal className="border-t h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IdeMobileCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  const slides = [
    {
      id: 0,
      title: "Live Preview",
      description: "See your code changes instantly via integrated hot module replacement.",
      component: <IdePreview className="h-[26rem] flex-1" />
    },
    {
      id: 1,
      title: "File Explorer",
      description: "Instantly access a complete cloud file system directly in your browser.",
      component: <IdeExplorer className="h-[26rem] flex-1" />
    },
    {
      id: 2,
      title: "AI Agent",
      description: "An integrated AI assistant ready to help you write and debug code.",
      component: <IdeAgent className="h-[26rem] flex-1" />
    },
    {
      id: 3,
      title: "Terminal",
      description: "Full root access to powerful cloud compute environments.",
      component: <IdeTerminal className="h-[26rem] flex-1" />
    }
  ];

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const slideWidth = scrollContainerRef.current.clientWidth;
    // Calculate the most visible slide
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== activeSlide && newIndex >= 0 && newIndex < slides.length) {
      setActiveSlide(newIndex);
    }
  };

  return (
    <div className="block md:hidden w-full mt-10 pb-16 select-none">
      <div className="px-6 mb-8 text-center flex flex-col items-center">
        <div className="inline-flex backdrop-blur-md rounded-full bg-neutral-900/50 border border-white/10 mb-4 px-3 py-1 items-center gap-2">
          <span className="size-2 rounded-full bg-[#9d9d9d] flex" />
          <span className="text-[#a1a1a1] text-[11px] font-medium tracking-wide">
            Product Showcase
          </span>
        </div>
        <h3 className="text-3xl font-semibold tracking-tight text-white mb-2 transition-all">
          {slides[activeSlide].title}
        </h3>
        <p className="text-[#a1a1a1] text-[15px] leading-relaxed transition-all max-w-[280px]">
          {slides[activeSlide].description}
        </p>
      </div>

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex overflow-x-auto snap-x snap-mandatory px-6 gap-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full w-full max-w-full snap-center flex-shrink-0">
            <div className="relative shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] rounded-2xl">
              <AnimatedBorder />
              <div className="backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col w-full relative z-10">
                <IdeTopBar />
                {slide.component}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => {
              if (scrollContainerRef.current) {
                const slideWidth = scrollContainerRef.current.clientWidth;
                scrollContainerRef.current.scrollTo({
                  left: slideWidth * i,
                  behavior: 'smooth'
                });
              }
            }}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === activeSlide ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/20'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function IdeMockup() {
  return (
    <>
      <IdeDesktopLayout />
      <IdeMobileCarousel />
    </>
  );
}
