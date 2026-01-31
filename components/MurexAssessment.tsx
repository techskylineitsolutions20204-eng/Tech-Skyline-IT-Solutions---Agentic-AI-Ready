
import React, { useState, useEffect, useRef } from 'react';
import { evaluateQuiz } from '../services/geminiService';

interface Question {
  id: number;
  type: 'mcq' | 'coding';
  category: 'OOP' | 'Data Structures' | 'Algorithms' | 'SQL' | 'Murex Technical';
  question: string;
  options?: string[];
  correctAnswer?: string;
  starterCode?: string;
}

const assessmentQuestions: Question[] = [
  {
    id: 1,
    category: 'Murex Technical',
    type: 'mcq',
    question: "In MX.3, which service is primarily responsible for real-time market data distribution to the pricing kernels?",
    options: ["DataMart", "MDCS (Market Data Control System)", "Trade Repository", "Workflow Engine"],
    correctAnswer: "MDCS (Market Data Control System)"
  },
  {
    id: 2,
    category: 'OOP',
    type: 'mcq',
    question: "Which OOP principle is best demonstrated by a Murex 'Product' class having different 'Price' implementations for FX Spot and IR Swaps?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    correctAnswer: "Polymorphism"
  },
  {
    id: 3,
    category: 'Data Structures',
    type: 'mcq',
    question: "What is the time complexity of looking up a Trade by its MX_ID in a well-balanced Hash Map?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(1)"
  },
  {
    id: 4,
    category: 'SQL',
    type: 'coding',
    question: "Write a SQL query to find the total notional per 'Book' for all trades booked in the last 24 hours.",
    starterCode: "-- Schema: trades (id, book, notional, timestamp)\nSELECT "
  },
  {
    id: 5,
    category: 'Algorithms',
    type: 'coding',
    question: "Implement a function to find the maximum PnL swing in an array of daily values (Maximum subarray sum).",
    starterCode: "def max_pnl_swing(values):\n    # Implement Kadane's Algorithm\n    pass"
  }
];

