import React, { useState, useEffect } from 'react';
import { Menu, LogIn, LogOut, Pencil, ChevronDown } from 'lucide-react';
import config from "../config";

// 1. Accept 'isDarkMode' prop
const Navbar = ({ user, setUser, onLoginClick, onMenuClick, onLogout, isDarkMode }) => {
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
        setUser(updatedUser); 
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  // 2. Define Theme Styles
  const theme = {
    nav: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSub: isDarkMode ? 'text-slate-400' : 'text-slate-400',
    menuIcon: isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900',
    
    // User Dropdown Button
    userBtn: isDarkMode 
      ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
      : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50',
    
    // Dropdown Panel
    dropdown: isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100',
    dropdownHeader: isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50/30 border-slate-50',
    
    // Inputs & Actions
    input: isDarkMode ? 'text-white border-blue-400' : 'text-slate-800 border-blue-500',
    saveBtn: isDarkMode ? 'text-green-400 hover:bg-green-900/20' : 'text-green-600 hover:bg-green-50',
    logoutBtn: isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50',
    signInBtn: isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-900 hover:bg-slate-800'
  };

  return (
    <nav className={`${theme.nav} h-16 md:h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300`}>
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className={`p-2 md:hidden ${theme.menuIcon}`}>
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:block">
          {user ? (
            <div className="flex flex-col">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textSub}`}>Dashboard</p>
              <h2 className={`text-sm font-bold ${theme.textMain}`}>
                Welcome, <span className="text-blue-600">{user.name}</span>
              </h2>
            </div>
          ) : (
            <h2 className={`text-xs font-bold uppercase tracking-widest ${theme.textSub}`}>Dashboard / Guest</h2>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-5">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center space-x-2 p-1 pr-3 rounded-2xl transition-all border ${theme.userBtn}`}
            >
              <img src={user.profilePic} alt="User" className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover shadow-sm border-2 border-transparent" />
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => { setIsDropdownOpen(false); setIsEditing(false); }}></div>
                <div className={`absolute right-0 mt-3 w-64 border rounded-2xl shadow-2xl z-20 overflow-hidden py-2 ${theme.dropdown}`}>
                  <div className={`px-5 py-4 border-b mb-2 ${theme.dropdownHeader}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${theme.textSub}`}>Account Info</p>
                    
                    <div className="flex items-center justify-between gap-2">
                      {isEditing ? (
                        <>
                          <input 
                            autoFocus
                            type="text" 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                            className={`w-full text-sm font-bold border-b outline-none bg-transparent ${theme.input}`}
                          />
                          <div className="flex gap-1">
                            <button onClick={handleUpdateName} className={`p-1 border-1 rounded-md text-xs font-bold ${theme.saveBtn}`}>
                              Save
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className={`text-sm font-bold truncate ${theme.textMain}`}>{user.name}</p>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                          >
                            <Pencil size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-1">{user.email}</p>
                  </div>
                  
                  <button onClick={onLogout} className={`w-full flex items-center space-x-3 px-5 py-3 text-sm font-bold transition-colors ${theme.logoutBtn}`}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={onLoginClick} className={`flex items-center space-x-2 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm shadow-lg transition-colors ${theme.signInBtn}`}>
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;