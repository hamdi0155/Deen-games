import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  '#1a1a1a', '#3D2314', '#5A3825', '#8B6914', '#B5934A',
  '#F0C040', '#E85858', '#2E3D6B', '#2D5A27', '#CCCCCC',
  '#F5F5F5', '#8B2FC9', '#C92F5A', '#2FC9B8', '#FF6B35',
];

export default function ColorPicker({ label, value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/70">{label}</span>
        <motion.button
          onClick={() => setShowPicker(!showPicker)}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/15 transition-all"
        >
          <div className="w-4 h-4 rounded-full border border-white/30 shadow-inner" style={{ background: value }} />
          <span className="text-xs font-mono text-white/60">{value}</span>
          <Pipette size={11} className="text-white/40" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-3">
              {/* Preset swatches */}
              <div className="flex flex-wrap gap-2">
                {presets.map((c) => (
                  <motion.button
                    key={c}
                    onClick={() => onChange(c)}
                    whileTap={{ scale: 0.9 }}
                    className="w-7 h-7 rounded-full border-2 transition-all"
                    style={{
                      background: c,
                      borderColor: value === c ? 'white' : 'transparent',
                      boxShadow: value === c ? `0 0 8px ${c}` : 'none',
                    }}
                  />
                ))}
              </div>
              {/* Native color input */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value.startsWith('#') && value.length === 7 ? value : '#000000'}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-white/50">Custom color</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
