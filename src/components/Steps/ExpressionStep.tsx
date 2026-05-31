import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import Section from '../UI/Section';

const expressions = [
  { id: 'happy', label: 'Happy', emoji: '😄' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'laughing', label: 'Laughing', emoji: '😂' },
  { id: 'confused', label: 'Confused', emoji: '😕' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'focused', label: 'Focused', emoji: '🎯' },
  { id: 'sleepy', label: 'Sleepy', emoji: '😴' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
];

const backgrounds = [
  { id: 'gradient-purple', label: 'Aurora', emoji: '🌌' },
  { id: 'gradient-blue', label: 'Ocean', emoji: '🌊' },
  { id: 'gradient-pink', label: 'Sunset', emoji: '🌅' },
  { id: 'gradient-green', label: 'Forest', emoji: '🌲' },
  { id: 'gradient-orange', label: 'Ember', emoji: '🔥' },
  { id: 'solid-white', label: 'White', emoji: '⬜' },
  { id: 'solid-black', label: 'Dark', emoji: '⬛' },
  { id: 'city', label: 'City', emoji: '🏙️' },
  { id: 'nature', label: 'Nature', emoji: '🍀' },
  { id: 'space', label: 'Space', emoji: '🚀' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🧚' },
];

export default function ExpressionStep() {
  const { avatar, setAvatar } = useAvatarStore();

  return (
    <div className="space-y-5">
      <Section title="Expression">
        <OptionGrid
          options={expressions}
          value={avatar.expression}
          onChange={(v) => setAvatar({ expression: v as typeof avatar.expression })}
          cols={4}
        />
      </Section>

      <Section title="Background">
        <OptionGrid
          options={backgrounds}
          value={avatar.background}
          onChange={(v) => setAvatar({ background: v as typeof avatar.background })}
          cols={4}
        />
      </Section>
    </div>
  );
}
