
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { createAudioBlob, decode, decodeAudioData } from '../services/liveApiService';

const LiveAudioMentor: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('Standby');

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  const stopConversation = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {
        console.debug('Error closing session', e);
      }
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setStatus('Disconnected');
  }, []);

  const startConversation = async () => {
    // MANDATORY API KEY CHECK
    const aistudio = (window as any).aistudio;
    if (aistudio && !(await aistudio.hasSelectedApiKey())) {
      await aistudio.openSelectKey();
    }

    setIsConnecting(true);
    setStatus('Initializing AI...');

    try {
      // Create a fresh instance for the latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            setStatus('Mentor Listening...');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createAudioBlob(inputData);
              sessionPromise.then((session) => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              }).catch(err => {
                console.error('Failed to send audio input', err);
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const outputCtx = outputAudioContextRef.current;
              if (!outputCtx) return;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: async (e: any) => {
            console.error('Live API Error callback:', e);
            const errMsg = e?.message || '';
            if (errMsg.includes("Requested entity was not found")) {
              setStatus('Key Error - Re-selecting...');
              if (aistudio) await aistudio.openSelectKey();
            } else {
              setStatus('Connection Error');
            }
            stopConversation();
          },
          onclose: () => {
            console.debug('Live session closed');
            stopConversation();
          }
        },
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are an Elite Industry Mentor from Tech Skyline IT Solutions. Help learners with their technical roadmaps, career strategy, and coding doubts. Be professional, encouraging, and brief. Use industry-standard terminology.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Failed to start conversation:', err);
      setIsConnecting(false);
      
      const errMsg = err?.message || '';
      if (errMsg.includes("Requested entity was not found")) {
        setStatus('Invalid Project/Key');
        if (aistudio) await aistudio.openSelectKey();
      } else {
        setStatus('Network Failure');
      }
      stopConversation();
    }
  };

  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, [stopConversation]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col items-center p-12 text-center">
        <div className="mb-8 relative">
          <div className={`w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl transition-all duration-500 ${isSpeaking ? 'scale-110 shadow-blue-400/50' : ''}`}>
            <i className="fas fa-microphone-lines text-4xl text-white"></i>
          </div>
          {isSpeaking && (
            <>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-400 animate-ping opacity-25"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-400 animate-ping opacity-10 [animation-delay:0.5s]"></div>
            </>
          )}
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight tracking-tight">Live Industry Mentor</h1>
        <p className="text-slate-500 max-w-lg mb-8 text-lg">
          Speak naturally to our AI Mentor. Powered by Gemini 2.5 Native Audio for real-time career and technical guidance.
        </p>

        <div className="flex items-center gap-3 mb-10 bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : isConnecting ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'}`}></div>
          <span className="text-sm font-black text-slate-600 uppercase tracking-[0.2em]">{status}</span>
        </div>

        {!isConnected ? (
          <button
            onClick={startConversation}
            disabled={isConnecting}
            className="group relative bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 px-14 rounded-[2rem] shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center gap-4 text-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isConnecting ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-headset"></i>}
            {isConnecting ? 'Connecting...' : 'Initialize Mentor'}
          </button>
        ) : (
          <button
            onClick={stopConversation}
            className="bg-slate-900 hover:bg-red-600 text-white font-black py-5 px-14 rounded-[2rem] shadow-2xl transition-all flex items-center gap-4 text-xl"
          >
            <i className="fas fa-phone-slash"></i>
            Terminate Session
          </button>
        )}

        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Roadmap Strategy</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">"I want to become a Cloud Architect. Where should I start?"</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Mock Interviews</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">"Can you interview me for a Senior Python Developer position?"</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Lab Support</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">"Help me understand the Murex architectural sandbox."</p>
          </div>
        </div>
        
        <p className="mt-8 text-xs text-slate-400 font-medium">
          Requires a microphone and an active Gemini-enabled API key from a paid GCP project.
        </p>
      </div>
    </div>
  );
};

export default LiveAudioMentor;
