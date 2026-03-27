# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, port 3000)
npm run build    # Production build + type check
npm run lint     # ESLint via next lint
npx tsc --noEmit # Type-check without building
```

No test suite exists in this project.

## Environment

Requires `ANTHROPIC_API_KEY` in `.env.local` to use the evaluation API route.

## Architecture

**Kleo** is a Spanish-language physics learning app for students aged 10–14. It uses the Feynman Technique: students read a lesson, write an explanation from memory, and get AI-powered feedback.

### State machine (per cap)

```
read → write → feedback → tutoring → write (loop) → complete
                        ↘ complete (if followup passes)
```

- State lives entirely in **localStorage** (`kleo-physics-state`), managed by `lib/storage.ts`.
- `app/page.tsx` owns the top-level `AppState` and passes per-cap state down.
- `components/FeynmanLoop.tsx` drives all phase transitions. It calls `/api/evaluate` twice per learning loop: once for the initial write, once for follow-up answers.

### AI evaluation (`app/api/evaluate/route.ts`)

Single POST endpoint, two phases (`initial` / `followup`):
- Returns `EvaluationResult` with `conceptChecks[]` (one entry per key concept), `passed`, `gaps`, `correct`, `followUpQuestions`, `tutorExplanation`.
- **Safety assertion**: after parsing Claude's JSON, `passed` is overridden by the server using the arithmetic rule `coveredCount >= ceil(N * 6/7)`. Never trust `passed` from the raw Claude response.
- If `conceptChecks` is missing or has wrong length → returns HTTP 500.
- Uses `claude-opus-4-6`, `max_tokens: 2048`.

### Key types (`lib/types.ts`)

- `CapPhase`: `'read' | 'write' | 'feedback' | 'questions' | 'tutoring' | 'complete'`
- `CapState` includes `attemptCount: number` — incremented on each write submission, used to show "Intento #N" in `TutorCard`.
- `EvaluationResult.conceptChecks?: ConceptCheck[]` — present after any evaluation call.

### Component responsibilities

| Component | Role |
|---|---|
| `FeynmanLoop.tsx` | Phase rendering + all API calls |
| `FeedbackDisplay.tsx` | Renders `ConceptChecklist` + gap/correct lists |
| `ConceptChecklist.tsx` | Per-concept ✅/❌ with student evidence quotes |
| `TutorCard.tsx` | Claude's tutor explanation (ReactMarkdown) + retry button |
| `CapCard.tsx` | Progress card on the main list; shows phase label + % |
| `XPBar.tsx` | Animated XP bar at the top of the page |
| `ConfettiCelebration.tsx` | canvas-confetti burst on cap completion |

### Content (`lib/caps.ts`)

Three caps: La Materia (100 XP), La Fuerza (120 XP), La Energía (150 XP). Each has exactly 7 `keyConcepts` — the pass threshold (6/7) is hardcoded in the API route as `ceil(N * 6/7)`.

### Styling

- Tailwind CSS with `@tailwindcss/typography` for markdown prose.
- Each cap has a `color` field (`'blue' | 'yellow' | 'green'`). Components map this to `accentColor` / `bgColor` via local `COLOR_MAP` / `BG_MAP` objects (defined in `FeynmanLoop.tsx` and `CapCard.tsx`).
- Custom animations defined in `app/globals.css`: `pulse-border`, `float-up`, `pop-in`, `slide-up`.
