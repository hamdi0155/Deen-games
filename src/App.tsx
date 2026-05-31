import { AnimatePresence, motion } from 'framer-motion';
import { useAvatarStore } from './store/avatarStore';
import WelcomeStep from './components/Steps/WelcomeStep';
import StudioLayout from './components/Layout/StudioLayout';

export default function App() {
  const { showWelcome } = useAvatarStore();

  return (
    <div className="h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #05050f 0%, #0d0d1e 100%)' }}>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <WelcomeStep />
          </motion.div>
        ) : (
          <motion.div
            key="studio"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full"
          >
            <StudioLayout />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