const MurexAssessment: React.FC = () => {
  const [view, setView] = useState<'intro' | 'testing' | 'result'>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ score: number; feedback: string } | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (view === 'testing' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleAutoSubmit();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, timeLeft]);

  const handleStart = () => {
    setView('testing');
    setTimeLeft(3600);
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);
    setView('result');

    // Aggregate answers for evaluation
    const summary = assessmentQuestions.map(q => {
      return `Q: ${q.question}\nCategory: ${q.category}\nStudent Answer: ${answers[q.id] || 'No Answer'}\nCorrect Answer Reference: ${q.correctAnswer || 'Open Ended Code'}`;
    }).join('\n\n');

    try {
      const evaluation = await evaluateQuiz("Murex Technical Assessment", summary);
      setAiFeedback(evaluation);
    } catch (err) {
      console.error(err);
      setAiFeedback({ score: 0, feedback: "Error evaluating assessment. Please check your connectivity." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (view === 'intro') {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
            <i className="fas fa-file-signature text-[15rem]"></i>
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Pre-Hiring Simulation
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Murex Online <br/><span className="text-blue-600">Technical Assessment</span></h1>
            
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl font-medium">
              This proctored-style simulation tests your readiness for a technical role in Murex consulting. Expect challenges in SQL, Data Structures, OOP, and Murex-specific lifecycle logic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Duration', val: '60 Minutes', icon: 'fa-clock' },
                { label: 'Questions', val: '15 items', icon: 'fa-list-check' },
                { label: 'Proctoring', val: 'AI Evaluated', icon: 'fa-shield-halved' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <i className={`fas ${stat.icon} text-blue-600 mb-3`}></i>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-lg font-black text-slate-800">{stat.val}</p>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <button 
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-12 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-sm flex items-center gap-3"
              >
                Start Assessment <i className="fas fa-arrow-right-long"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'testing') {
    const q = assessmentQuestions[currentQuestionIdx];
    return (
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)] animate-in fade-in duration-500">
        {/* Left Sidebar: Progress */}
        <aside className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col shadow-sm">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Remaining</span>
              <span className={`font-mono text-lg font-black ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${timeLeft < 300 ? 'bg-rose-500' : 'bg-blue-600'}`}
                style={{ width: `${(timeLeft / 3600) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Question Map</h3>
          <div className="grid grid-cols-5 gap-3 mb-8">
            {assessmentQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIdx(i)}
                className={`w-10 h-10 rounded-xl text-xs font-black flex items-center justify-center transition-all ${
                  currentQuestionIdx === i ? 'bg-blue-600 text-white shadow-lg' :
                  answers[assessmentQuestions[i].id] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-3">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                <i className="fas fa-circle-info mr-2"></i>
                Answers are auto-saved. You can go back to previous questions.
              </p>
            </div>
            <button 
              onClick={() => { if(confirm('Submit assessment now?')) handleSubmit(); }}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
            >
              Finish & Submit
            </button>
          </div>
        </aside>

        {/* Main Area: Question Content */}
        <main className="lg:col-span-9 bg-white rounded-[2.5rem] border border-slate-200 p-12 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
            <div>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{q.category}</span>
              <h2 className="text-xl font-black text-slate-900 mt-2">Question {currentQuestionIdx + 1}</h2>
            </div>
            <span className="text-slate-400 text-xs font-bold">Question Type: {q.type === 'mcq' ? 'Multiple Choice' : 'Coding Challenge'}</span>
          </div>

          <div className="flex-1 space-y-10">
            <div className="text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
              {q.question}
            </div>

            {q.type === 'mcq' ? (
              <div className="grid grid-cols-1 gap-4">
                {q.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswers({...answers, [q.id]: option})}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                      answers[q.id] === option ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      answers[q.id] === option ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200'
                    }`}>
                      {answers[q.id] === option && <i className="fas fa-check text-[10px]"></i>}
                    </div>
                    <span className={`font-bold ${answers[q.id] === option ? 'text-blue-900' : 'text-slate-600'}`}>{option}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col h-[300px] lg:h-[400px]">
                <div className="bg-slate-900 rounded-t-2xl px-6 py-3 flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-terminal"></i> code_sandbox.sh
                  </span>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  </div>
                </div>
                <textarea
                  value={answers[q.id] || q.starterCode || ''}
                  onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                  className="flex-1 w-full bg-slate-950 text-blue-300 p-8 font-mono text-sm outline-none resize-none rounded-b-2xl border-x border-b border-slate-800 shadow-inner"
                  placeholder="Type your code here..."
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          <div className="pt-12 flex justify-between">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              className="px-8 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-900 disabled:opacity-0 transition-all flex items-center gap-2"
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            <button
              onClick={() => {
                if (currentQuestionIdx < assessmentQuestions.length - 1) {
                  setCurrentQuestionIdx(prev => prev + 1);
                } else {
                  if(confirm('Ready to submit your assessment?')) handleSubmit();
                }
              }}
              className="px-10 py-4 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {currentQuestionIdx === assessmentQuestions.length - 1 ? 'Review & Submit' : 'Next Question'}
              {currentQuestionIdx < assessmentQuestions.length - 1 && <i className="fas fa-chevron-right"></i>}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-in fade-in zoom-in duration-700">
        {isSubmitting ? (
          <div className="bg-white rounded-[3rem] p-24 border border-slate-100 text-center space-y-8 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Finalizing Evaluation</h3>
              <p className="text-slate-400 font-medium">Industry Mentor AI is analyzing your answers...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
                <i className="fas fa-award text-[15rem]"></i>
              </div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Assessment Performance</h2>
                  <div className={`text-5xl font-black ${aiFeedback && aiFeedback.score >= 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {aiFeedback?.score}%
                  </div>
                </div>

                <div className={`p-8 rounded-[2.5rem] border-2 ${aiFeedback && aiFeedback.score >= 75 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Mentor Feedback</h4>
                  <p className="text-slate-700 text-lg leading-relaxed font-medium italic">
                    "{aiFeedback?.feedback}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Strengths Identified</h4>
                    <div className="flex flex-wrap gap-2">
                      {assessmentQuestions.filter(q => answers[q.id] === q.correctAnswer).slice(0, 3).map((q, i) => (
                        <span key={i} className="text-[9px] font-black bg-white text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100 uppercase">{q.category}</span>
                      ))}
                      <span className="text-[9px] font-black bg-white text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100 uppercase">Attention to Detail</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] font-black bg-white text-amber-600 px-3 py-1 rounded-lg border border-amber-100 uppercase">Latency Optimization</span>
                      <span className="text-[9px] font-black bg-white text-amber-600 px-3 py-1 rounded-lg border border-amber-100 uppercase">Advanced SQL Joins</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => setView('intro')}
                    className="flex-1 bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs"
                  >
                    Retake Simulation
                  </button>
                  <button 
                    onClick={() => window.location.hash = '#/murex-mastery'}
                    className="flex-1 bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs"
                  >
                    Back to Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MurexAssessment;
