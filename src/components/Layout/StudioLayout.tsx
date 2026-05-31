import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Save, Trash2, ChevronDown } from 'lucide-react';
import { useAvatarStore } from '../../store/avatarStore';
import CenterCanvas from './CenterCanvas';
import RightPanel from './RightPanel';
import BottomBar from './BottomBar';
import StepNav from './StepNav';

export default function StudioLayout() {
  const { isDarkMode, toggleDarkMode, randomize, presets, loadPreset, deletePreset, savePreset } = useAvatarStore();
  const [showPresets, setShowPresets] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleSave = () => {
    if (saveName.trim()) {
      savePreset(saveName.trim());
      setSaveName('');
      setShowPresets(false);
    } else {
      savePreset(`Avatar ${presets.length + 1}`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none">
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 shrink-0 z-10"
        style={{ background: 'rgba(8,8,18,0.8)', backdropFilter: 'blur(24px)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/40">
            <span className="text-sm font-black">✦</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">Avatar Studio</h1>
            <p className="text-[10px] text-white/35 font-medium">Deen Games</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Presets dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/12 hover:bg-white/14 transition-all text-xs text-white/70"
            >
              <Save size={13} />
              <span className="hidden sm:inline">Presets</span>
              {presets.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {presets.length}
                </span>
              )}
              <ChevronDown size={11} className={`transition-transform ${showPresets ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/12 overflow-hidden z-50"
                  style={{ background: 'rgba(12,12,24,0.95)', backdropFilter: 'blur(24px)' }}
                >
                  {/* Save new */}
                  <div className="p-3 border-b border-white/8">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Avatar name..."
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-white placeholder-white/30 outline-none focus:border-brand-400/50"
                      />
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={handleSave}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-500/30 border border-brand-400/30 text-xs text-brand-300 hover:bg-brand-500/40 transition-all"
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>

                  {/* Preset list */}
                  {presets.length === 0 ? (
                    <div className="p-4 text-center text-xs text-white/30">No saved presets yet</div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto">
                      {presets.map((preset) => (
                        <div key={preset.id} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-all">
                          <button
                            onClick={() => { loadPreset(preset.id); setShowPresets(false); }}
                            className="flex-1 text-left text-xs text-white/80 hover:text-white truncate"
                          >
                            {preset.name}
                          </button>
                          <button
                            onClick={() => deletePreset(preset.id)}
                            className="shrink-0 text-white/30 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Randomize */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={randomize}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-400/20 hover:bg-purple-500/25 transition-all"
            title="Randomize avatar"
          >
            <span className="text-sm">🎲</span>
            <span className="text-xs text-purple-300 font-medium hidden sm:inline">Shuffle</span>
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/8 border border-white/10 hover:bg-white/15 transition-all"
          >
            {isDarkMode
              ? <Sun size={14} className="text-yellow-300" />
              : <Moon size={14} className="text-blue-300" />
            }
          </motion.button>
        </div>
      </motion.header>

      {/* Step navigation tabs */}
      <div className="px-3 py-2 border-b border-white/6 shrink-0" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <StepNav />
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center — Avatar canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex-1 relative flex items-center justify-center min-w-0"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, rgba(91,110,245,0.07) 0%, transparent 65%)`,
          }}
        >
          {/* Grid overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
          <CenterCanvas />
        </motion.div>

        {/* Right panel — Customization controls */}
        <motion.aside
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          className="w-72 xl:w-80 border-l border-white/8 flex flex-col overflow-hidden shrink-0"
          style={{ background: 'rgba(8,8,20,0.7)', backdropFilter: 'blur(20px)' }}
        >
          <RightPanel />
        </motion.aside>
      </div>

      {/* Bottom bar — actions / navigation */}
      <motion.div
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="border-t border-white/8 shrink-0"
        style={{ background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(24px)' }}
      >
        <BottomBar />
      </motion.div>

      {/* Backdrop for closing presets */}
      {showPresets && (
        <div className="fixed inset-0 z-40" onClick={() => setShowPresets(false)} />
      )}
    </div>
  );
}
