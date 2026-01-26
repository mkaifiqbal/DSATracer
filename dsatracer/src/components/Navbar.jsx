import React, { useState, useEffect } from 'react';
import { Menu, User, LogIn, Bell, LogOut, Pencil, ChevronDown, Check, X } from 'lucide-react';
import config from "../config";

const Navbar = ({ user, setUser, onLoginClick, onMenuClick, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  // Sync internal state when user prop changes
  useEffect(() => {
    if (user) setNewName(user.name);
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.name) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/update-name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: newName.trim() })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser); // Update global state in App.jsx
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 h-16 md:h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 text-slate-600 md:hidden">
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:block">
          {user ? (
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dashboard</p>
              <h2 className="text-sm font-bold text-slate-900">
                Welcome, <span className="text-blue-600">{user.name}</span>
              </h2>
            </div>
          ) : (
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dashboard / Guest</h2>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-5">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-1 pr-3 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 bg-slate-50/50"
            >
              <img src={user.profilePic} alt="User" className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover shadow-sm border-2 border-white" />
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => { setIsDropdownOpen(false); setIsEditing(false); }}></div>
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 overflow-hidden py-2">
                  <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/30 mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account Info</p>
                    
                    <div className="flex items-center justify-between gap-2">
                      {isEditing ? (
                        <>
                          <input 
                            autoFocus
                            type="text" 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                            className="w-full text-sm font-bold text-slate-800 border-b border-blue-500 outline-none bg-transparent"
                          />
                          <div className="flex gap-1">
                            <button onClick={handleUpdateName} className="text-green-600 hover:bg-green-50 p-1 border-1 rounded-md">
                              Save
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="text-slate-300 hover:text-blue-600 transition-colors p-1"
                          >
                            <Pencil size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-1">{user.email}</p>
                  </div>
                  
                  <button onClick={onLogout} className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 font-bold transition-colors">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={onLoginClick} className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm shadow-lg">
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;