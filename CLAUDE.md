# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**Deen Games** — a gamified Islamic learning app (Duolingo-style). Users answer quiz questions across four Islamic knowledge categories (Quran, Hadith, Fiqh, Seerah), earn XP, level up, and compete on a leaderboard. Built for iOS/Android with React Native (Expo).

## Commands

```bash
expo start          # Start dev server (scan QR with Expo Go)
expo start --ios    # Open in iOS simulator
expo start --android

npm run lint        # ESLint (TypeScript + React hooks)
npm run type-check  # tsc --noEmit
```

## Tech stack

| Layer | Choice |
|-------|--------|
| Mobile framework | Expo SDK 51 + Expo Router v3 (file-based routing) |
| Language | TypeScript (strict) |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| State | Zustand — `lib/store.ts` |
| Auth + DB | Supabase (PostgreSQL) — `lib/supabase.ts` |
| Fonts | Amiri (Arabic serif) — must be in `assets/fonts/` |

## Architecture

### Routing (`app/`)

Expo Router uses file-based routing — the directory structure **is** the navigation tree:

```
app/
  index.tsx              ← Auth gate: redirects to (auth) or (tabs)
  _layout.tsx            ← Root: loads fonts, subscribes to Supabase auth state
  (auth)/                ← Unauthenticated stack: welcome → signup/login
  (tabs)/                ← Authenticated bottom tab navigator
    index.tsx            ← Home: daily challenge + category cards
    learn.tsx            ← Category list with progress bars
    leaderboard.tsx      ← Live ranked list from Supabase
    profile.tsx          ← User stats, XP bar, sign out
  game/
    [category].tsx       ← Game session screen (modal)
    result.tsx           ← Post-game results (modal)
```

### State management

Two Zustand stores in `lib/store.ts`:

- **`useAuthStore`** — holds the current `UserProfile`, loading state, and `addXp()` for optimistic updates.
- **`useGameStore`** — manages a single `GameSession` (questions array, currentIndex, score, lives, streak). `answerQuestion()` returns `{ correct, xpEarned }` including streak bonuses.

Auth state is kept in sync with Supabase via `onAuthStateChange` in `app/_layout.tsx`.

### Game flow

1. `game/[category].tsx` calls `getRandomQuestions(category, 5)` and `startSession(questions)`.
2. User taps an answer → `answerQuestion(index)` → haptic feedback → XP accumulated locally.
3. After all questions or 0 lives → `updateXp()` persists to Supabase → navigate to `result.tsx` with params.
4. `result.tsx` is a modal — navigates back to `(tabs)` or replays.

### Data flow

- Questions are static in `constants/questions.ts` — no API call needed to play.
- User progress (XP, level, streak) lives in the `profiles` Supabase table.
- The leaderboard queries `profiles` ordered by `total_xp` directly.

### Styling conventions

- All styling uses NativeWind className strings (Tailwind syntax).
- Design tokens are in `constants/colors.ts` (`Colors` object) and `tailwind.config.js`.
- Primary accent: `gold` (`#d4a843`). Category colors are per-item in `constants/categories.ts`.
- Dark background: `#0f1117` (`bg-background`).

## Environment setup

Copy `.env.example` to `.env` and fill in Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run `supabase/schema.sql` in the Supabase SQL editor to create the `profiles` table and RLS policies.

Download Amiri font files (`Amiri-Regular.ttf`, `Amiri-Bold.ttf`) into `assets/fonts/` — they are referenced in `app.json` but not committed.

## Adding content

Questions live in `constants/questions.ts` as a typed `Question[]`. Each question needs `id`, `category`, `question`, `options[4]`, `correctIndex`, `difficulty`, and `xpReward`. The `arabic` field is optional and renders in a styled Amiri font box above the question.
