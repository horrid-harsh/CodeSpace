import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../workspace/hooks/useWorkspace.js';
import { Navbar } from '../components/Navbar.jsx';
import { Hero } from '../components/Hero.jsx';
import { IdeMockup } from '../components/IdeMockup.jsx';
import { FeaturePillars } from '../components/FeaturePillars.jsx';
import { Footer } from '../components/Footer.jsx';

export default function LandingPage() {
  const { handleStartSandbox, sandboxId, isLoading, error } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (sandboxId) {
      navigate('/workspace');
    }
  }, [sandboxId, navigate]);

  return (
    <div className="relative bg-neutral-950 text-neutral-50 w-full min-h-screen overflow-x-hidden pt-24">
      <div className="bg-[linear-gradient(oklch(1_0_0/.04)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/.04)_1px,transparent_1px)] pointer-events-none absolute inset-0" />
      
      <Navbar onStartSandbox={handleStartSandbox} isLoading={isLoading} />
      <Hero onStartSandbox={handleStartSandbox} isLoading={isLoading} />
      <IdeMockup />
      <FeaturePillars />
      
      {error && (
        <div className="relative z-10 flex justify-center mt-4 px-12 pb-10">
          <p className="text-red-400 text-sm bg-neutral-900/50 backdrop-blur-md px-4 py-2 rounded-lg border border-red-500/20">
            Failed to start sandbox: {error.message || "Unknown error"}
          </p>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
