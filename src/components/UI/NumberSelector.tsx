import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NumberSelectorProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  names?: string[];
  onChange: (v: number) => void;
  noneLabel?: string;
}

export default function NumberSelector({
  label, value, min = 0, max, names, onChange, noneLabel,
}: NumberSelectorProps) {
  const maxVal = max ?? (names ? names.length - 1 : 10);
  const displayMin = noneLabel !== undefined ? -1 : min;
  const displayName = value === -1 ? noneLabel ?? 'None' : names ? names[value % names.length] : `${value + 1}`;

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-white/70">{label}</span>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(displayMin, value - 1))}
          disabled={value <= displayMin}
          className="w-8 h-8 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center hover:bg-white/15 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={14} className="text-white/70" />
        </motion.button>
        <div className="flex-1 text-center py-2 px-3 rounded-lg bg-black/20 border border-white/8">
          <span className="text-sm text-white/90 font-medium">{displayName}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(maxVal, value + 1))}
          disabled={value >= maxVal}
          className="w-8 h-8 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center hover:bg-white/15 disabled:opacity-30 transition-all"
        >
          <ChevronRight size={14} className="text-white/70" />
        </motion.button>
      </div>
    </div>
  );
}
