import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import SkinPalette from '../UI/SkinPalette';
import Section from '../UI/Section';

const bodyTypes = [
  { id: 'slim', label: 'Slim', emoji: '🧍' },
  { id: 'athletic', label: 'Athletic', emoji: '💪' },
  { id: 'average', label: 'Average', emoji: '🙂' },
  { id: 'heavy', label: 'Heavy', emoji: '🫀' },
];

const ages = [
  { id: 'child', label: 'Child', emoji: '🧒' },
  { id: 'teen', label: 'Teen', emoji: '👦' },
  { id: 'young-adult', label: 'Young Adult', emoji: '🧑' },
  { id: 'adult', label: 'Adult', emoji: '👨' },
  { id: 'mature', label: 'Mature', emoji: '🧓' },
];

export default function BodyStep() {
  const { avatar, setAvatar } = useAvatarStore();

  return (
    <div className="space-y-5">
      <Section title="Body Type">
        <OptionGrid
          options={bodyTypes}
          value={avatar.bodyType}
          onChange={(v) => setAvatar({ bodyType: v as typeof avatar.bodyType })}
          cols={4}
        />
      </Section>

      <Section title="Age Appearance">
        <OptionGrid
          options={ages}
          value={avatar.ageAppearance}
          onChange={(v) => setAvatar({ ageAppearance: v as typeof avatar.ageAppearance })}
          cols={5}
        />
      </Section>

      <Section title="Skin Tone">
        <SkinPalette value={avatar.skinTone} onChange={(t) => setAvatar({ skinTone: t })} />
      </Section>
    </div>
  );
}
