import { motion } from 'framer-motion';
import { Sparkles, Shuffle, Upload } from 'lucide-react';
import { useAvatarStore } from '../../store/avatarStore';
import AvatarRenderer from '../Avatar/AvatarRenderer';
import { DEFAULT_AVATAR } from '../../data/avatarData';

export default function WelcomeStep() {
  const { dismissWelcome, randomize } = useAvatarStore();

  const handleCreate = () => dismissWelcome();

  const handleRandomize = () => {
    randomize();
    dismissWelcome();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-pink-500/15 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Avatar preview */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-400/30 to-purple-500/30 blur-xl scale-110" />
            <AvatarRenderer avatar={DEFAULT_AVATAR} size={200} animated />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            Create Your<br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Digital Identity
            </span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            Design a one-of-a-kind avatar that's uniquely you.<br />
            Hundreds of customization options await.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 text-white font-bold text-base shadow-2xl shadow-brand-500/40 border border-white/10"
          >
            <Sparkles size={20} />
            Create New Avatar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRandomize}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-white/10 text-white font-semibold text-sm border border-white/15 backdrop-blur-sm hover:bg-white/15 transition-all"
          >
            <Shuffle size={18} />
            Randomize Avatar
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-8 mt-10 text-center"
        >
          {[
            { label: 'Hair Styles', value: '15+' },
            { label: 'Accessories', value: '50+' },
            { label: 'Expressions', value: '8' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-[11px] text-white/40 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
