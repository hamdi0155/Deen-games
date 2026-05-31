import type { AvatarState, Rarity } from '../types/avatar.types';

export const SKIN_TONES = [
  // Light tones
  '#FDDBB4', '#F5C5A3', '#F0B48E', '#ECA87A', '#E89B6A',
  '#E49060', '#DE8555', '#D97A4A', '#D06E40', '#C46238',
  // Medium tones
  '#B85A30', '#A95228', '#9A4A22', '#8C421C', '#7D3A16',
  '#6E3210', '#5F2A0C', '#502208', '#411A04', '#3C1802',
  // Warm tones
  '#F8D5B0', '#F2C49A', '#EDB385', '#E8A270', '#E3915C',
  // Cool tones
  '#F0CEB8', '#EABDA3', '#E3AC8F', '#DC9B7A', '#D58B66',
  // Deeper tones
  '#C67A55', '#B86944', '#A95933', '#9A4A25', '#8B3B18',
];

export const DEFAULT_AVATAR: AvatarState = {
  bodyType: 'average',
  ageAppearance: 'young-adult',
  skinTone: '#F5C5A3',
  faceShape: 'oval',
  jawline: 50,
  cheeks: 50,
  chin: 50,
  eyeShape: 'almond',
  eyeColor: '#6B4226',
  eyelashes: 'natural',
  eyebrowStyle: 0,
  eyebrowThickness: 50,
  eyebrowRotation: 0,
  eyebrowColor: '#3D2314',
  hairStyle: 2,
  hairColor: '#3D2314',
  hairHighlights: 'transparent',
  hairShine: 50,
  facialHair: 'none',
  facialHairColor: '#3D2314',
  facialHairDensity: 50,
  noseShape: 'medium',
  noseWidth: 50,
  noseHeight: 50,
  mouthExpression: 'smile',
  lipThickness: 50,
  lipColor: '#D4857A',
  glasses: -1,
  hat: -1,
  earrings: -1,
  necklace: -1,
  fantasyAcc: 'none',
  clothingTop: 0,
  clothingColor: '#4A90D9',
  clothingCategory: 'casual',
  expression: 'happy',
  background: 'gradient-purple',
};

export const HAIR_STYLE_NAMES = [
  'Buzz Cut', 'Crew Cut', 'Messy Top', 'Side Part', 'Quiff',
  'Slick Back', 'Curly Short', 'Wavy Medium', 'Long Straight', 'Braids',
  'Bun', 'Ponytail', 'Bob', 'Dreadlocks', 'Afro',
];

export const EYE_COLORS = [
  { label: 'Brown', value: '#6B4226' },
  { label: 'Dark Brown', value: '#3D2314' },
  { label: 'Hazel', value: '#8B6914' },
  { label: 'Amber', value: '#C17C2E' },
  { label: 'Blue', value: '#2E6BA8' },
  { label: 'Light Blue', value: '#5B9FD1' },
  { label: 'Green', value: '#3E7D44' },
  { label: 'Gray', value: '#7A8694' },
  { label: 'Violet', value: '#7B5EA7' },
];

export const EYEBROW_STYLE_NAMES = [
  'Natural', 'Arched', 'Straight', 'Rounded', 'Peaked',
  'Bushy', 'Thin', 'Angled', 'Curved', 'Bold',
];

export const GLASSES_NAMES = [
  'Classic Round', 'Rectangle', 'Cat Eye', 'Aviator', 'Wayfarer',
  'Oval', 'Geometric', 'Half Rim', 'Rimless', 'Sport',
];

export const HAT_NAMES = [
  'Baseball Cap', 'Beanie', 'Snapback', 'Fedora', 'Bucket Hat',
  'Cowboy', 'Beret', 'Straw Hat', 'Crown', 'Viking Helmet',
];

export const CLOTHING_TOP_NAMES: Record<string, string[]> = {
  casual: ['T-Shirt', 'Hoodie', 'Tank Top', 'Polo', 'Crewneck'],
  streetwear: ['Oversized Tee', 'Graphic Hoodie', 'Windbreaker', 'Jersey', 'Bomber'],
  business: ['Dress Shirt', 'Blazer', 'Vest', 'Turtleneck', 'Suit Jacket'],
  sports: ['Jersey', 'Training Top', 'Tank', 'Track Jacket', 'Compression'],
  luxury: ['Silk Shirt', 'Designer Knit', 'Cashmere', 'Linen Blazer', 'Tailored'],
  gaming: ['Gaming Tee', 'Esports Jersey', 'Streamer Hoodie', 'Clan Jacket', 'Retro Tee'],
  fantasy: ['Robe', 'Armor', 'Cape', 'Battle Vest', 'Mage Coat'],
};

export const BACKGROUND_OPTIONS = [
  { id: 'gradient-purple', label: 'Aurora', colors: ['#667eea', '#764ba2'] },
  { id: 'gradient-blue', label: 'Ocean', colors: ['#4facfe', '#00f2fe'] },
  { id: 'gradient-pink', label: 'Sunset', colors: ['#f093fb', '#f5576c'] },
  { id: 'gradient-green', label: 'Forest', colors: ['#43e97b', '#38f9d7'] },
  { id: 'gradient-orange', label: 'Ember', colors: ['#fa709a', '#fee140'] },
  { id: 'solid-white', label: 'White', colors: ['#ffffff', '#f0f0f0'] },
  { id: 'solid-black', label: 'Midnight', colors: ['#0f0f1a', '#1a1a2e'] },
  { id: 'city', label: 'City', colors: ['#373B44', '#4286f4'] },
  { id: 'nature', label: 'Nature', colors: ['#134e5e', '#71b280'] },
  { id: 'space', label: 'Space', colors: ['#0f0c29', '#302b63'] },
  { id: 'fantasy', label: 'Fantasy', colors: ['#16213e', '#e94560'] },
];

export const RARITY_CONFIG: Record<string, { label: string; color: string; glow: string }> = {
  common:    { label: 'Common',    color: '#94a3b8', glow: 'shadow-slate-400/50' },
  rare:      { label: 'Rare',      color: '#3b82f6', glow: 'shadow-blue-400/60' },
  epic:      { label: 'Epic',      color: '#a855f7', glow: 'shadow-purple-400/70' },
  legendary: { label: 'Legendary', color: '#f59e0b', glow: 'shadow-amber-400/80' },
};

export function getRarityFromAvatar(avatar: AvatarState): Rarity {
  let score = 0;
  if (avatar.fantasyAcc !== 'none') score += 3;
  if (avatar.hat >= 8) score += 2; // Viking/Crown
  if (avatar.glasses >= 6) score += 1;
  if (avatar.hairStyle >= 10) score += 2;
  if (avatar.eyeColor === '#7B5EA7') score += 2; // Violet eyes

  if (score >= 7) return 'legendary';
  if (score >= 4) return 'epic';
  if (score >= 2) return 'rare';
  return 'common';
}
