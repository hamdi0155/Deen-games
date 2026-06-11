# Ascend — Life RPG

A gamified personal development app built with React Native / Expo. Transform your real-life goals, habits, and disciplines into an interactive RPG where every small action compounds into transformation — inspired by Jim Rohn's philosophy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 51) |
| Navigation | Expo Router (file-based) |
| State | Zustand + AsyncStorage |
| AI (deep) | Anthropic Claude (`claude-sonnet-4-6`, `claude-opus-4-8`) |
| AI (fast) | Groq Llama 3.3 70B (`llama-3.3-70b-versatile`) |
| Language | TypeScript (strict) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API keys

Copy the example environment file and fill in your keys:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key_here
EXPO_PUBLIC_GROQ_API_KEY=your_groq_key_here
```

> `.env` is gitignored — never commit real keys.

### 3. Start the development server

```bash
npx expo start
```

---

## API Integrations

### Groq — Fast AI Features

**Environment variable:** `EXPO_PUBLIC_GROQ_API_KEY`  
**Model:** `llama-3.3-70b-versatile`  
**Service file:** `src/services/groqService.ts`

Used for latency-sensitive features that need a near-instant response:

| Feature | Function | Description |
|---|---|---|
| Habit tips | `getHabitTip()` | One-sentence tip when creating a new habit |
| Motivational boost | `getMotivationalBoost()` | Personalised daily motivation based on character stats |
| Fast mentor chat | `sendFastMentorMessage()` | Quick back-and-forth replies in the mentor screen |
| Category suggestions | `getCategorySuggestions()` | 3-4 Jim Rohn-grounded suggestions per life category |
| Jim Rohn suggestions | `getJimRohnSuggestions()` | 3 personalised suggestions based on weak areas |
| Quick action plan | `getQuickActionPlan()` | 3 action steps for a goal |

Get a free key at [console.groq.com](https://console.groq.com).

---

### Anthropic Claude — Deep AI Features

**Environment variable:** `EXPO_PUBLIC_ANTHROPIC_API_KEY`  
**Models:** `claude-sonnet-4-6` (quests), `claude-opus-4-8` (mentor/letters)  
**Service files:** `src/services/claudeService.ts`, `src/services/mentorService.ts`

Used for features requiring deeper reasoning:

| Feature | Service | Model |
|---|---|---|
| Quest generation from goals | `claudeService.ts` | `claude-sonnet-4-6` |
| Deep mentor chat | `mentorService.ts` | `claude-opus-4-8` |
| Future-self letters (prompt caching) | `mentorService.ts` | `claude-opus-4-8` |

Get a key at [console.anthropic.com](https://console.anthropic.com).

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
│   ├── groqService.ts  # Groq (fast AI)
│   ├── claudeService.ts# Anthropic Claude (quest gen)
│   ├── mentorService.ts# Mentor + future-self letters
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
| `EXPO_PUBLIC_GROQ_API_KEY` | Yes (fast AI) | Groq API key — powers habit tips, motivation, fast chat |
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Yes (deep AI) | Anthropic key — powers quest gen and deep mentor chat |

Both variables must be prefixed with `EXPO_PUBLIC_` so Expo bundles them into the client build.
