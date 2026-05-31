import { motion, AnimatePresence } from 'framer-motion';
import { useAvatarStore } from '../../store/avatarStore';
import AvatarRenderer from '../Avatar/AvatarRenderer';
import { getRarityFromAvatar, RARITY_CONFIG } from '../../data/avatarData';

const RARITY_GLOWS: Record<string, string> = {
  common: 'rgba(148,163,184,0.15)',
  rare: 'rgba(59,130,246,0.2)',
  epic: 'rgba(168,85,247,0.25)',
  legendary: 'rgba(245,158,11,0.3)',
};

const RARITY_EMOJIS: Record<string, string> = {
  common: '◇',
  rare: '◈',
  epic: '◆',
  legendary: '★',
};

export default function CenterCanvas() {
  const { avatar } = useAvatarStore();
  const rarity = getRarityFromAvatar(avatar);
  const rarityInfo = RARITY_CONFIG[rarity];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative px-4 py-6">
      {/* Atmospheric glow */}
      <motion.div
        key={rarity}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle, ${RARITY_GLOWS[rarity]} 0%, transparent 70%)`,
        }}
      />

      {/* Rarity badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={rarity}
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold mb-4"
          style={{
            borderColor: rarityInfo.color + '50',
            background: rarityInfo.color + '12',
            color: rarityInfo.color,
            boxShadow: `0 0 20px ${rarityInfo.color}20`,
          }}
        >
          <motion.span
            animate={rarity === 'legendary' ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            {RARITY_EMOJIS[rarity]}
          </motion.span>
          {rarityInfo.label} Avatar
        </motion.div>
      </AnimatePresence>

      {/* Avatar */}
      <div className="relative" id="avatar-canvas">
        {/* Legendary shimmer ring */}
        {rarity === 'legendary' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 -m-3 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(245,158,11,0.4), transparent, rgba(245,158,11,0.4), transparent)',
              borderRadius: '50%',
            }}
          />
        )}
        {rarity === 'epic' && (
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 -m-2 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(168,85,247,0.35), transparent)',
              borderRadius: '50%',
            }}
          />
        )}

        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${avatar.hairStyle}-${avatar.faceShape}-${avatar.background}`}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.04, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.34, 1.2, 0.64, 1] }}
          >
            <AvatarRenderer
              avatar={avatar}
              size={260}
              animated
              id="avatar-svg"
              className="drop-shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-4 mt-4 text-center"
      >
        {[
          { label: 'Style', value: avatar.clothingCategory.charAt(0).toUpperCase() + avatar.clothingCategory.slice(1) },
          { label: 'Vibe', value: avatar.expression.charAt(0).toUpperCase() + avatar.expression.slice(1) },
          { label: 'Hair', value: ['Buzz','Crew','Messy','Part','Quiff','Slick','Curly','Wavy','Long','Braids','Bun','Pony','Bob','Dreads','Afro'][avatar.hairStyle] || 'Style' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="text-xs font-semibold text-white/70 leading-none">{stat.value}</span>
            <span className="text-[9px] text-white/25 mt-0.5 uppercase tracking-wide">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-[10px] text-white/20 font-medium tracking-widest uppercase"
      >
        Your Digital Identity ✦
      </motion.p>
    </div>
  );
}
