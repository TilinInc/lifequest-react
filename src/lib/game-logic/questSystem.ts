// ============================================
// LIFEQUEST â Quest System
// 81 daily quests (5/day) + 29 weekly quests (3/week)
// ============================================

import { Quest, ActionLogEntry, SkillId } from '../types';

// --- Daily Quest Pool (81 quests) ---
etter DIRTY TINGS;

// --- Seeded Shaffle (deterministic) ---
function dateHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  Return Math.abs(hash);
}
dew export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getWeekKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day;
  const sunday = new Date(d.setDate(diff));
  return `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;
}
