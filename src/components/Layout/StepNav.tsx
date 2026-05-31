import { motion } from 'framer-motion';
import { useAvatarStore } from '../../store/avatarStore';
import type { Step } from '../../types/avatar.types';
// icons are emoji-based, no lucide needed here

interface StepMeta {
  id: Step;
  label: string;
  emoji: string;
}

const STEPS: StepMeta[] = [
  { id: 'body', label: 'Body', emoji: '🧍' },
  { id: 'face', label: 'Face', emoji: '😊' },
  { id: 'eyes', label: 'Eyes', emoji: '👁️' },
  { id: 'hair', label: 'Hair', emoji: '💇' },
  { id: 'nose-mouth', label: 'Features', emoji: '👃' },
  { id: 'accessories', label: 'Extras', emoji: '💎' },
  { id: 'clothing', label: 'Outfit', emoji: '👕' },
  { id: 'expression', label: 'Vibe', emoji: '✨' },
];

const STEP_ORDER: Step[] = STEPS.map((s) => s.id);

export default function StepNav() {
  const { currentStep, setStep } = useAvatarStore();
  const currentIndex = STEP_ORDER.indexOf(currentStep as Step);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {STEPS.map((step, i) => {
        const isActive = currentStep === step.id;
        const isDone = i < currentIndex;

        return (
          <motion.button
            key={step.id}
            onClick={() => setStep(step.id)}
            whileTap={{ scale: 0.94 }}
            className={`
              relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 shrink-0
              ${isActive
                ? 'bg-brand-500/30 border border-brand-400/50 text-white shadow-lg shadow-brand-500/20'
                : isDone
                  ? 'bg-white/8 border border-green-500/20 text-white/60 hover:text-white/80'
                  : 'bg-transparent border border-transparent text-white/30 hover:text-white/50'
              }
            `}
          >
            <span className="text-base leading-none">{step.emoji}</span>
            <span className="text-[9px] font-medium whitespace-nowrap">{step.label}</span>
            {isDone && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
