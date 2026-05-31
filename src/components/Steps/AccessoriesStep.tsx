import { useAvatarStore } from '../../store/avatarStore';
import OptionGrid from '../UI/OptionGrid';
import NumberSelector from '../UI/NumberSelector';
import Section from '../UI/Section';
import { GLASSES_NAMES, HAT_NAMES } from '../../data/avatarData';

const fantasyOptions = [
  { id: 'none', label: 'None', emoji: '✖️' },
  { id: 'halo', label: 'Halo', emoji: '😇' },
  { id: 'horns', label: 'Horns', emoji: '😈' },
  { id: 'wings', label: 'Wings', emoji: '🕊️' },
  { id: 'crown', label: 'Crown', emoji: '👑' },
];

export default function AccessoriesStep() {
  const { avatar, setAvatar } = useAvatarStore();

  return (
    <div className="space-y-5">
      <Section title="Glasses">
        <NumberSelector
          label="Style"
          value={avatar.glasses}
          max={9}
          names={GLASSES_NAMES}
          onChange={(v) => setAvatar({ glasses: v as number })}
          noneLabel="No Glasses"
        />
      </Section>

      <Section title="Hat">
        <NumberSelector
          label="Style"
          value={avatar.hat}
          max={9}
          names={HAT_NAMES}
          onChange={(v) => setAvatar({ hat: v as number })}
          noneLabel="No Hat"
        />
      </Section>

      <Section title="Earrings">
        <NumberSelector
          label="Style"
          value={avatar.earrings}
          max={4}
          names={['Studs', 'Hoops', 'Drops', 'Cuffs', 'Dangles']}
          onChange={(v) => setAvatar({ earrings: v as number })}
          noneLabel="None"
        />
      </Section>

      <Section title="Fantasy Accessories">
        <OptionGrid
          options={fantasyOptions}
          value={avatar.fantasyAcc}
          onChange={(v) => setAvatar({ fantasyAcc: v as typeof avatar.fantasyAcc })}
          cols={5}
        />
      </Section>
    </div>
  );
}
