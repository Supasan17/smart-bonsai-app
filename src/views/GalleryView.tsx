import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Plus,
  Trash2,
  Calendar,
  Tag,
  BookOpen,
  X,
  Sparkles,
  Droplet
} from 'lucide-react';
import { GalleryPhoto } from '../types';

export const GalleryView: React.FC = () => {
  const { photos, addGalleryPhoto, deleteGalleryPhoto, t } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryPhoto['category']>('Pruning');
  const [newUrl, setNewUrl] = useState('https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80');

  const sampleImages = [
    'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599598425947-0206455429d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addGalleryPhoto({
      title: newTitle,
      notes: newNotes || 'No notes added.',
      category: newCategory,
      url: newUrl,
      date: new Date().toISOString().split('T')[0]
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const categories = ['All', 'Pruning', 'Repotting', 'Fertilizer', 'General', 'Inspection'];

  const filteredPhotos = filterCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === filterCategory);

  return (
    <div className="space-y-6 pb-24">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-500" /> {t('gallery.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('gallery.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> {t('gallery.addPhoto')}
        </button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/80 dark:bg-[#12231E]/60 border border-slate-200 dark:border-emerald-500/20 text-slate-600 dark:text-slate-400 hover:border-emerald-500/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="rounded-3xl bg-white/80 dark:bg-[#12231E]/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-xl overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                {photo.category}
              </div>

              <button
                onClick={() => deleteGalleryPhoto(photo.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                  {photo.title}
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-500" /> {photo.date}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {photo.notes}
              </p>

              {photo.moistureAtTime && (
                <div className="pt-2 border-t border-slate-200 dark:border-emerald-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-cyan-500" /> Telemetry Moisture
                  </span>
                  <span className="font-mono font-bold text-emerald-500">
                    {photo.moistureAtTime}%
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0F231D] border border-emerald-500/30 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" /> New Bonsai Growth Entry
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Entry Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Wired Primary Branch"
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Pruning">Pruning</option>
                    <option value="Repotting">Repotting</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Inspection">Inspection</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Select Photo Preset</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {sampleImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="preset"
                        onClick={() => setNewUrl(img)}
                        className={`w-full h-14 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                          newUrl === img ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Notes & Details</label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Describe technique, soil ratio, foliage changes..."
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30"
                >
                  Save Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
