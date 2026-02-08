# LifeQuest — Setup Guide

## Prerequisites
- Node.js 18+ (https://nodejs.org)
- A Supabase account (free tier: https://supabase.com)
- A Vercel account (free tier: https://vercel.com)

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Note your **Project URL** and **Anon Key** from Settings → API
3. Go to **SQL Editor** and run both migration files in order:
   - Copy/paste `supabase/migrations/001_init_schema.sql` → Run
   - Copy/paste `supabase/migrations/002_rls_policies.sql` → Run
4. Enable auth providers in Authentication → Providers:
   - Email/Password (enabled by default)
   - Google (optional): Add your Google OAuth credentials
   - Discord (optional): Add your Discord OAuth credentials

## Step 2: Configure Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you should see the LifeQuest landing page.

## Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Add environment variables (same as .env.local)
5. Deploy!

Your app will be live at `your-project.vercel.app`.

---

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── auth/               # Login, signup, OAuth callback
│   ├── dashboard/          # Main game (skills, quests, achievements, profile, todos)
│   ├── social/             # Social features (feed, friends, leaderboards, communities, challenges, messages)
│   └── users/[userId]/     # Public profiles
├── components/             # React components
│   ├── Dashboard/          # Skill cards, log action sheet
│   ├── Shared/             # ProgressBar, Modal, Toast, BottomNav
│   └── ...
├── hooks/                  # Custom hooks (auth, sync, realtime)
├── lib/
│   ├── game-logic/         # All game mechanics (XP, skills, quests, achievements, streaks, hardcore)
│   ├── supabase/           # Supabase client/server/middleware config
│   └── types.ts            # TypeScript type definitions
└── store/                  # Zustand state management
    ├── useGameStore.ts     # Game state (skills, logs, streaks, quests)
    ├── useUIStore.ts       # UI state (tabs, modals, toasts)
    └── useSocialStore.ts   # Social state (friends, communities, feed)
```

## Key Game Mechanics

- **7 Skills**: Strength, Endurance, Discipline, Intellect, Social, Mind, Durability
- **XP Formula**: 85 × 1.3^(level-1) per level, max level 99
- **Streaks**: +10% XP bonus per day (max +50%)
- **Decay**: 15% XP loss per skill after 24hr inactivity
- **Quests**: 5 daily + 3 weekly, seeded random from pool
- **65 Achievements**: Level, skill, action, streak, and balance milestones
- **Hardcore Mode**: Penalty tiers with accelerated XP decay

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (dark theme) |
| State | Zustand |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Hosting | Vercel |
