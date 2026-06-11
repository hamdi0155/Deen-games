# Ascend — Life RPG

A gamified personal development app built with React Native / Expo. Transform your real-life goals, habits, and disciplines into an interactive RPG where every small action compounds into transformation — inspired by Jim Rohn's philosophy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 51) |
| Navigation | Expo Router (file-based) |
| State | Zustand + AsyncStorage |
| AI | Groq Llama 3.3 70B (`llama-3.3-70b-versatile`) |
| Language | TypeScript (strict) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API key

Copy the example environment file and fill in your key:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
EXPO_PUBLIC_GROQ_API_KEY=your_groq_key_here
```

Get a free key at [console.groq.com](https://console.groq.com). The free tier is sufficient for all features.

> `.env` is gitignored — never commit real keys.

### 3. Start the development server

```bash
npx expo start
```

---

## API Integration

### Groq — All AI Features

**Environment variable:** `EXPO_PUBLIC_GROQ_API_KEY`  
**Model:** `llama-3.3-70b-versatile`

All AI features in the app run through Groq's free tier:

| Feature | Service | Function |
|---|---|---|
| Quest generation from goals | `claudeService.ts` | `generateQuest()` |
| Discipline path generation | `categoryService.ts` | `generateDisciplines()` |
| Mentor chat | `mentorService.ts` | `sendMentorMessage()` |
| Habit tips | `groqService.ts` | `getHabitTip()` |
| Daily motivational boost | `groqService.ts` | `getMotivationalBoost()` |
| Category suggestions | `groqService.ts` | `getCategorySuggestions()` |
| Jim Rohn suggestions | `groqService.ts` | `getJimRohnSuggestions()` |
| Quick action plan | `groqService.ts` | `getQuickActionPlan()` |
| Future-self letter | `future-self.tsx` | inline |

---

## Project Structure

```
app/                    # Expo Router screens (file-based routing)
├── (tabs)/             # Bottom tab screens
├── category/           # Category detail & creation
├── quest/              # Quest detail
├── mentor.tsx          # AI mentor chat
├── future-self.tsx     # Letter to future self
└── ...

src/
├── components/         # React Native UI components
│   ├── ui/             # Generic (buttons, cards, modals)
│   ├── habits/         # Habit widgets
│   ├── quests/         # Quest / task displays
│   └── ...
├── services/           # External API & business logic
│   ├── groqService.ts  # Groq — fast AI features
│   ├── claudeService.ts# Quest generation (Groq)
│   ├── categoryService.ts # Discipline generation (Groq)
│   ├── mentorService.ts# Mentor chat (Groq)
│   └── wisdomService.ts# Local Jim Rohn quotes
├── store/              # Zustand stores (character, habits, quests…)
├── constants/          # Theme, prompts, categories, achievements
└── types/              # TypeScript interfaces
```

---

## Life Categories

The app tracks progress across 12 built-in categories:

Education · Career · Finance · Physical Fitness · Mental Health · Relationships · Discipline · Spiritual · Creativity · Leadership · Appearance · Social

Each category has its own XP, level, and Jim Rohn-seeded AI suggestions.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_GROQ_API_KEY` | Yes | Groq API key — powers all AI features in the app |

The variable must be prefixed with `EXPO_PUBLIC_` so Expo bundles it into the client build.

### CI/CD (GitHub Actions)

Add `EXPO_PUBLIC_GROQ_API_KEY` as a repository secret in **Settings → Secrets and variables → Actions**. The deploy workflow reads it automatically.
