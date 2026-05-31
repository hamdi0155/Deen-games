import { motion } from 'framer-motion';
import { SKIN_TONES } from '../../data/avatarData';

interface SkinPaletteProps {
  value: string;
  onChange: (tone: string) => void;
}

export default function SkinPalette({ value, onChange }: SkinPaletteProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-white/70">Skin Tone</span>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-black/20 border border-white/8">
        {SKIN_TONES.map((tone) => (
          <motion.button
            key={tone}
            onClick={() => onChange(tone)}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            className="relative w-7 h-7 rounded-full transition-all duration-150"
            style={{
              background: tone,
              boxShadow: value === tone
                ? `0 0 0 2px white, 0 0 12px ${tone}`
                : `inset 0 1px 2px rgba(255,255,255,0.3)`,
              border: value === tone ? '2px solid white' : '2px solid transparent',
            }}
          />
        ))}
      </div>
    </div>
  );
}
