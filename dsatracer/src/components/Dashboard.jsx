import React, { useState, useMemo, useRef } from 'react';
import Sidebar from './Sidebar';       // Sibling import (since both are in components folder)
import Navbar from './Navbar';         // Sibling import
import QuestionCard from './QuestionCard'; // Sibling import
import { Search, Flame, Calendar, Tag, ChevronDown, ArrowDownToLine } from 'lucide-react';

const Dashboard = ({ user, setUser, questions, toggleQuestion, onLoginClick, onLogout }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState('classwork');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const listEndRef = useRef(null);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => prev.includes(groupKey) ? prev.filter(k => k !== groupKey) : [...prev, groupKey]);
  };

  const stats = useMemo(() => {
    const relevant = questions.filter(q => (filterType === 'practice' ? q.isPractice : !q.isPractice));
    const total = relevant.length;
    const solved = relevant.filter(q => q.completed).length;
    return { total, solved, percent: total > 0 ? Math.round((solved / total) * 100) : 0 };
  }, [questions, filterType]);

  const groupedData = useMemo(() => {
    return questions
      .filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(search) || q.topic.toLowerCase().includes(search);
        const matchesType = filterType === 'practice' ? q.isPractice : !q.isPractice;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(a.dateTaught) - new Date(b.dateTaught))
      .reduce((acc, q) => {
        let key = filterType === 'practice' ? q.topic : new Date(q.dateTaught).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (!acc[key]) acc[key] = [];
        acc[key].push(q);
        return acc;
      }, {});
  }, [questions, search, filterType]);

  return (
    <div className="flex min-h-screen bg-[#F9FBFC] font-sans text-slate-900 relative">
      <Sidebar 
        setFilterType={setFilterType} currentFilter={filterType} 
        isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}
        setSearch={setSearch} user={user} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar 
          user={user} setUser={setUser}
          onLoginClick={onLoginClick} 
          onLogout={onLogout} onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {/* Stats */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[11px] font-bold uppercase">{filterType === 'classwork' ? 'Class Lectures' : 'Practice Problems'} Progress</p>
                  <h2 className="text-2xl font-bold text-slate-800">{stats.percent}%</h2>
                </div>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden ml-4">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${stats.percent}%` }} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><Flame size={20} fill="currentColor" /></div>
                <div>
                  <p className="text-slate-400 text-[11px] font-bold uppercase">Solved Problems</p>
                  <h2 className="text-xl font-bold text-slate-800">{stats.solved} / {stats.total}</h2>
                </div>
              </div>
            </section>

            {/* Search */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1.5 mb-8 shadow-sm">
              <Search className="ml-3 text-slate-400" size={16} />
              <input type="text" placeholder={`Find a ${filterType === 'practice' ? 'topic' : 'question'}...`} className="w-full px-3 py-1.5 outline-none text-sm bg-transparent" value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} />
            </div>

            {/* List */}
            <div className="space-y-4 pb-20">
              {Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(([groupKey, items]) => (
                  <div key={groupKey} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <button onClick={() => toggleGroup(groupKey)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${filterType === 'practice' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          {filterType === 'practice' ? <Tag size={16} /> : <Calendar size={16} />}
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-800">{groupKey}</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{items.length} Items</p>
                        </div>
                      </div>
                      <ChevronDown size={18} className={`text-slate-300 transition-transform ${expandedGroups.includes(groupKey) ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>
                    {expandedGroups.includes(groupKey) && (
                      <div className="p-4 grid gap-3 pl-6 md:pl-10 border-l-2 border-blue-100 ml-4 md:ml-6 mb-2">
                        {items.map(q => <QuestionCard key={q._id} question={q} onToggle={toggleQuestion} />)}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">No results found.</div>
              )}
              <div ref={listEndRef} />
            </div>
          </div>
        </main>
      </div>
      
      <button onClick={() => listEndRef.current?.scrollIntoView({ behavior: 'smooth' })} className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl hover:bg-blue-600 transition-all">
        <ArrowDownToLine size={18} /> <span className="text-xs font-bold uppercase">Latest</span>
      </button>
    </div>
  );
};

export default Dashboard;