import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import ColorPicker from '../UI/ColorPicker';
import NumberSelector from '../UI/NumberSelector';
import Section from '../UI/Section';
import { CLOTHING_TOP_NAMES } from '../../data/avatarData';

const categories = [
  { id: 'casual', label: 'Casual', emoji: '👕' },
  { id: 'streetwear', label: 'Street', emoji: '🧥' },
  { id: 'business', label: 'Business', emoji: '👔' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🧙' },
];

const clothingColors = [
  '#4A90D9', '#E53935', '#43A047', '#FB8C00', '#8E24AA',
  '#00ACC1', '#F4511E', '#1E88E5', '#FFD600', '#6D4C41',
  '#546E7A', '#1a1a1a', '#EEEEEE', '#F06292', '#26A69A',
];

export default function ClothingStep() {
  const { avatar, setAvatar } = useAvatarStore();
  const topNames = CLOTHING_TOP_NAMES[avatar.clothingCategory] || CLOTHING_TOP_NAMES.casual;

  return (
    <div className="space-y-5">
      <Section title="Style Category">
        <OptionGrid
          options={categories}
          value={avatar.clothingCategory}
          onChange={(v) => {
            setAvatar({ clothingCategory: v as typeof avatar.clothingCategory, clothingTop: 0 });
          }}
          cols={4}
        />
      </Section>

      <Section title="Top">
        <NumberSelector
          label="Style"
          value={avatar.clothingTop}
          max={topNames.length - 1}
          names={topNames}
          onChange={(v) => setAvatar({ clothingTop: v as number })}
        />
      </Section>

      <Section title="Color">
        <ColorPicker
          label="Clothing Color"
          value={avatar.clothingColor}
          onChange={(c) => setAvatar({ clothingColor: c })}
          presets={clothingColors}
        />
      </Section>
    </div>
  );
}
