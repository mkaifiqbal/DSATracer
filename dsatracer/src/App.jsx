import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Search, Flame, Calendar, Tag, ChevronDown, ArrowDownToLine, Layers, Clock } from 'lucide-react';

import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import QuestionCard from './components/QuestionCard';
import GuestWarningModal from './components/GuestWarningModal'; // Import the new modal

// --- Dashboard Layout (No Changes) ---
const DashboardLayout = ({ 
  user, setUser, questions, toggleQuestion, 
  onLoginClick, onLogout 
}) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState('classwork');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [viewMode, setViewMode] = useState('date');
  
  const listEndRef = useRef(null);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) ? prev.filter(k => k !== groupKey) : [...prev, groupKey]
    );
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
      .sort((a, b) => new Date(b.dateTaught) - new Date(a.dateTaught))
      .reduce((acc, q) => {
        let key;
        if (filterType === 'practice' || viewMode === 'topic') {
            key = q.topic;
        } else {
            key = new Date(q.dateTaught).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        if (!acc[key]) acc[key] = [];
        acc[key].push(q);
        return acc;
      }, {});
  }, [questions, search, filterType, viewMode]);

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

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                <Search className="ml-3 text-slate-400" size={16} />
                <input 
                  type="text" placeholder={`Find a ${filterType === 'practice' ? 'topic' : 'question'}...`}
                  className="w-full px-3 py-1.5 outline-none text-sm bg-transparent"
                  value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())}
                />
              </div>

              {filterType === 'classwork' && (
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('date')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'date' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Clock size={14} /> By Date
                  </button>
                  <button 
                    onClick={() => setViewMode('topic')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'topic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Layers size={14} /> By Topic
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            <div className="space-y-4 pb-20">
              {Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(([groupKey, items]) => {
                   const isExpanded = expandedGroups.includes(groupKey);
                   return (
                  <div key={groupKey} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <button onClick={() => toggleGroup(groupKey)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${filterType === 'practice' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          {(filterType === 'practice' || viewMode === 'topic') ? <Tag size={16} /> : <Calendar size={16} />}
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-800">{groupKey}</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{items.length} Items</p>
                        </div>
                      </div>
                      <ChevronDown size={18} className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="p-4 grid gap-3 pl-6 md:pl-10 border-l-2 border-blue-100 ml-4 md:ml-6 mb-2">
                        {items.map(q => <QuestionCard key={q._id} question={q} onToggle={toggleQuestion} />)}
                      </div>
                    )}
                  </div>
                )})
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">No results found.</div>
              )}
              <div ref={listEndRef} />
            </div>
          </div>
        </main>
      </div>
      
      <button onClick={() => listEndRef.current?.scrollIntoView({ behavior: 'smooth' })} className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl hover:bg-blue-600 transition-all">
        <ArrowDownToLine size={18} /> <span className="text-xs font-bold uppercase">END</span>
      </button>
    </div>
  );
};

// ---------------------------------------------
// MAIN APP COMPONENT
// ---------------------------------------------

const App = () => {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- GUEST LOGIC STATES ---
  const [guestWarningShown, setGuestWarningShown] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [pendingQuestionId, setPendingQuestionId] = useState(null); 

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/current_user', { credentials: 'include' });
        if (res.ok && res.status !== 204) {
          const data = await res.json();
          if (data?.email) setUser(data);
        }
      } catch (error) { console.error("Session check failed:", error); } finally { setLoading(false); }
    };

    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/questions');
        const data = await res.json();
        setQuestions(data);
      } catch (error) { console.error("Fetch failed:", error); }
    };

    checkUserSession();
    fetchQuestions();
  }, []);

  // Sync Logic
  useEffect(() => {
    if (user?.completedQuestions && questions.length > 0) {
      setQuestions(prevQuestions => {
        const needsUpdate = prevQuestions.some(q => {
          const shouldBeChecked = user.completedQuestions.includes(q._id);
          return q.completed !== shouldBeChecked;
        });
        if (!needsUpdate) return prevQuestions;
        return prevQuestions.map(q => ({
          ...q,
          completed: user.completedQuestions.includes(q._id)
        }));
      });
    }
  }, [user, questions.length]);

  const handleLogout = () => { window.location.href = "http://localhost:5000/api/auth/logout"; };
  const handleGoogleLogin = () => { window.location.href = "http://localhost:5000/api/auth/google"; };
  
  // --- TOGGLE FUNCTION ---
  const toggleQuestion = async (id) => {
    // 1. GUEST MODE
    if (!user) {
      // If warning not shown yet, intercept the click
      if (!guestWarningShown) {
        setPendingQuestionId(id); // Remember which question they clicked
        setIsGuestModalOpen(true); // Open the custom warning modal
        return;
      }
      // If warning already shown, just toggle locally
      setQuestions(questions.map(q => q._id === id ? { ...q, completed: !q.completed } : q));
      return;
    }

    // 2. LOGGED IN MODE
    try {
      const response = await fetch('http://localhost:5000/api/users/toggle-question', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, questionId: id })
      });
      if (response.ok) {
        const updatedCompletedList = await response.json();
        setQuestions(prev => prev.map(q => ({ ...q, completed: updatedCompletedList.includes(q._id) })));
        setUser(prevUser => ({ ...prevUser, completedQuestions: updatedCompletedList }));
      }
    } catch (error) { console.error("Toggle failed:", error); }
  };

  // --- Handlers for the Guest Modal ---
  const handleContinueGuest = () => {
    setGuestWarningShown(true); // Mark as warned
    setIsGuestModalOpen(false); // Close modal
    
    // Perform the toggle they originally wanted
    if (pendingQuestionId) {
      setQuestions(prev => prev.map(q => q._id === pendingQuestionId ? { ...q, completed: !q.completed } : q));
      setPendingQuestionId(null);
    }
  };

  const handleLoginFromWarning = () => {
    setIsGuestModalOpen(false);
    setIsLoginModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FBFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <DashboardLayout 
              user={user} 
              setUser={setUser} 
              questions={questions} 
              toggleQuestion={toggleQuestion}
              onLoginClick={() => setIsLoginModalOpen(true)}
              onLogout={handleLogout}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
             user?.role === 'admin' 
             ? <AdminPanel questions={questions} setQuestions={setQuestions} user={user} /> 
             : <Navigate to="/" />
          } 
        />
      </Routes>
      
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onGoogleLogin={handleGoogleLogin} />
      
      {/* New Custom Guest Warning Modal */}
      <GuestWarningModal 
        isOpen={isGuestModalOpen} 
        onClose={() => setIsGuestModalOpen(false)} 
        onLogin={handleLoginFromWarning}
        onContinueGuest={handleContinueGuest}
      />
    </Router>
  );
};

export default App;