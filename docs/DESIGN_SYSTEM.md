# Ascend — Design System

> The constitution for how Ascend looks, moves, and feels.
> "If Apple built a life-transformation operating system in 2027."
> Source of truth lives in code: `src/constants/theme.ts` + `src/components/icons/AscendIcon.tsx`.

---

## 1. Brand

**Ascend** turns life into a progression system. Not a game, not a tracker — a
personal operating system. The user should feel **ambitious, calm, capable,
disciplined, inspired**.

- **Voice:** confident, quiet, declarative. Never hype, never cute.
- **Avoid:** cartoon graphics, neon overload, fantasy/RPG serif, crypto-app
  gradients, cheap glassmorphism, Material Design, clutter.
- **Aspire to:** Apple HIG · Linear · Arc · Oura · Notion Calendar · luxury
  automotive HUD · fine watchmaking.

---

## 2. Color (`COLORS`, `CATEGORY_COLORS`)

Accents are **rare and meaningful** — color earns its place by carrying signal.

| Role | Token | Hex | Meaning |
|---|---|---|---|
| Canvas | `bg` | `#07090F` | obsidian graphite |
| Canvas (deep) | `bgDeep` | `#040508` | void behind elevation |
| Surface | `bgCard` | `rgba(255,255,255,0.035)` | glass fill |
| Hairline | `bgCardBorder` | `rgba(255,255,255,0.08)` | 1px border |
| Text | `text` | `#E8EAF0` | platinum |
| Text 2 | `textSecondary` | `#9097AE` | silver |
| Text dim | `textDim` | `#3D4055` | smoke |
| **Focus** | `accent` | `#5B6CF5` | sapphire — primary action / focus |
| **Achievement** | `gold` | `#C9A84C` | brass gold — earned, rare |
| **Momentum** | `success` | `#0EA875` | emerald — progress, streaks |
| **Warning** | `warning` | `#E8941A` | amber — energy / caution |
| **Danger** | `danger` | `#E84545` | ruby — destructive |

Each of the 12 life domains owns one accent (`CATEGORY_COLORS`). A domain color
appears only in service of its domain — never decoratively elsewhere.

**Rule:** the canvas is near-black; a screen should read as ~90% graphite/platinum
with single accent moments. If two accents fight, one is wrong.

---

## 3. Typography (`FONTS`, `TYPE`)

Apple-principled hierarchy. **Display = Sora** (geometric, confident — the serif
is gone). **Body = Inter** (the open SF Pro analogue).

| Preset | Font | Size | Tracking | Use |
|---|---|---|---|---|
| `TYPE.hero` | Sora 700 | 42 / 46 | −1.2 | first-run, level-up moments |
| `TYPE.display` | Sora 700 | 30 / 34 | −0.8 | screen titles |
| `TYPE.title` | Sora 600 | 23 / 28 | −0.4 | card headers |
| `TYPE.section` | Sora 600 | 13 / 16 | +0.4 | section eyebrows (not shouting caps) |
| `TYPE.body` | Inter 400 | 15 / 22 | −0.1 | running text |
| `TYPE.bodyStrong` | Inter 600 | 15 / 22 | −0.1 | emphasis in body |
| `TYPE.caption` | Inter 500 | 13 / 18 | 0 | metadata |
| `TYPE.micro` | Inter 500 | 11 / 14 | +0.2 | labels under metrics |
| `TYPE.metric` | Sora 700 | 28 / 32 | −0.5 | HUD figures (XP, levels) |

**Rules:** tight negative tracking on large sizes; never ALL-CAPS body; small
labels use light tracking, not uppercase. Numbers are a first-class citizen
(`metric`) — they are the dashboard.

---

## 4. Icon system (`AscendIcon`)

A **proprietary** glyph set — no icon-font / library glyphs as final assets.

