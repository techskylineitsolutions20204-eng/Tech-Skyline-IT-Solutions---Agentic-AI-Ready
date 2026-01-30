
import React from 'react';

const labs = [
  { 
    title: 'Agentic Workflow Automation', 
    env: 'LangGraph + AWS Bedrock', 
    duration: '120 mins', 
    diff: 'Intermediate',
    img: 'https://picsum.photos/400/250?seed=agent'
  },
  { 
    title: 'Zero Trust Network Architect', 
    env: 'Azure Security + Kubernetes', 
    duration: '180 mins', 
    diff: 'Advanced',
    img: 'https://picsum.photos/400/250?seed=cyber'
  },
  { 
    title: 'Full Stack Deployment CI/CD', 
    env: 'GitHub Actions + Docker + EKS', 
    duration: '90 mins', 
    diff: 'Basic',
    img: 'https://picsum.photos/400/250?seed=devops'
  },
  { 
    title: 'Advanced SAP IBP Integration', 
    env: 'SAP S/4HANA Sandbox', 
    duration: '240 mins', 
    diff: 'Advanced',
    img: 'https://picsum.photos/400/250?seed=sap'
  },
  { 
    title: 'AI Data Pipe Visualization', 
    env: 'Power BI + Databricks', 
    duration: '120 mins', 
    diff: 'Intermediate',
    img: 'https://picsum.photos/400/250?seed=data'
  },
  { 
    title: 'Murex Development Basics', 
    env: 'Murex Binary Env', 
    duration: '150 mins', 
    diff: 'Intermediate',
    img: 'https://picsum.photos/400/250?seed=murex'
  },
];

const LiveLabs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Live Cloud Labs</h1>
          <p className="text-slate-500">Practice on production-grade environments. No setup required.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-50"><i className="fas fa-filter text-slate-500"></i></button>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input type="text" placeholder="Search labs..." className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labs.map((lab, idx) => (
          <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
            <div className="relative h-48 overflow-hidden">
              <img src={lab.img} alt={lab.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  lab.diff === 'Basic' ? 'bg-green-500 text-white' : 
                  lab.diff === 'Intermediate' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {lab.diff}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-2">
                <i className="fas fa-microchip"></i>
                {lab.env}
              </div>
              <h3 className="text-xl font-bold mb-4 line-clamp-1">{lab.title}</h3>
              
              <div className="flex items-center justify-between text-slate-500 text-sm mb-6">
                <span className="flex items-center gap-1">
                  <i className="far fa-clock"></i> {lab.duration}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-users"></i> 1.2k Active
                </span>
              </div>
              
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
                Spin Up Sandbox
                <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveLabs;
