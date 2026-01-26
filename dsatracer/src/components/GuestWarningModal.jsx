import React from 'react';
import { X, AlertTriangle, LogIn, User } from 'lucide-react';

const GuestWarningModal = ({ isOpen, onClose, onLogin, onContinueGuest }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>

        <div className="text-center space-y-4 pt-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <AlertTriangle size={32} strokeWidth={2.5} />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Progress Not Saved!</h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              You are currently using the site as a <span className="text-slate-800 font-bold">Guest</span>. 
              Any questions you mark as done will be lost if you refresh or close the page.
            </p>
          </div>

          {/* Actions */}
          <div className="grid gap-3 pt-2">
            <button 
              onClick={onLogin}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
            >
              <LogIn size={18} /> Login to Save Progress
            </button>
            
            <button 
              onClick={onContinueGuest}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl font-bold transition-all"
            >
              <User size={18} /> Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestWarningModal;