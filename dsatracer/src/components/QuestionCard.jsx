import React from 'react';
import { CheckCircle2, ExternalLink, Code2, ChevronRight, Lock } from 'lucide-react';

const QuestionCard = ({ question, onToggle, isDarkMode }) => {
  // We use _id for tracking logic, but we won't show it in the UI
  const { _id, title, topic, link, ansLink, completed, isPractice } = question;

  const handleOpenLink = (e, url) => {
    e.stopPropagation();
    if (url) window.open(url, '_blank');
  };

  // --- DYNAMIC THEME CLASSES ---
  const theme = {
    card: isDarkMode 
      ? 'bg-slate-800 border-slate-700 hover:border-blue-500 shadow-slate-900/20' 
      : 'bg-white border-slate-100 hover:border-blue-400 shadow-sm',
    completedCard: isDarkMode 
      ? 'border-green-500 ring-green-500 bg-green-900/10' 
      : 'border-green-500 ring-green-500 bg-green-50/20',
    title: isDarkMode ? 'text-slate-200' : 'text-slate-800',
    checkboxBase: isDarkMode 
      ? 'bg-slate-700 border-slate-600 text-slate-500 hover:border-blue-400 hover:text-blue-400' 
      : 'bg-white border-slate-200 text-slate-300 hover:border-blue-400 hover:text-blue-400',
    solutionBtn: isDarkMode 
      ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 hover:text-white' 
      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900',
    chevron: isDarkMode 
      ? 'bg-slate-700 text-slate-500' 
      : 'bg-slate-100 text-slate-400',
    badge: isPractice
      ? (isDarkMode ? 'bg-purple-900/30 text-purple-400 border-purple-800' : 'bg-purple-50 text-purple-600 border-purple-100')
      : (isDarkMode ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-50 text-blue-600 border-blue-100')
  };

  return (
    <div 
      onClick={(e) => handleOpenLink(e, link)}
      // 1. Reduced padding from p-5 to p-3 for less height
      className={`group relative flex flex-col md:flex-row items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl ${
        completed 
          ? `${theme.completedCard} ring-1` 
          : theme.card
      }`}
    >
      <div className="flex items-center space-x-4 w-full md:w-auto">
        {/* CHECKBOX / TICK BUTTON */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle(_id); 
          }}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
            completed 
              ? 'bg-green-500 border-green-500 shadow-md scale-105' 
              : theme.checkboxBase
          }`}
          title={completed ? "Mark as incomplete" : "Mark as done"}
        >
          <CheckCircle2 
            size={20} 
            strokeWidth={3} 
            className={`transition-transform duration-300 ${completed ? 'text-white' : 'scale-100'}`} 
          />
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            {/* Topic Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${theme.badge}`}>
              {topic}
            </span>
          </div>
          
          <h3 className={`text-base font-bold group-hover:text-blue-600 transition-colors flex items-center gap-2 leading-tight ${theme.title}`}>
            {title}
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-3 md:mt-0 w-full md:w-auto">

        {ansLink ? (
          <button 
            onClick={(e) => handleOpenLink(e, ansLink)}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider border transition-all ${theme.solutionBtn}`}
          >
            <Code2 size={14} />
            <span>Solution</span>
          </button>
        ) : (
          <div className="flex-1 md:flex-none px-4 py-1.5 text-slate-400 text-[10px] font-bold uppercase flex items-center gap-2 cursor-not-allowed select-none opacity-50">
            <Lock size={12} /> No Solution
          </div>
        )}

        <div className={`hidden md:flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 ${theme.chevron}`}>
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;