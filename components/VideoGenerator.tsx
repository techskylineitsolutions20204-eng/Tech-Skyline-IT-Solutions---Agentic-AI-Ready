
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt) return;

    // MANDATORY API KEY CHECK
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }

    setIsGenerating(true);
    setProgress(5);
    setVideoUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `High quality cinematic visualization of: ${prompt}. Professional corporate tech aesthetic, 4k.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        setProgress(p => Math.min(p + 10, 95));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio?.openSelectKey();
      }
      console.error(err);
      alert('Video generation failed. Ensure your API Key has Veo access.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tech Concept Visualizer</h1>
        <p className="text-slate-500 mb-8">
          Generate cinematic visualizers for your learning concepts. Powered by Veo 3.1.
        </p>

        <div className="space-y-4">
          <textarea
            placeholder="Describe a technology scenario (e.g. 'A futuristic control center for global cloud infrastructure' or 'Digital twin of a smart factory using IoT')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  Rendering Concept... {progress}%
                </>
              ) : (
                <>
                  <i className="fas fa-sparkles"></i>
                  Generate Visualizer
                </>
              )}
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Billing Info
            </a>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-8 space-y-4 text-center">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Veo is carefully crafting each frame of your cinematic experience...
            </p>
          </div>
        )}

        {videoUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video border-4 border-white">
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">Prompt Tip</h4>
          <p className="text-sm text-blue-600 leading-relaxed">
            Be descriptive about lighting, style, and camera movement. 
            Example: "High-tech data center with glowing blue neon lines, slow cinematic dolly in, futuristic atmosphere."
          </p>
        </div>
        <div className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100">
          <h4 className="font-bold text-cyan-800 mb-2">Usage</h4>
          <p className="text-sm text-cyan-600 leading-relaxed">
            Videos are ideal for presentation decks, course introduction promos, or understanding complex architectural concepts visually.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
