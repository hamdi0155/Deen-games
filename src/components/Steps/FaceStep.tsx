import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import Slider from '../UI/Slider';
import Section from '../UI/Section';

const faceShapes = [
  { id: 'oval', label: 'Oval', emoji: '🥚' },
  { id: 'round', label: 'Round', emoji: '⭕' },
  { id: 'square', label: 'Square', emoji: '⬜' },
  { id: 'diamond', label: 'Diamond', emoji: '💎' },
  { id: 'heart', label: 'Heart', emoji: '♥️' },
  { id: 'rectangle', label: 'Rectangle', emoji: '▬' },
];

export default function FaceStep() {
  const { avatar, setAvatar } = useAvatarStore();

  return (
    <div className="space-y-5">
      <Section title="Face Shape">
        <OptionGrid
          options={faceShapes}
          value={avatar.faceShape}
          onChange={(v) => setAvatar({ faceShape: v as typeof avatar.faceShape })}
          cols={3}
        />
      </Section>

      <Section title="Facial Features">
        <Slider
          label="Jawline"
          value={avatar.jawline}
          onChange={(v) => setAvatar({ jawline: v })}
          leftLabel="Soft"
          rightLabel="Sharp"
        />
        <Slider
          label="Cheeks"
          value={avatar.cheeks}
          onChange={(v) => setAvatar({ cheeks: v })}
          leftLabel="Slim"
          rightLabel="Full"
        />
        <Slider
          label="Chin"
          value={avatar.chin}
          onChange={(v) => setAvatar({ chin: v })}
          leftLabel="Small"
          rightLabel="Strong"
        />
      </Section>
    </div>
  );
}
