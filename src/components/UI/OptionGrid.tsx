import { motion } from 'framer-motion';

interface Option {
  id: string | number;
  label: string;
  icon?: string;
  emoji?: string;
}

interface OptionGridProps {
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (id: string | number) => void;
  cols?: 2 | 3 | 4 | 5;
}

export default function OptionGrid({ label, options, value, onChange, cols = 3 }: OptionGridProps) {
  const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' }[cols];

  return (
    <div className="space-y-2">
      {label && <span className="text-xs font-medium text-white/70">{label}</span>}
      <div className={`grid ${colClass} gap-2`}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              whileTap={{ scale: 0.93 }}
              className={`
                relative flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl
                border text-xs font-medium transition-all duration-200 min-h-[52px]
                ${active
                  ? 'bg-brand-500/25 border-brand-400/60 text-white shadow-lg shadow-brand-500/20'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80 hover:border-white/20'
                }
              `}
            >
              {opt.emoji && <span className="text-lg leading-none">{opt.emoji}</span>}
              {opt.icon && <span className="text-base leading-none">{opt.icon}</span>}
              <span className="leading-tight text-center">{opt.label}</span>
              {active && (
                <motion.div
                  layoutId="optionHighlight"
                  className="absolute inset-0 rounded-xl ring-1 ring-brand-400/60"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
