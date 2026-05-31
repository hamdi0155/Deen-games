import { AnimatePresence, motion } from 'framer-motion';
import { useAvatarStore } from '../../store/avatarStore';
import BodyStep from '../Steps/BodyStep';
import FaceStep from '../Steps/FaceStep';
import EyesStep from '../Steps/EyesStep';
import HairStep from '../Steps/HairStep';
import NoseMouthStep from '../Steps/NoseMouthStep';
import AccessoriesStep from '../Steps/AccessoriesStep';
import ClothingStep from '../Steps/ClothingStep';
import ExpressionStep from '../Steps/ExpressionStep';

const STEP_LABELS: Record<string, string> = {
  body: 'Body & Skin',
  face: 'Face Shape',
  eyes: 'Eyes & Brows',
  hair: 'Hair Style',
  'nose-mouth': 'Nose & Mouth',
  accessories: 'Accessories',
  clothing: 'Clothing',
  expression: 'Expression & Background',
};

export default function RightPanel() {
  const { currentStep } = useAvatarStore();

  const stepContent: Record<string, JSX.Element> = {
    body: <BodyStep />,
    face: <FaceStep />,
    eyes: <EyesStep />,
    hair: <HairStep />,
    'nose-mouth': <NoseMouthStep />,
    accessories: <AccessoriesStep />,
    clothing: <ClothingStep />,
    expression: <ExpressionStep />,
  };

  const content = stepContent[currentStep];
  if (!content) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h2 className="text-sm font-semibold text-white/90">{STEP_LABELS[currentStep]}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