- **Grid:** 24 × 24. **Stroke:** 1.8 default, round caps + round joins.
- **Construction:** composed from primitives (`Path`/`Circle`/`Line`/`Rect`/
  `Polyline`) via `react-native-svg`. Recognizable at 20px, elegant at 64px.
- **States:** pass `filled` for active/selected (soft tint or solid).
- **Coverage:** 12 life-domain emblems + navigation + actions + status (42 glyphs).

```tsx
import { AscendIcon, CATEGORY_ASCEND_ICONS } from '@/components/icons/AscendIcon';
<AscendIcon name="focus" size={24} color={COLORS.accent} />
<AscendIcon name={CATEGORY_ASCEND_ICONS[cat.id]} size={22} color={cat.color} />
```

**Domain glyph language:** education = academy columns · finance = ascending
trend · physical = barbell · mental = clarity bulb · social = constellation ·
discipline = shield+check · focus = concentric ring · stats = life-map hexagon.

---

## 5. Motion (`SPRING`, `DURATION`)

Physics over keyframes. Motion reinforces **progress and momentum** — it is never
decoration. Inspired by visionOS / Dynamic Island / Linear.

| Token | Config | Use |
|---|---|---|
| `SPRING.snappy` | damping 18 / stiffness 280 | buttons, toggles |
| `SPRING.responsive` | 22 / 220 | cards, reveals |
| `SPRING.gentle` | 28 / 150 | modals, sheets, entrances |
| `SPRING.luxe` | 32 / 120 | hero moments |
| `DURATION.standard` | 300ms | most transitions |
| `DURATION.scene` | 650ms | screen-level choreography |

**Signature moments:**
- **Level up** → elegant light expansion + restrained particle reveal.
- **Achievement** → premium reveal, gold, earned-feeling.
- **Focus mode** → environment quietly recedes into deep concentration.
- **Entrances** → staggered `useEntranceAnimation(delay)` (opacity + translateY).

**Rules:** nothing bounces gratuitously; one focal animation per moment; if it
doesn't communicate progress, cut it.

---

## 6. Components

- **GlowCard** — base glass surface: `bgCard` fill, hairline border, optional
  color glow at low opacity. Radius `RADIUS.lg`.
- **XPBar** — 4–6px, glowing fill in the domain color.
- **LevelBadge** — circular ring + glow.
- **CustomAvatar** — gradient identity disc (12 variants).
- **Tab bar** — floating pill, blurred dark, accent on the active tab.
- **Toast / Banner / Modal** — color-matched glow, spring entry.

**Radius scale:** xs 6 (tags) · sm 10 (chips) · md 16 (cards) · lg 20 (featured) ·
xl 28 (modals, tab bar) · full (pills, avatars).

---

## 7. Haptics (`src/services/haptics.ts`)

Haptics confirm meaning, sparingly.

- **light** — tab switch, selection.
- **success** — habit/task complete, XP gained.
- **heavy / notify** — level up, achievement unlock.

---

## 8. Accessibility & iOS alignment

- Contrast: platinum text on graphite clears WCAG AA for body sizes.
- Hit targets ≥ 44×44pt; icons keep generous `hitSlop`.
- Respect safe areas; floating tab bar accounts for the home indicator
  (`TAB_BAR_OFFSET`).
- Dark-first; the system is designed to stay elegant if a light theme is added.
- Dynamic Type: type presets scale from a single source so a future scaling pass
  is mechanical.

---

## 9. Roadmap (design)

- [x] De-serif typography → Sora + structured `TYPE` scale
- [x] Proprietary `AscendIcon` system (42 glyphs) across nav + domains
- [ ] Convert `CustomAvatar` internals to bespoke glyphs (still library-backed)
- [ ] Home: proprietary HUD layout (momentum ring + today's mission, not stacked cards)
- [ ] Skill-tree / life-blueprint view (neural-network nodes)
- [ ] Focus mode: full-screen ambient concentration scene
- [ ] Achievement rarity tiers + crafted medal reveals
