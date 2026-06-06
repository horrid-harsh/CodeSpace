import { ArrowRight } from "lucide-react";

export function Hero({ onStartSandbox, isLoading }) {
  return (
    <div className="relative z-10 text-center flex px-6 md:px-12 pt-12 md:pt-16 pb-8 md:pb-10 flex-col items-center">
      <div className="inline-flex backdrop-blur-md rounded-full bg-neutral-900/50 border border-white/10 mb-6 px-4 py-1.5 items-center gap-2 select-none">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
          <span className="relative rounded-full size-2 bg-emerald-500" />
        </span>
        <span className="text-[#a1a1a1] text-[11px] md:text-xs leading-4 tracking-wide">
          AI-native cloud development, reimagined
        </span>
      </div>
      <h1 className="max-w-3xl bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent font-semibold text-4xl sm:text-5xl leading-tight sm:leading-[50px] tracking-tight px-2">
        The complete browser development platform.
      </h1>
      <p className="max-w-2xl leading-relaxed text-[#a1a1a1] text-[15px] sm:text-base mt-4 sm:mt-6 px-2">
        Launch secure cloud environments in milliseconds. Experience persistent file systems, real-time live previews, and integrated AI coding assistants without leaving your browser.
      </p>
      
      <div className="flex flex-col sm:flex-row mt-8 sm:mt-10 justify-center items-center gap-3 select-none w-full sm:w-auto">
        <button 
          onClick={() => window.location.href = '/api/auth/google'}
          className="w-full sm:w-auto rounded-full bg-neutral-200 text-neutral-900 px-6 py-3 sm:py-2.5 flex justify-center items-center gap-2 hover:bg-white transition-colors font-medium cursor-pointer"
        >
          Launch Workspace
          <ArrowRight className="size-4" />
        </button>
        <button 
          onClick={() => window.location.href = '/api/auth/google'}
          className="w-full sm:w-auto bg-transparent rounded-full text-neutral-50 border border-white/10 px-6 py-3 sm:py-2.5 hover:bg-white/5 transition-colors font-medium cursor-pointer"
        >
          Get Started
        </button>
      </div>

      <div className="flex flex-wrap mt-10 md:mt-12 justify-center items-center gap-6 md:gap-8 select-none">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-2xl md:text-2xl leading-8 tracking-tight text-neutral-50">~900ms</span>
          <span className="text-[#a1a1a1] text-xs leading-4">Spin-up time</span>
        </div>
        <div className="hidden sm:block bg-white/10 w-px h-8" />
        <div className="flex flex-col items-center">
          <span className="font-semibold text-2xl md:text-2xl leading-8 tracking-tight text-neutral-50">100%</span>
          <span className="text-[#a1a1a1] text-xs leading-4">Isolation</span>
        </div>
        <div className="hidden sm:block bg-white/10 w-px h-8" />
        <div className="flex flex-col items-center">
          <span className="font-semibold text-2xl md:text-2xl leading-8 tracking-tight text-neutral-50">Live</span>
          <span className="text-[#a1a1a1] text-xs leading-4">Preview URLs</span>
        </div>
      </div>
    </div>
  );
}
