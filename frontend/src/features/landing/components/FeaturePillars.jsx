import { Box, Boxes, Database, Eye, LayoutDashboard, Sparkles, Zap } from "lucide-react";

export function FeaturePillars() {
  return (
    <div className="relative z-10 px-6 md:px-12 pb-12 mt-16 md:mt-20 select-none">
      <div className="text-center flex mb-10 flex-col items-center">
        <span className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
          The platform
        </span>
        <h2 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent font-semibold text-3xl leading-9 tracking-tight mt-3">
          Four pillars of the workspace
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto">
        {/* Instant Cloud Sandboxes */}
        <div className="col-span-1 md:col-span-12 relative bg-gradient-to-br from-card to-background rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
            <div className="max-w-md w-full">
              <div className="w-11 h-11 rounded-xl bg-neutral-800 border border-white/10 flex mb-4 justify-center items-center">
                <Boxes className="w-5 h-5 text-[#9d9d9d]" />
              </div>
              <h3 className="font-semibold text-2xl leading-8 tracking-tight">
                Instant Cloud Sandboxes
              </h3>
              <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5 mt-2 select-text">
                Provision isolated environments and connect to AWS S3 in
                seconds with a single click.
              </p>
            </div>
            <div className="flex flex-row items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="backdrop-blur-md text-center rounded-xl bg-neutral-900/60 border border-white/10 px-5 py-4 flex-1 md:flex-none">
                <Zap className="w-5 h-5 text-[#b4b4b4] mx-auto" />
                <span className="block font-semibold text-lg leading-7 mt-2">1-click</span>
                <span className="text-[#a1a1a1] text-[10px]">provisioning</span>
              </div>
              <div className="backdrop-blur-md text-center rounded-xl bg-neutral-900/60 border border-white/10 px-5 py-4 flex-1 md:flex-none">
                <Database className="w-5 h-5 text-[#9d9d9d] mx-auto" />
                <span className="block font-semibold text-lg leading-7 mt-2">S3</span>
                <span className="text-[#a1a1a1] text-[10px]">auto-connect</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Code Generation */}
        <div className="col-span-1 md:col-span-7 relative bg-gradient-to-br from-card to-background rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-neutral-800 border border-white/10 flex mb-4 justify-center items-center">
              <Sparkles className="w-5 h-5 text-[#888888]" />
            </div>
            <h3 className="font-semibold text-2xl leading-8 tracking-tight">
              AI Code Generation
            </h3>
            <p className="max-w-sm leading-relaxed text-[#a1a1a1] text-sm leading-5 mt-2 select-text">
              Write, refactor, and debug code instantly with a native AI assistant.
            </p>
            <div className="backdrop-blur-md font-mono rounded-lg bg-neutral-950/70 text-[11px] border border-white/10 mt-5 p-3 select-text">
              <span className="text-[#606060]">// ai: refactor to async</span>
              <div className="text-neutral-50">const data = await fetchProjects()</div>
            </div>
          </div>
        </div>

        {/* Real-Time Live Previews */}
        <div className="col-span-1 md:col-span-5 relative bg-gradient-to-br from-card to-background rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-neutral-800 border border-white/10 flex mb-4 justify-center items-center">
              <Eye className="w-5 h-5 text-[#9d9d9d]" />
            </div>
            <h3 className="font-semibold text-2xl leading-8 tracking-tight">
              Real-Time Live Previews
            </h3>
            <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5 mt-2 select-text">
              Instantly generated preview URLs to see your code changes live as you type.
            </p>
            <div className="inline-flex rounded-full bg-neutral-800 border border-white/10 mt-5 px-3 py-1.5 items-center gap-2 select-text">
              <span className="w-2 h-2 rounded-full bg-[#a1a1a1] flex" />
              <span className="font-mono text-[#a1a1a1] text-[10px]">live.preview.localhost</span>
            </div>
          </div>
        </div>

        {/* Project Dashboard */}
        <div className="col-span-1 md:col-span-12 relative bg-gradient-to-br from-card to-background rounded-2xl border border-white/10 p-6 md:p-8 overflow-hidden">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
            <div className="max-w-md w-full">
              <div className="w-11 h-11 rounded-xl bg-neutral-800 border border-white/10 flex mb-4 justify-center items-center">
                <LayoutDashboard className="w-5 h-5 text-[#b4b4b4]" />
              </div>
              <h3 className="font-semibold text-2xl leading-8 tracking-tight">
                Project Dashboard
              </h3>
              <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5 mt-2 select-text">
                Seamlessly manage, fetch, and organize all your active workspaces and projects.
              </p>
            </div>
            <div className="flex flex-row gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="backdrop-blur-md rounded-xl bg-neutral-900/60 border border-white/10 p-3 flex-1 min-w-[140px] md:w-40 md:flex-none">
                <div className="flex justify-between items-center">
                  <Box className="w-4 h-4 text-[#606060]" />
                  <span className="w-2 h-2 rounded-full bg-[#9d9d9d] flex" />
                </div>
                <span className="block font-medium text-sm leading-5 mt-2">acme-web</span>
                <span className="text-[#a1a1a1] text-[10px]">running · 3 envs</span>
              </div>
              <div className="backdrop-blur-md rounded-xl bg-neutral-900/60 border border-white/10 p-3 flex-1 min-w-[140px] md:w-40 md:flex-none">
                <div className="flex justify-between items-center">
                  <Box className="w-4 h-4 text-[#888888]" />
                  <span className="w-2 h-2 rounded-full bg-[#a1a1a1] flex" />
                </div>
                <span className="block font-medium text-sm leading-5 mt-2">api-gateway</span>
                <span className="text-[#a1a1a1] text-[10px]">idle · 1 env</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
