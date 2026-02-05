import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Coffee, X, ShieldCheck, Moon, Sun, Github, Linkedin, ChevronRight } from 'lucide-react';

const Sidebar = ({ setFilterType, currentFilter, isOpen, onClose, user, isDarkMode, toggleTheme }) => {
  
  // DEBUG CHECK: Open Console (F12) to see if these are "undefined"
  // console.log("Sidebar Params:", { isDarkMode, toggleTheme });

  // Theme-based Styles
  const theme = {
    aside: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100',
    textMain: isDarkMode ? 'text-white' : 'text-slate-800',
    textSub: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    hover: isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-500',
    active: isDarkMode 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
      : 'bg-blue-600 text-white shadow-lg shadow-blue-100',
    sectionTitle: isDarkMode ? 'text-slate-600' : 'text-slate-400',
    cardBg: isDarkMode ? 'bg-slate-800' : 'bg-slate-50 border border-slate-100',
    socialBtn: isDarkMode 
      ? 'bg-slate-800 hover:bg-slate-700 text-white' 
      : 'bg-slate-900 hover:bg-slate-800 text-white'
  };

  const menuItems = [
    { id: 'classwork', label: 'Class Lectures', icon: <LayoutDashboard size={18}/> },
    { id: 'practice', label: 'Practice Problems', icon: <Coffee size={18}/> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 border-r shadow-2xl transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:block md:shadow-none
        h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme.aside}
      `}>
        <div className="flex flex-col h-full p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white font-bold text-xs">DT</div>
              <span className={`text-xl font-bold tracking-tight ${theme.textMain}`}>DSATracer</span>
            </div>
            <button onClick={onClose} className={`md:hidden p-2 rounded-lg transition-colors ${theme.hover}`}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setFilterType(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                  currentFilter === item.id ? theme.active : theme.hover
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {currentFilter === item.id && <ChevronRight size={16} />}
              </button>
            ))}

            {user?.role === 'admin' && (
              <div className={`pt-4 mt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <Link
                  to="/admin"
                  onClick={onClose}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${theme.hover}`}
                >
                  <ShieldCheck size={18} />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom Section */}
          <div className={`mt-auto pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            
            {/* Appearance Toggle */}
            <div className={`rounded-2xl p-4 mb-4 ${theme.cardBg}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${theme.sectionTitle}`}>Appearance</p>
              
              <button 
                // DEBUGGING ADDED HERE
                onClick={() => {
                  console.log("CLICKED! Current Mode:", isDarkMode);
                  if (toggleTheme) toggleTheme();
                  else console.error("ERROR: toggleTheme function is missing!");
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer relative z-50 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-white shadow-sm text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                  <span className="text-xs font-bold">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-slate-200'}`}>
                  <div 
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm`} 
                    style={{ left: isDarkMode ? '18px' : '2px' }} 
                  />
                </div>
              </button>
            </div>

            {/* Social Links */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-1 ${theme.sectionTitle}`}>Connect</p>
              <div className="flex gap-2">
                <a 
                  href="https://github.com/mkaifiqbal/DSATracer" 
                  target="_blank" 
                  rel="noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${theme.socialBtn}`}
                >
                  <Github size={14} /> GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/mkaifiqbal/" 
                  target="_blank" 
                  rel="noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  <Linkedin size={14} /> Profile
                </a>
              </div>
            </div>

          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;