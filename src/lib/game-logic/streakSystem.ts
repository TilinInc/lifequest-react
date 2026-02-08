// ============================================
// LIFEQUEST — Streak System
// Global + per-skill streaks with XP multiplier
// ============================================

import { StreakData, SkillId } from '../types';
import { todayStr } from './questSystem';

export function getDefaultStreaks() {
  return {
    global: { current: 0, best: 0, lastActiveDate: null } as StreakData,
    perSkill: {} as Record<string, StreakData>,
  };
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function updateStreak(streak: StreakData): StreakData {
  const today = todayStr();
  const yesterday = getYesterday();

  if (streak.lastActiveDate === today) {
    // Already logged today, no change
    return streak;
  }

  if (streak.lastActiveDate === yesterday) {
    // Consecutive day — extend streak
    const newCurrent = streak.current + 1;
    return {
      current: newCurrent,
      best: Math.max(streak.best, newCurrent),
      lastActiveDate: today,
    };
  }

  // Streak broken or first time
  return {
    current: 1,
    best: Math.max(streak.best, 1),
    lastActiveDate: today,
  };
}

export function updateGlobalStreak(
  streaks: { global: StreakData; perSkill: Record<string, StreakData> }
): { global: StreakData; perSkill: Record<string, StreakData> } {
  return {
    ...streaks,
    global: updateStreak(streaks.global),
  };
}

export function updateSkillStreak(
  streaks: { global: StreakData; perSkill: Record<string, StreakData> },
  skillId: SkillId
): { global: StreakData; perSkill: Record<string, StreakData> } {
  const current = streaks.perSkill[skillId] || { current: 0, best: 0, lastActiveDate: null };
  return {
    ...streaks,
    perSkill: {
      ...streaks.perSkill,
      [skillId]: updateStreak(current),
    },
  };
}

export function getStreakMultiplier(streakDays: number): number {
  return 1 + Math.min(streakDays * 0.1, 0.5);
}

export function isStreakActive(streak: StreakData): boolean {
  const today = todayStr();
  const yesterday = getYesterday();
  return streak.lastActiveDate === today || streak.lastActiveDate === yesterday;
}

export function shouldDecay(streak: StreakData): boolean {
  const today = todayStr();
  const yesterday = getYesterday();
  return streak.lastActiveDate !== null &&
    streak.lastActiveDate !== today &&
    streak.lastActiveDate !== yesterday;
}
