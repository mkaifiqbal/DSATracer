import React, { useState, useMemo, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';       
import Navbar from './Navbar';        
import QuestionCard from './QuestionCard';
import config from '../config'; // Ensure this points to your config file
import { Search, Flame, Calendar, Tag, ChevronDown, ArrowDownToLine } from 'lucide-react';

const Dashboard = ({ user, setUser, questions, toggleQuestion, onLoginClick, onLogout }) => {
  
  // 1. THEME STATE (Check LocalStorage first)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // 2. SYNC WITH DATABASE ON LOGIN
  useEffect(() => {
    if (user && user.theme) {
      const userPrefersDark = user.theme === 'dark';
      setIsDarkMode(userPrefersDark);
      localStorage.setItem('theme', user.theme);
    }
  }, [user]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState('classwork');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const listEndRef = useRef(null);

  // 3. TOGGLE FUNCTION (Passed to Sidebar)
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    const newThemeString = newMode ? 'dark' : 'light';
    
    // A. Update UI & LocalStorage immediately
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newThemeString);

    // B. Save to Database if logged in
    if (user) {
      setUser({ ...user, theme: newThemeString }); // Optimistic update
      try {
        await fetch(`${config.API_BASE_URL}/api/users/theme`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // If you use tokens
          },
          credentials: 'include', // Important for cookies
          body: JSON.stringify({ theme: newThemeString })
        });
      } catch (err) {
        console.error("Failed to save theme:", err);
      }
    }
  };

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

  // 4. DYNAMIC THEME CLASSES
  const theme = {
    bg: isDarkMode ? 'bg-slate-900' : 'bg-[#F9FBFC]',
    text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
    card: isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800',
    subText: isDarkMode ? 'text-slate-400' : 'text-slate-400',
    hover: isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50',
    iconBg: isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-orange-50 text-orange-500',
    groupHeader: isDarkMode ? 'text-slate-200' : 'text-slate-800',
    groupBorder: isDarkMode ? 'border-blue-500/20' : 'border-blue-100'
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text} relative`}>
      {/* PASS THEME PROPS TO SIDEBAR */}
      <Sidebar 
        setFilterType={setFilterType} currentFilter={filterType} 
        isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}
        setSearch={setSearch} user={user}
        isDarkMode={isDarkMode} toggleTheme={toggleTheme} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar 
          user={user} setUser={setUser}
          onLoginClick={onLoginClick} 
          onLogout={onLogout} onMenuClick={() => setIsMobileMenuOpen(true)}
          isDarkMode={isDarkMode} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className={`${theme.card} p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-colors`}>
                <div>
                  <p className={`${theme.subText} text-[11px] font-bold uppercase`}>{filterType === 'classwork' ? 'Class Lectures' : 'Practice Problems'} Progress</p>
                  <h2 className="text-2xl font-bold">{stats.percent}%</h2>
                </div>
                <div className="w-24 h-2 bg-slate-200/20 rounded-full overflow-hidden ml-4">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${stats.percent}%` }} />
                </div>
              </div>
              <div className={`${theme.card} p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors`}>
                <div className={`p-3 rounded-xl ${theme.iconBg}`}><Flame size={20} fill="currentColor" /></div>
                <div>
                  <p className={`${theme.subText} text-[11px] font-bold uppercase`}>Solved Problems</p>
                  <h2 className="text-xl font-bold">{stats.solved} / {stats.total}</h2>
                </div>
              </div>
            </section>

            {/* Search Bar */}
            <div className={`flex items-center ${theme.input} border rounded-xl p-1.5 mb-8 shadow-sm transition-colors`}>
              <Search className="ml-3 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder={`Find a ${filterType === 'practice' ? 'topic' : 'question'}...`} 
                className="w-full px-3 py-1.5 outline-none text-sm bg-transparent" 
                value={search} 
                onChange={(e) => setSearch(e.target.value.toLowerCase())} 
              />
            </div>

            {/* Question List */}
            <div className="space-y-4 pb-20">
              {Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(([groupKey, items]) => (
                  <div key={groupKey} className={`${theme.card} border rounded-xl overflow-hidden shadow-sm transition-colors`}>
                    <button onClick={() => toggleGroup(groupKey)} className={`w-full flex items-center justify-between p-4 text-left ${theme.hover}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${filterType === 'practice' ? 'bg-purple-500/10 text-purple-600' : 'bg-blue-500/10 text-blue-600'}`}>
                          {filterType === 'practice' ? <Tag size={16} /> : <Calendar size={16} />}
                        </div>
                        <div>
                          <h2 className={`text-sm font-bold ${theme.groupHeader}`}>{groupKey}</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{items.length} Items</p>
                        </div>
                      </div>
                      <ChevronDown size={18} className={`text-slate-400 transition-transform ${expandedGroups.includes(groupKey) ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>
                    {expandedGroups.includes(groupKey) && (
                      <div className={`p-4 grid gap-3 pl-6 md:pl-10 border-l-2 ${theme.groupBorder} ml-4 md:ml-6 mb-2`}>
                        {items.map(q => (
                          <QuestionCard 
                            key={q._id} 
                            question={q} 
                            onToggle={toggleQuestion} 
                            isDarkMode={isDarkMode} // Passing theme to Card
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={`text-center py-20 rounded-2xl border text-sm ${theme.card} text-slate-400`}>No results found.</div>
              )}
              <div ref={listEndRef} />
            </div>
          </div>
        </main>
      </div>
      
      <button onClick={() => listEndRef.current?.scrollIntoView({ behavior: 'smooth' })} className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl transition-all ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
        <ArrowDownToLine size={18} /> <span className="text-xs font-bold uppercase">Latest</span>
      </button>
    </div>
  );
};

export default Dashboard;