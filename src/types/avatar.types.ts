export type BodyType = 'slim' | 'athletic' | 'average' | 'heavy';
export type AgeAppearance = 'child' | 'teen' | 'young-adult' | 'adult' | 'mature';
export type FaceShape = 'oval' | 'round' | 'square' | 'diamond' | 'heart' | 'rectangle';
export type EyeShape = 'almond' | 'round' | 'hooded' | 'monolid' | 'wide';
export type EyelashStyle = 'none' | 'natural' | 'long' | 'dramatic';
export type NoseShape = 'small' | 'medium' | 'large' | 'wide' | 'narrow' | 'button';
export type MouthExpression = 'smile' | 'neutral' | 'serious' | 'smirk' | 'happy';
export type FacialHairStyle = 'none' | 'stubble' | 'mustache' | 'goatee' | 'beard';
export type ClothingCategory = 'casual' | 'streetwear' | 'business' | 'sports' | 'luxury' | 'gaming' | 'fantasy';
export type Expression = 'happy' | 'excited' | 'laughing' | 'confused' | 'angry' | 'focused' | 'sleepy' | 'sad';
export type Background = 'gradient-purple' | 'gradient-blue' | 'gradient-pink' | 'gradient-green' | 'gradient-orange' | 'solid-white' | 'solid-black' | 'city' | 'nature' | 'space' | 'fantasy';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AvatarState {
  // Body
  bodyType: BodyType;
  ageAppearance: AgeAppearance;
  skinTone: string;

  // Face
  faceShape: FaceShape;
  jawline: number;   // 0–100
  cheeks: number;    // 0–100
  chin: number;      // 0–100

  // Eyes
  eyeShape: EyeShape;
  eyeColor: string;
  eyelashes: EyelashStyle;
  eyebrowStyle: number;   // 0–9
  eyebrowThickness: number; // 0–100
  eyebrowRotation: number;  // -30–30
  eyebrowColor: string;

  // Hair
  hairStyle: number;      // 0–14
  hairColor: string;
  hairHighlights: string;
  hairShine: number;      // 0–100
  facialHair: FacialHairStyle;
  facialHairColor: string;
  facialHairDensity: number; // 0–100

  // Nose
  noseShape: NoseShape;
  noseWidth: number;    // 0–100
  noseHeight: number;   // 0–100

  // Mouth
  mouthExpression: MouthExpression;
  lipThickness: number; // 0–100
  lipColor: string;

  // Accessories
  glasses: number;   // -1 = none
  hat: number;       // -1 = none
  earrings: number;  // -1 = none
  necklace: number;  // -1 = none
  fantasyAcc: 'none' | 'halo' | 'horns' | 'wings' | 'crown';

  // Clothing
  clothingTop: number;
  clothingColor: string;
  clothingCategory: ClothingCategory;

  // Expression / Animation
  expression: Expression;

  // Background
  background: Background;
}

export interface AvatarPreset {
  id: string;
  name: string;
  avatar: AvatarState;
  rarity: Rarity;
  unlockedAt?: number;
}

export interface CollectibleItem {
  id: string;
  name: string;
  category: string;
  rarity: Rarity;
  unlocked: boolean;
  preview?: string;
}

export type Step =
  | 'welcome'
  | 'body'
  | 'face'
  | 'eyes'
  | 'hair'
  | 'nose-mouth'
  | 'accessories'
  | 'clothing'
  | 'expression'
  | 'background'
  | 'finish';
