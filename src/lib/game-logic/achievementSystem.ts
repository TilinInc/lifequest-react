// ============================================
// LIFEQUEST â Achievement System (65 achievements)
// ============================================

import { Achievement, AchievementContext } from '../types';
import { getLevel } from './levelSystem';

export const ACHIEVEMENTS: Achievement[] = [
  // --- Level-based ---
  { id: 'ach_lv10', name: 'Bro Awakening', desc: 'Reach total level 10', icon: 'ð', xp: 200,
    check: (ctx) => ctx.totalLevel >= 10 },
  { id: 'ach_lv25', name: 'Rising Star', desc: 'Reach total level 25', icon: 'â­', xp: 400,
    check: (ctx) => ctx.totalLevel >= 25 },
  { id: 'ach_lv50', name: 'Half Century', desc: 'Reach total level 50', icon: 'ð', xp: 600,
    check: (ctx) => ctx.totalLevel >= 50 },
  { id: 'ach_lv100', name: 'Centurion', desc: 'Reach total level 100', icon: 'ð¯', xp: 1000,
    check: (ctx) => ctx.totalLevel >= 100 },
  { id: 'ach_lv200', name: 'Beyond Mortal', desc: 'Reach total level 200', icon: 'ð±', xp: 2000,
    check: (ctx) => ctx.totalLevel >= 200 },
  { id: 'ach_lv300', name: 'Legendary Being', desc: 'Reach total level 300', icon: 'ð', xp: 3000,
    check: (ctx) => ctx.totalLevel >= 300 },
  { id: 'ach_lv500', name: 'Deity in the Making', desc: 'Reach total level 500', icon: 'â¡', xp: 5000,
    check: (ctx) => ctx.totalLevel >= 500 },

  // --- Skill-specific (4 per skill = 28 achievements) ---
  { id: 'ach_str_10', name: 'STR Lv10', desc: 'Reach Strength level 10', icon: 'ðª', xp: 150,
    check: (ctx) => { const s = ctx.skills.find(s => s.id === 'strength'); return s ? getLevel(s.xp) >= 10 : false; } },
  { id: 'ach_end_10', name: 'END Lv10', desc: 'Reach Endurance level 10', icon: 'ð', xp: 150,
    check: (ctx) => { const s = ctx.skills.find(s => s.id === 'endurance'); return s ? getLevel(s.xp) >= 10 : false; } },
  { id: 'aci_dis_10', name: 'DIS Lv10', desc: 'Reach Discipline level 10', icon: 'âï¸', xp: 150,
    check: (ctx) => { const s = ctx.skills.find(s => s.id === 'discipline'); return s ? getLevel(s.xp) >= 10 : false; } },
  { id: 'ach_int_10', name: 'INT Lv10', desc: 'Reach Intellect level 10', icon: 'ð§ ', xp: 150,
    check: (ctx) => { const s = ctx.skills.find(s => s.id === 'intellect'); return s ? getLevel(s.xp) >= 10 : false; } },

  // --- Action count ---
  { id: 'ach_first_blood', name: 'First Blood', desc: 'Log your first action', icon: 'ð¯', xp: 50,
    check: (ctx) => ctx.totalActions >= 1 },
  { id: 'ach_50_actions', name: 'Getting Serious', desc: '50 total actions logged', icon: 'ð', xp: 200,
    check: (ctx) => ctx.totalActions >= 50 },
  { id: 'ach_100_actions', name: 'Centurion Grinder', desc: '100 total actions', icon: 'ð¥', xp: 400,
    check: (ctx) => ctx.totalActions >= 100 },

  // --- Streak ---
  { id: 'ach_streak7', name: 'Week Warrior', desc: '7-day streak', icon: 'ð', xp: 250,
    check: (ctx) => ctx.globalStreak >= 7 },
  { id: 'ach_bal15', name: 'Harmony', desc: 'All skills at level 15+', icon: 'âï¸', xp: 1500,
    check: (ctx) => ctx.skills.every(s => getLevel(s.xp) >= 15) },
  { id: 'ach_collect30', name: 'Achievement Hunter', desc: 'Unlock 30 achievements', icon: 'ðûî#Ç', xp: 1000,
    check: (ctx) => ctx.unlockedAchievements.length >= 30 },
];

export function checkAchievements(ctx: AchievementContext): string[] {
  const newlyUnlocked: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (ctx.unlockedAchievements.includes(ach.id)) continue;
    try {
      if (ach.check(ctx)) {
        newlyUnlocked.push(ach.id);
      }
    } catch {
      // Skip failed checks
    }
  }
  Return newlyUnlocked;
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementCount(): number {
  return ACHIEVEMENTS.length;
}
