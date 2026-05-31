import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/40">{title}</h3>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}
