
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
// Fixed: Changed IdentificationCard to IdCard as IdentificationCard is not exported by lucide-react
import { GraduationCap, ShieldCheck, Mail, User as UserIcon, IdCard, Eye, EyeOff } from 'lucide-react';
import { MASCOT_IMAGE } from '../constants';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
  isDarkMode: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, isDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    usn: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate encryption and login
    const userData: User = {
      firstName: isLogin ? 'Student' : formData.firstName,
      lastName: isLogin ? 'Fox' : formData.lastName,
      usn: isLogin ? '1RUA24CSE0000' : formData.usn,
      email: isLogin ? 'student@rvu.edu.in' : formData.email,
      isLoggedIn: true
    };
    onAuthSuccess(userData);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl transition-all outline-none border-2 ${
    isDarkMode 
      ? 'bg-white/5 border-white/10 focus:border-orange-500/50 focus:bg-white/10' 
      : 'bg-orange-50 border-orange-100 focus:border-orange-500 focus:bg-white'
  }`;

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid md:grid-cols-2 glass-card rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Visual Side */}
        <div className="relative h-full hidden md:block bg-orange-500">
          <img 
            src={MASCOT_IMAGE} 
            alt="Curious Fox Mascot" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-4xl font-bold text-white mb-2">Join the Den</h2>
            <p className="text-orange-100 opacity-90">Curiosity didn't kill the fox, it made it smarter.</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="opacity-60 text-sm">
              {isLogin ? 'Enter your credentials to continue learning.' : 'Start your academic journey with us today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase opacity-50 px-1">First Name</label>
                  <input 
                    type="text" required 
                    className={inputClass}
                    placeholder="John"
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase opacity-50 px-1">Last Name</label>
                  <input 
                    type="text" required 
                    className={inputClass}
                    placeholder="Doe"
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase opacity-50 px-1">USN (College ID)</label>
                <div className="relative">
                  {/* Fixed: Changed IdentificationCard to IdCard */}
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                  <input 
                    type="text" required 
                    className={`${inputClass} pl-12`}
                    placeholder="1RUA24CSE0210"
                    onChange={(e) => setFormData({...formData, usn: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase opacity-50 px-1">Email ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                <input 
                  type="email" required 
                  className={`${inputClass} pl-12`}
                  placeholder="student@rvu.edu.in"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase opacity-50 px-1">Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className={`${inputClass} pl-12 pr-12`}
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>{isLogin ? 'Login Now' : 'Sign Up'}</span>
              <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium hover:text-orange-500 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
