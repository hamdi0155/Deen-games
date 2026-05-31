import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ImageIcon, Film, Sticker } from 'lucide-react';
import { exportAsPNG, exportAsSVG, exportAsGIF, exportAsSticker } from '../../utils/export';
import { useAvatarStore } from '../../store/avatarStore';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

const OPTIONS = [
  {
    id: 'png',
    label: 'PNG Image',
    desc: 'High-resolution transparent PNG',
    icon: ImageIcon,
    color: '#4A90D9',
    action: () => exportAsPNG('avatar-canvas', 'avatar.png'),
  },
  {
    id: 'svg',
    label: 'SVG Vector',
    desc: 'Infinitely scalable vector',
    icon: ImageIcon,
    color: '#22C55E',
    action: () => exportAsSVG('avatar-svg', 'avatar.svg'),
  },
  {
    id: 'gif',
    label: 'Animated GIF',
    desc: 'With idle animations (coming soon)',
    icon: Film,
    color: '#F59E0B',
    action: () => exportAsGIF('avatar-canvas', 'avatar.gif'),
  },
  {
    id: 'sticker',
    label: 'Sticker Pack',
    desc: 'Square format for messaging apps',
    icon: Sticker,
    color: '#EC4899',
    action: () => exportAsSticker('avatar-canvas'),
  },
];

export default function ExportModal({ open, onClose }: ExportModalProps) {
  const { setExporting } = useAvatarStore();

  const handleExport = async (action: () => Promise<void>) => {
    setExporting(true);
    try {
      await action();
    } finally {
      setExporting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 rounded-3xl p-5 border border-white/15 shadow-2xl"
            style={{ background: 'rgba(12,12,24,0.95)', backdropFilter: 'blur(30px)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Export Avatar</h2>
                <p className="text-xs text-white/40">Choose your format</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-all"
              >
                <X size={13} className="text-white/70" />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleExport(opt.action)}
                    className="flex flex-col items-start gap-2 p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: opt.color + '25', border: `1px solid ${opt.color}40` }}
                    >
                      <Icon size={16} style={{ color: opt.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{opt.label}</div>
                      <div className="text-[10px] text-white/40 leading-tight mt-0.5">{opt.desc}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-center text-[10px] text-white/25 mt-4">
              Your avatar is unique ✦ Share it everywhere
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
