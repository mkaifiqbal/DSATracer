import React from 'react';
import { X, Chrome } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onGoogleLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Chrome size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Welcome to PepClass</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to track your DSA progress</p>
        </div>

        <button 
          onClick={onGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-200 transition-all active:scale-[0.98] shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span>Continue with Google</span>
        </button>

        <p className="text-[10px] text-center text-slate-400 mt-8 uppercase tracking-widest font-semibold">
          Secure Login via Google OAuth
        </p>
      </div>
    </div>
  );
};

export default LoginModal;