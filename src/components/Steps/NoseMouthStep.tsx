import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import ColorPicker from '../UI/ColorPicker';
import Slider from '../UI/Slider';
import Section from '../UI/Section';

const noseShapes = [
  { id: 'small', label: 'Small', emoji: '🔹' },
  { id: 'medium', label: 'Medium', emoji: '🔸' },
  { id: 'large', label: 'Large', emoji: '🔺' },
  { id: 'wide', label: 'Wide', emoji: '◀▶' },
  { id: 'narrow', label: 'Narrow', emoji: '▲' },
  { id: 'button', label: 'Button', emoji: '🔘' },
];

const mouthExpressions = [
  { id: 'smile', label: 'Smile', emoji: '😊' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'serious', label: 'Serious', emoji: '😑' },
  { id: 'smirk', label: 'Smirk', emoji: '😏' },
  { id: 'happy', label: 'Happy', emoji: '😁' },
];

const lipColorPresets = [
  '#D4857A', '#C06060', '#E8A0A0', '#B05050', '#E86070',
  '#8B3A3A', '#F0B0B0', '#D46080', '#A03050', '#FF7070',
  '#CC4444', '#FF9999', '#BB2244', '#992222', '#FFB5B5',
];

export default function NoseMouthStep() {
  const { avatar, setAvatar } = useAvatarStore();

  return (
    <div className="space-y-5">
      <Section title="Nose Shape">
        <OptionGrid
          options={noseShapes}
          value={avatar.noseShape}
          onChange={(v) => setAvatar({ noseShape: v as typeof avatar.noseShape })}
          cols={3}
        />
      </Section>

      <Section title="Nose Proportions">
        <Slider
          label="Width"
          value={avatar.noseWidth}
          onChange={(v) => setAvatar({ noseWidth: v })}
          leftLabel="Narrow"
          rightLabel="Wide"
        />
        <Slider
          label="Height"
          value={avatar.noseHeight}
          onChange={(v) => setAvatar({ noseHeight: v })}
          leftLabel="Low"
          rightLabel="High"
        />
      </Section>

      <Section title="Mouth Expression">
        <OptionGrid
          options={mouthExpressions}
          value={avatar.mouthExpression}
          onChange={(v) => setAvatar({ mouthExpression: v as typeof avatar.mouthExpression })}
          cols={5}
        />
      </Section>

      <Section title="Lips">
        <Slider
          label="Thickness"
          value={avatar.lipThickness}
          onChange={(v) => setAvatar({ lipThickness: v })}
          leftLabel="Thin"
          rightLabel="Full"
        />
        <ColorPicker
          label="Lip Color"
          value={avatar.lipColor}
          onChange={(c) => setAvatar({ lipColor: c })}
          presets={lipColorPresets}
        />
      </Section>
    </div>
  );
}
