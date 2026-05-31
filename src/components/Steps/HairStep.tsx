import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import ColorPicker from '../UI/ColorPicker';
import Slider from '../UI/Slider';
import Section from '../UI/Section';
import NumberSelector from '../UI/NumberSelector';
import { HAIR_STYLE_NAMES } from '../../data/avatarData';

const facialHairStyles = [
  { id: 'none', label: 'None', emoji: '✖️' },
  { id: 'stubble', label: 'Stubble', emoji: '🧔' },
  { id: 'mustache', label: 'Mustache', emoji: '👨' },
  { id: 'goatee', label: 'Goatee', emoji: '🧔‍♂️' },
  { id: 'beard', label: 'Beard', emoji: '🎅' },
];

const hairColorPresets = [
  '#1a1a1a', '#3D2314', '#5A3825', '#8B6914', '#B5934A',
  '#D4A853', '#F0C040', '#E85858', '#2E3D6B', '#2D5A27',
  '#CCCCCC', '#F5F5F5', '#8B2FC9', '#C92F5A', '#2FC9B8',
];

export default function HairStep() {
  const { avatar, setAvatar } = useAvatarStore();

  return (
    <div className="space-y-5">
      <Section title="Hairstyle">
        <NumberSelector
          label="Style"
          value={avatar.hairStyle}
          max={14}
          names={HAIR_STYLE_NAMES}
          onChange={(v) => setAvatar({ hairStyle: v as number })}
        />
      </Section>

      <Section title="Hair Color">
        <ColorPicker
          label="Primary Color"
          value={avatar.hairColor}
          onChange={(c) => setAvatar({ hairColor: c })}
          presets={hairColorPresets}
        />
        <ColorPicker
          label="Highlights"
          value={avatar.hairHighlights === 'transparent' ? '#CCCCCC' : avatar.hairHighlights}
          onChange={(c) => setAvatar({ hairHighlights: c })}
          presets={hairColorPresets}
        />
        <Slider
          label="Shine"
          value={avatar.hairShine}
          onChange={(v) => setAvatar({ hairShine: v })}
          leftLabel="Matte"
          rightLabel="Glossy"
        />
      </Section>

      <Section title="Facial Hair">
        <OptionGrid
          options={facialHairStyles}
          value={avatar.facialHair}
          onChange={(v) => setAvatar({ facialHair: v as typeof avatar.facialHair })}
          cols={5}
        />
        {avatar.facialHair !== 'none' && (
          <>
            <ColorPicker
              label="Beard Color"
              value={avatar.facialHairColor}
              onChange={(c) => setAvatar({ facialHairColor: c })}
              presets={hairColorPresets}
            />
            <Slider
              label="Density"
              value={avatar.facialHairDensity}
              onChange={(v) => setAvatar({ facialHairDensity: v })}
              leftLabel="Light"
              rightLabel="Dense"
            />
          </>
        )}
      </Section>
    </div>
  );
}
