import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Cpu,
  TreePine,
  LogOut,
  LogIn,
  Sparkles,
  Key,
  X,
  Pencil,
  Phone,
  MapPin,
  Leaf,
  Check
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, login, register, updateProfile, logout, setIsAuthModalOpen, isAuthModalOpen, t } = useApp();

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLocation, setAuthLocation] = useState('');
  const [authPlantName, setAuthPlantName] = useState('');
  const [authPlantSpecies, setAuthPlantSpecies] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPlantName, setEditPlantName] = useState('');
  const [editPlantSpecies, setEditPlantSpecies] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;

    if (isRegisterMode) {
      register({
        email: authEmail,
        name: authName,
        phone: authPhone,
        location: authLocation,
        plantName: authPlantName,
        plantSpecies: authPlantSpecies,
      });
    } else {
      login(authEmail);
    }
  };

  const startEditingProfile = () => {
    if (!user) return;
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditLocation(user.location || '');
    setEditPlantName(user.plantName || '');
    setEditPlantSpecies(user.plantSpecies || '');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || user?.name,
      phone: editPhone.trim() || undefined,
      location: editLocation.trim() || undefined,
      plantName: editPlantName.trim() || user?.plantName,
      plantSpecies: editPlantSpecies.trim() || user?.plantSpecies,
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6 pb-24">

      <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-500" /> {t('profile.title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      {user ? (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/40 shadow-xl"
              />
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">
                  {user.name}
                </h2>
                <p className="text-xs text-emerald-500 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                {user.phone && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1">
                    <Phone className="w-3.5 h-3.5" /> {user.phone}
                  </p>
                )}
                {user.location && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {user.location}
                  </p>
                )}
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block mt-2">
                  Bonsai Master Member
                </span>
              </div>
            </div>

            <button
              onClick={startEditingProfile}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/50 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all flex-shrink-0"
            >
              <Pencil className="w-4 h-4" /> {t('profile.editProfile')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-emerald-500/20 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-500" /> {t('profile.connectedDevice')}
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{user.connectedDevice}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-emerald-500" /> {t('profile.primaryPlant')}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{user.plantName}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={logout}
              className="px-6 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> {t('profile.signOut')}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-2xl text-center max-w-md mx-auto space-y-4">
          <User className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
            {t('profile.signInTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('profile.signInSub')}
          </p>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> {t('profile.signInRegister')}
          </button>
        </div>
      )}

      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0F231D] border border-emerald-500/30 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-emerald-400" />
                  {isRegisterMode ? 'Create Smart Bonsai Account' : t('header.signIn')}
                </h3>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="master@smartbonsai.io"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {isRegisterMode && (
                  <div className="space-y-4 pt-3 border-t border-emerald-500/20">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Optional Details
                    </p>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="+1 555 123 4567"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={authLocation}
                          onChange={(e) => setAuthLocation(e.target.value)}
                          placeholder="City, Country"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Plant Name</label>
                      <div className="relative">
                        <TreePine className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={authPlantName}
                          onChange={(e) => setAuthPlantName(e.target.value)}
                          placeholder="e.g. Banyan Bonsai"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Plant Species</label>
                      <div className="relative">
                        <Leaf className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={authPlantSpecies}
                          onChange={(e) => setAuthPlantSpecies(e.target.value)}
                          placeholder="e.g. Ficus benghalensis"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30"
                >
                  {isRegisterMode ? 'Register Account' : 'Sign In'}
                </button>
              </form>

              <div className="pt-3 border-t border-emerald-500/20 space-y-2">
                <button
                  onClick={() => login('google.user@smartbonsai.io')}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" /> Continue with Google
                </button>
              </div>

              <div className="text-center text-xs text-slate-400">
                {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-emerald-400 font-bold underline ml-1"
                >
                  {isRegisterMode ? 'Sign In' : 'Register Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditingProfile && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0F231D] border border-emerald-500/30 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-emerald-400" /> Edit Profile
                </h3>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+1 555 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="City, Country"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Plant Name</label>
                  <div className="relative">
                    <TreePine className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={editPlantName}
                      onChange={(e) => setEditPlantName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Plant Species</label>
                  <div className="relative">
                    <Leaf className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={editPlantSpecies}
                      onChange={(e) => setEditPlantSpecies(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
