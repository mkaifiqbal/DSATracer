import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from "../config";
import { 
  LayoutDashboard, BookOpen, Coffee, PlusCircle, 
  Users, Trash2, Pencil, Search, ArrowLeft, LogOut 
} from 'lucide-react';

const AdminPanel = ({ questions, setQuestions, user }) => {

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search State

  const [stats, setStats] = useState({ classworkCount: 0, practiceCount: 0, activeUsers: 0, userDetails: [] });
  
  const [formData, setFormData] = useState({
    title: '', topic: '', link: '', ansLink: '', dateTaught: new Date().toISOString().split('T')[0], isPractice: false
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/admin/stats`, {
          headers: { 'admin-email': user.email }
        });
        if (res.ok) setStats(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, [user.email, questions]);

  const openAddMode = () => {
    setEditingId(null); 
    setFormData({ 
      title: '', topic: '', link: '', ansLink: '', 
      dateTaught: new Date().toISOString().split('T')[0], 
      isPractice: false 
    });
    setActiveTab('add');
  };

  const handleEdit = (q) => {
    setEditingId(q._id); 
    setFormData({
      title: q.title,
      topic: q.topic,
      link: q.link,
      ansLink: q.ansLink || '',
      dateTaught: q.dateTaught ? new Date(q.dateTaught).toISOString().split('T')[0] : '',
      isPractice: q.isPractice
    });
    setActiveTab('add'); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    setQuestions(questions.filter(q => q._id !== id));
    await fetch(`${config.API_BASE_URL}/api/questions/${id}`, { 
        method: 'DELETE',
        headers: { 'admin-email': user.email }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${config.API_BASE_URL}/api/questions/${editingId}` 
        : `${config.API_BASE_URL}/api/questions`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        credentials: 'include', 
        headers: { 
          'Content-Type': 'application/json', 
          'admin-email': user.email 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const resultQ = await res.json();
        if (editingId) {
            setQuestions(questions.map(q => q._id === editingId ? resultQ : q));
            alert("Updated Successfully!");
        } else {
            setQuestions([...questions, resultQ]);
            alert("Added Successfully!");
        }
        openAddMode(); 
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to connect to server.");
    }
  };

  // 1. Dashboard View (Updated with User Profile Pics)
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-slate-800">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg">
          <BookOpen className="opacity-50 mb-4" size={32} />
          <h3 className="text-4xl font-black">{stats.classworkCount}</h3>
          <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Class Lectures</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-3xl text-white shadow-lg">
          <Coffee className="opacity-50 mb-4" size={32} />
          <h3 className="text-4xl font-black">{stats.practiceCount}</h3>
          <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Practice Problems</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-slate-800">
            <Users size={24} className="text-slate-400"/>
            <span className="font-bold text-lg">Active Users</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900">{stats.activeUsers}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-slate-800">Registered Members</h3>
        </div>
        <div className="max-h-64 overflow-y-auto p-4 space-y-2">
          {stats.userDetails.map(u => (
            <div key={u.email} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                {u.profilePic ? (
                  <img src={u.profilePic} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                    {u.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-700">{u.name}</p>
                  <p className="text-[10px] text-slate-400">{u.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-1 rounded-md capitalize">{u.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Classwork List View (Updated with Search)
  const renderClasswork = () => {
    const filteredQuestions = questions.filter(q => 
      !q.isPractice && q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800">Manage Classwork</h2>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search titles..." 
                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={openAddMode} className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
              <PlusCircle size={16} /> Add New
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {filteredQuestions.map((q, idx) => (
              <div key={q._id} className={`p-4 flex justify-between items-center ${idx !== 0 ? 'border-t border-slate-50' : ''} hover:bg-slate-50 group`}>
                <div className="flex gap-4 items-center overflow-hidden">
                  <span className="text-slate-300 font-bold text-xs w-6">{idx + 1}</span>
                  <div className="truncate">
                    <p className="font-bold text-slate-700 text-sm truncate">{q.title}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">{new Date(q.dateTaught).toDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(q)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-blue-600"><Pencil size={16}/></button>
                  <button onClick={() => handleDelete(q._id)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="p-10 text-center text-slate-400 text-sm italic">No matching classwork found.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 3. Practice List View (Updated with Search)
  const renderPractice = () => {
    const filteredQuestions = questions.filter(q => 
      q.isPractice && q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800">Manage Practice</h2>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search practice..." 
                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={openAddMode} className="flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors">
              <PlusCircle size={16} /> Add New
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {filteredQuestions.map((q, idx) => (
              <div key={q._id} className={`p-4 flex justify-between items-center ${idx !== 0 ? 'border-t border-slate-50' : ''} hover:bg-slate-50 group`}>
                <div className="flex gap-4 items-center overflow-hidden">
                  <span className="text-slate-300 font-bold text-xs w-6">{idx + 1}</span>
                  <div className="truncate">
                    <p className="font-bold text-slate-700 text-sm truncate">{q.title}</p>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded uppercase tracking-wide">{q.topic}</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(q)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-blue-600"><Pencil size={16}/></button>
                  <button onClick={() => handleDelete(q._id)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="p-10 text-center text-slate-400 text-sm italic">No matching practice problems found.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 4. Add/Edit Form View (Unchanged)
  const renderAdd = () => (
    <div className="max-w-2xl mx-auto pt-10 animate-in zoom-in-95 duration-300">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <PlusCircle className="text-blue-600"/> {editingId ? 'Edit Question' : 'Add Question'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
              <input type="text" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Two Sum" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Topic</label>
              <input type="text" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Arrays" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Problem Link</label>
              <input type="url" required className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://leetcode.com/..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Answer Link (Optional)</label>
              <input type="url" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://github.com/..." value={formData.ansLink} onChange={e => setFormData({...formData, ansLink: e.target.value})} />
            </div>
          </div>

          {!formData.isPractice && (
            <div className="space-y-2 animate-in fade-in">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Taught</label>
              <input type="date" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" value={formData.dateTaught} onChange={e => setFormData({...formData, dateTaught: e.target.value})} />
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${formData.isPractice ? 'bg-purple-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.isPractice ? 'translate-x-6' : ''}`}></div>
              </div>
              <input type="checkbox" className="hidden" checked={formData.isPractice} onChange={e => setFormData({...formData, isPractice: e.target.checked})} />
              <span className="text-sm font-bold text-slate-600">Practice Question?</span>
            </label>

            <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
              {editingId ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter">ADMIN<span className="text-blue-500">.</span></h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Control Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> <span className="text-sm font-bold">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('classwork')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'classwork' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <BookOpen size={20} /> <span className="text-sm font-bold">Classwork</span>
          </button>
          <button onClick={() => setActiveTab('practice')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'practice' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Coffee size={20} /> <span className="text-sm font-bold">Practice</span>
          </button>
          
          <button onClick={openAddMode} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'add' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <PlusCircle size={20} /> <span className="text-sm font-bold">Add Question</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Exit Admin</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'classwork' && renderClasswork()}
        {activeTab === 'practice' && renderPractice()}
        {activeTab === 'add' && renderAdd()}
      </main>
    </div>
  );
};

export default AdminPanel;