import React from 'react';
import { LayoutDashboard, Coffee, Tag, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom'; // 1. Ensure this import exists

const Sidebar = ({ setFilterType, currentFilter, isOpen, onClose, setSearch, user }) => {
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
        fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r shadow-2xl transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:block md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white font-bold text-xs">DT</div>
              <span className="text-xl font-bold tracking-tight text-slate-800">DSATracer</span>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><X size={20} /></button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setFilterType(item.id);
                  setSearch("");
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                  currentFilter === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {currentFilter === item.id && <ChevronRight size={16} />}
              </button>
            ))}

            {/* --- FIX: Use Link instead of Button --- */}
            {user?.role === 'admin' && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
                >
                  <ShieldCheck size={18} />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Topics</h3>
            <div className="space-y-1">
              {['Arrays', 'Recursion', 'DP', 'Graphs'].map(topic => (
                <button 
                  key={topic}
                  onClick={() => { setSearch(topic.toLowerCase()); onClose(); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Tag size={12} className="opacity-50" />
                  <span>{topic}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;