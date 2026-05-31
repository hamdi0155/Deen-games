import type { AvatarState } from '../types/avatar.types';
import { SKIN_TONES } from '../data/avatarData';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHex(): string {
  const h = () => rand(0, 255).toString(16).padStart(2, '0');
  return `#${h()}${h()}${h()}`;
}

const hairColors = [
  '#3D2314', '#5A3825', '#8B6914', '#B5934A', '#D4A853',
  '#F0C040', '#E85858', '#2E3D6B', '#2D5A27', '#1A1A1A',
  '#CCCCCC', '#F5F5F5', '#8B2FC9', '#C92F5A', '#2FC9B8',
];

const lipColors = [
  '#D4857A', '#C06060', '#E8A0A0', '#B05050', '#E86070',
  '#8B3A3A', '#F0B0B0', '#D46080', '#A03050',
];

export function randomizeAvatar(): AvatarState {
  const skinTone = pick(SKIN_TONES);
  const hairColor = pick(hairColors);

  return {
    bodyType: pick(['slim', 'athletic', 'average', 'heavy']),
    ageAppearance: pick(['teen', 'young-adult', 'adult', 'mature']),
    skinTone,
    faceShape: pick(['oval', 'round', 'square', 'diamond', 'heart', 'rectangle']),
    jawline: rand(20, 80),
    cheeks: rand(20, 80),
    chin: rand(20, 80),
    eyeShape: pick(['almond', 'round', 'hooded', 'monolid', 'wide']),
    eyeColor: pick(['#6B4226', '#3D2314', '#8B6914', '#2E6BA8', '#3E7D44', '#7A8694', '#7B5EA7', '#C17C2E']),
    eyelashes: pick(['none', 'natural', 'long', 'dramatic']),
    eyebrowStyle: rand(0, 9),
    eyebrowThickness: rand(30, 80),
    eyebrowRotation: rand(-20, 20),
    eyebrowColor: hairColor,
    hairStyle: rand(0, 14),
    hairColor,
    hairHighlights: Math.random() > 0.6 ? pick(hairColors) : 'transparent',
    hairShine: rand(30, 90),
    facialHair: pick(['none', 'none', 'none', 'stubble', 'mustache', 'goatee', 'beard']),
    facialHairColor: hairColor,
    facialHairDensity: rand(30, 90),
    noseShape: pick(['small', 'medium', 'large', 'wide', 'narrow', 'button']),
    noseWidth: rand(30, 70),
    noseHeight: rand(30, 70),
    mouthExpression: pick(['smile', 'neutral', 'serious', 'smirk', 'happy']),
    lipThickness: rand(30, 75),
    lipColor: pick(lipColors),
    glasses: Math.random() > 0.6 ? rand(0, 9) : -1,
    hat: Math.random() > 0.7 ? rand(0, 9) : -1,
    earrings: Math.random() > 0.7 ? rand(0, 4) : -1,
    necklace: Math.random() > 0.8 ? rand(0, 3) : -1,
    fantasyAcc: pick(['none', 'none', 'none', 'none', 'halo', 'horns', 'wings', 'crown']),
    clothingTop: rand(0, 4),
    clothingColor: randomHex(),
    clothingCategory: pick(['casual', 'streetwear', 'business', 'sports', 'luxury', 'gaming', 'fantasy']),
    expression: pick(['happy', 'excited', 'laughing', 'confused', 'angry', 'focused', 'sleepy', 'sad']),
    background: pick([
      'gradient-purple', 'gradient-blue', 'gradient-pink', 'gradient-green',
      'gradient-orange', 'city', 'nature', 'space', 'fantasy',
    ]),
  };
}
