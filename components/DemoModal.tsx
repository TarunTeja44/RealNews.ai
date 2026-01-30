
import React, { useState } from 'react';
import { generateDemoVideo } from '../services/video';

interface DemoModalProps {
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ onClose }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fallback video for local mode (Simulated result)
  const LOCAL_FALLBACK_VIDEO = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"; // Placeholder accessible video

  const startGeneration = async () => {
    setLoading(true);
    setError(null);
    setStatus("Initializing Veo 3.1...");
    
    try {
      // Try actual generation first
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (hasKey) {
        const url = await generateDemoVideo(setStatus);
        setVideoUrl(url);
      } else {
        // Simulation Mode for Local Run
        const steps = [
          "Local Mode: Veo Engine Unavailable",
          "Simulating Video Generation...",
          "Rendering UI Components...",
          "Applying Visual Effects...",
          "Finalizing Demo..."
        ];
        
        for (const step of steps) {
          setStatus(step);
          await new Promise(r => setTimeout(r, 1000));
        }
        setVideoUrl(LOCAL_FALLBACK_VIDEO);
      }
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        // Even if key selection fails, fall back to simulation for local user
        setStatus("Falling back to simulation...");
        await new Promise(r => setTimeout(r, 1000));
        setVideoUrl(LOCAL_FALLBACK_VIDEO);
      } else {
        setError(err.message || "Failed to generate demo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-black hover:text-white transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="p-6 sm:p-12 space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">AI Demo Generator</h2>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Experience Truth Weaver through a custom Veo 3.1 video.</p>
          </div>

          {!videoUrl && !loading && !error && (
            <div className="py-12 sm:py-20 text-center space-y-8">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl mx-auto flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-4">
                <p className="text-slate-600 font-medium max-w-sm mx-auto text-sm sm:text-base">
                  This generates a product demo. If no API key is detected, a simulation will run locally.
                </p>
                <button 
                  onClick={startGeneration}
                  className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all w-full sm:w-auto"
                >
                  Generate Video Demo
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="py-24 sm:py-32 text-center space-y-8">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-black text-slate-900 animate-pulse">{status}</p>
                <p className="text-xs text-slate-400 font-medium italic">Processing...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="py-20 text-center space-y-6">
              <div className="text-red-500 font-black text-sm uppercase tracking-widest">{error}</div>
              <button 
                onClick={startGeneration}
                className="bg-slate-100 text-slate-900 px-8 py-3 rounded-xl font-bold text-xs"
              >
                Try Again
              </button>
            </div>
          )}

          {videoUrl && (
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-black aspect-video shadow-2xl relative">
               <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                  {videoUrl === LOCAL_FALLBACK_VIDEO ? "Simulated Output" : "Veo Generated"}
               </div>
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
