import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import ColorPicker from '../UI/ColorPicker';
import Slider from '../UI/Slider';
import Section from '../UI/Section';
import NumberSelector from '../UI/NumberSelector';
import { EYE_COLORS, EYEBROW_STYLE_NAMES } from '../../data/avatarData';
import { motion } from 'framer-motion';

const eyeShapes = [
  { id: 'almond', label: 'Almond', emoji: '👁️' },
  { id: 'round', label: 'Round', emoji: '🔵' },
  { id: 'hooded', label: 'Hooded', emoji: '😑' },
  { id: 'monolid', label: 'Monolid', emoji: '🌕' },
  { id: 'wide', label: 'Wide', emoji: '😲' },
];

const lashStyles = [
  { id: 'none', label: 'None', emoji: '—' },
  { id: 'natural', label: 'Natural', emoji: '✨' },
  { id: 'long', label: 'Long', emoji: '🌟' },
  { id: 'dramatic', label: 'Dramatic', emoji: '⭐' },
];

export default function EyesStep() {
  const { avatar, setAvatar } = useAvatarStore();

  return (
    <div className="space-y-5">
      <Section title="Eye Shape">
        <OptionGrid
          options={eyeShapes}
          value={avatar.eyeShape}
          onChange={(v) => setAvatar({ eyeShape: v as typeof avatar.eyeShape })}
          cols={5}
        />
      </Section>

      <Section title="Eye Color">
        <div className="flex flex-wrap gap-2">
          {EYE_COLORS.map((c) => (
            <motion.button
              key={c.value}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAvatar({ eyeColor: c.value })}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  background: c.value,
                  borderColor: avatar.eyeColor === c.value ? 'white' : 'transparent',
                  boxShadow: avatar.eyeColor === c.value ? `0 0 10px ${c.value}` : 'none',
                }}
              />
              <span className="text-[9px] text-white/40">{c.label}</span>
            </motion.button>
          ))}
          <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
              <input
                type="color"
                value={avatar.eyeColor}
                onChange={(e) => setAvatar({ eyeColor: e.target.value })}
                className="absolute inset-0 w-12 h-12 -translate-x-1 -translate-y-1 cursor-pointer"
              />
            </div>
            <span className="text-[9px] text-white/40">Custom</span>
          </motion.div>
        </div>
      </Section>

      <Section title="Eyelashes">
        <OptionGrid
          options={lashStyles}
          value={avatar.eyelashes}
          onChange={(v) => setAvatar({ eyelashes: v as typeof avatar.eyelashes })}
          cols={4}
        />
      </Section>

      <Section title="Eyebrows">
        <NumberSelector
          label="Style"
          value={avatar.eyebrowStyle}
          max={9}
          names={EYEBROW_STYLE_NAMES}
          onChange={(v) => setAvatar({ eyebrowStyle: v as number })}
        />
        <Slider
          label="Thickness"
          value={avatar.eyebrowThickness}
          onChange={(v) => setAvatar({ eyebrowThickness: v })}
          leftLabel="Thin"
          rightLabel="Thick"
        />
        <Slider
          label="Tilt"
          value={avatar.eyebrowRotation + 30}
          min={0}
          max={60}
          onChange={(v) => setAvatar({ eyebrowRotation: v - 30 })}
          leftLabel="Down"
          rightLabel="Up"
        />
        <ColorPicker
          label="Brow Color"
          value={avatar.eyebrowColor}
          onChange={(c) => setAvatar({ eyebrowColor: c })}
        />
      </Section>
    </div>
  );
}
