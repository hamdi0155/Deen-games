import { useState } from 'react';
import { motion } from 'framer-motion';
import { Undo2, Redo2, RotateCcw, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAvatarStore } from '../../store/avatarStore';
import type { Step } from '../../types/avatar.types';
import ExportModal from './ExportModal';

const STEP_ORDER: Step[] = ['body', 'face', 'eyes', 'hair', 'nose-mouth', 'accessories', 'clothing', 'expression'];

export default function BottomBar() {
  const { currentStep, setStep, undo, redo, canUndo, canRedo, randomize } = useAvatarStore();
  const [exportOpen, setExportOpen] = useState(false);

  const idx = STEP_ORDER.indexOf(currentStep as Step);
  const hasPrev = idx > 0;
  const hasNext = idx < STEP_ORDER.length - 1;

  return (
    <>
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />

      <div className="flex items-center gap-2 px-4 py-3">
        {/* History */}
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={undo}
            disabled={!canUndo()}
            title="Undo"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/6 border border-white/10 hover:bg-white/12 disabled:opacity-25 transition-all"
          >
            <Undo2 size={13} className="text-white/70" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={redo}
            disabled={!canRedo()}
            title="Redo"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/6 border border-white/10 hover:bg-white/12 disabled:opacity-25 transition-all"
          >
            <Redo2 size={13} className="text-white/70" />
          </motion.button>
        </div>

        {/* Surprise Me */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={randomize}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-400/25 hover:bg-purple-500/25 transition-all"
        >
          <RotateCcw size={12} className="text-purple-300" />
          <span className="text-xs text-purple-200 font-medium">Surprise Me</span>
        </motion.button>

        <div className="flex-1" />

        {/* Step navigation */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => hasPrev && setStep(STEP_ORDER[idx - 1])}
            disabled={!hasPrev}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/6 border border-white/10 hover:bg-white/12 disabled:opacity-25 transition-all text-xs text-white/60"
          >
            <ChevronLeft size={13} />
            <span className="hidden sm:inline">Back</span>
          </motion.button>

          {/* Step dots */}
          <div className="flex items-center gap-1 px-2">
            {STEP_ORDER.map((s, i) => (
              <motion.button
                key={s}
                onClick={() => setStep(s)}
                whileTap={{ scale: 0.8 }}
                className="transition-all duration-300"
                style={{
                  width: currentStep === s ? 16 : 5,
                  height: 5,
                  borderRadius: 999,
                  background: currentStep === s
                    ? '#5b6ef5'
                    : i < idx ? '#4ade80' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {hasNext ? (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setStep(STEP_ORDER[idx + 1])}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-xs text-white font-semibold transition-all shadow-lg shadow-brand-500/30"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={13} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setExportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 transition-all"
            >
              <Download size={12} className="text-green-300" />
              <span className="text-xs text-green-200 font-semibold">Export</span>
            </motion.button>
          )}
        </div>

        {/* Export button (always visible on last step) */}
        {hasNext && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setExportOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/6 border border-white/10 hover:bg-white/12 transition-all"
            title="Export"
          >
            <Download size={13} className="text-white/50" />
          </motion.button>
        )}
      </div>
    </>
  );
}
