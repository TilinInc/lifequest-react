// ============================================
// LIFEQUEST — Achievement System (65 achievements)
// ============================================

import { Achievement, AchievementContext } from '../types';
import { getLevel } from './levelSystem';

export const ACHIEVEMENTS: Achievement[] = [
  // --- Level-based ---
  { id: 'ach_lv10', name: 'Bro Awakening', desc: 'Reach total level 10', icon: '🌅', xp: 200,
    check: (ctx) => ctx.totalLevel >= 10 },
  { id: 'ach_lv25', name: 'Rising Star', desc: 'Reach total level 25', icon: '⭐', xp: 400,
    check: (ctx) => ctx.totalLevel >= 25 },
  { id: 'ach_lv50', name: 'Half Century', desc: 'Reach total level 50', icon: '🏆', xp: 600,
    check: (ctx) => ctx.totalLevel >= 50 },
  { id: 'ach_lv100', name: 'Centurion', desc: 'Reach total level 100', icon: '💯', xp: 1000,
    check: (ctx) => ctx.totalLevel >= 100 },
  { id: 'ach_lv200', name: 'Beyond Mortal', desc: 'Reach total level 200', icon: '🔱', xp: 2000,
    check: (ctx) => ctx.totalLevel >= 200 },
  { id: 'ach_lv300', name: 'Legendary Being', desc: 'Reach total level 300', icon: '👑', xp: 3000,
    check: (ctx) => ctx.totalLevel >= 300 },
  { id: 'ach_lv500', name: 'Deity in the Making', desc: 'Reach total level 500', icon: '⚡', xp: 5000,
    check: (ctx) => ctx.totalLevel >= 500 },

  // --- Skill-specific (4 per skill = 28 achievements) ---
  ...generateSkillAchievements('strength', 'STR', '💪'),
  ...generateSkillAchievements('endurance', 'END', '🏃'),
  ...generateSkillAchievements('discipline', 'DIS', '⚔️'),
  ...generateSkillAchievements('intellect', 'INT', '🧠'),
  ...generateSkillAchievements('social', 'SOC', '👥'),
  ...generateSkillAchievements('mind', 'MND', '🧘'),
  ...generateSkillAchievements('durability', 'DUR', '🛡️'),

  // --- Action count ---
  { id: 'ach_first_blood', name: 'First Blood', desc: 'Log your first action', icon: '🎯', xp: 50,
    check: (ctx) => ctx.totalActions >= 1 },
  { id: 'ach_50_actions', name: 'Getting Serious', desc: '50 total actions logged', icon: '📊', xp: 200,
    check: (ctx) => ctx.totalActions >= 50 },
  { id: 'ach_100_actions', name: 'Centurion Grinder', desc: '100 total actions', icon: '🔥', xp: 400,
    check: (ctx) => ctx.totalActions >= 100 },
  { id: 'ach_250_actions', name: 'Quarter Thousand', desc: '250 total actions', icon: '⚡', xp: 750,
    check: (ctx) => ctx.totalActions >= 250 },
  { id: 'ach_500_actions', name: 'Half K Grinder', desc: '500 total actions', icon: '💎', xp: 1000,
    check: (ctx) => ctx.totalActions >= 500 },
  { id: 'ach_1000_actions', name: 'Thousand Club', desc: '1000 total actions', icon: '🏅', xp: 2000,
    check: (ctx) => ctx.totalActions >= 1000 },
  { id: 'ach_2500_actions', name: 'Relentless', desc: '2500 total actions', icon: '🌟', xp: 3000,
    check: (ctx) => ctx.totalActions >= 2500 },
  { id: 'ach_5000_actions', name: 'Dimensional Grinder', desc: '5000 total actions', icon: '🌀', xp: 5000,
    check: (ctx) => ctx.totalActions >= 5000 },

  // --- Streak-based ---
  { id: 'ach_streak3', name: 'Three-peat', desc: '3-day streak', icon: '🔥', xp: 100,
    check: (ctx) => ctx.globalStreak >= 3 },
  { id: 'ach_streak7', name: 'Week Warrior', desc: '7-day streak', icon: '📅', xp: 250,
    check: (ctx) => ctx.globalStreak >= 7 },
  { id: 'ach_streak14', name: 'Fortnight Fighter', desc: '14-day streak', icon: '⚡', xp: 500,
    check: (ctx) => ctx.globalStreak >= 14 },
  { id: 'ach_streak30', name: 'Monthly Master', desc: '30-day streak', icon: '🌙', xp: 1000,
    check: (ctx) => ctx.globalStreak >= 30 },
  { id: 'ach_streak60', name: 'Bimonthly Beast', desc: '60-day streak', icon: '💪', xp: 2000,
    check: (ctx) => ctx.globalStreak >= 60 },
  { id: 'ach_streak90', name: 'Quarterly Conqueror', desc: '90-day streak', icon: '🏆', xp: 3000,
    check: (ctx) => ctx.globalStreak >= 90 },
  { id: 'ach_streak180', name: 'Half-Year Hero', desc: '180-day streak', icon: '👑', xp: 5000,
    check: (ctx) => ctx.globalStreak >= 180 },
  { id: 'ach_streak365', name: 'Year of Legends', desc: '365-day streak', icon: '🌟', xp: 10000,
    check: (ctx) => ctx.globalStreak >= 365 },

  // --- Balance ---
  { id: 'ach_bal5', name: 'Balanced Start', desc: 'All skills at level 5+', icon: '⚖️', xp: 300,
    check: (ctx) => ctx.skills.every(s => getLevel(s.xp) >= 5) },
  { id: 'ach_bal10', name: 'True Balance', desc: 'All skills at level 10+', icon: '⚖️', xp: 800,
    check: (ctx) => ctx.skills.every(s => getLevel(s.xp) >= 10) },
  { id: 'ach_bal15', name: 'Harmony', desc: 'All skills at level 15+', icon: '☯️', xp: 1500,
    check: (ctx) => ctx.skills.every(s => getLevel(s.xp) >= 15) },
  { id: 'ach_bal25', name: 'Equilibrium', desc: 'All skills at level 25+', icon: '🌀', xp: 3000,
    check: (ctx) => ctx.skills.every(s => getLevel(s.xp) >= 25) },
  { id: 'ach_bal50', name: 'Perfect Symmetry', desc: 'All skills at level 50+', icon: '💠', xp: 7500,
    check: (ctx) => ctx.skills.every(s => getLevel(s.xp) >= 50) },

  // --- Penalty survival ---
  { id: 'ach_survivor', name: 'Survivor', desc: 'Escape a penalty zone', icon: '🏴', xp: 500,
    check: () => false }, // Special: checked on penalty escape
  { id: 'ach_shadow_monarch', name: 'Shadow Monarch', desc: 'Escape critical penalty', icon: '👤', xp: 1500,
    check: () => false }, // Special: checked on critical escape

  // --- Collection ---
  { id: 'ach_collect30', name: 'Achievement Hunter', desc: 'Unlock 30 achievements', icon: '🎖️', xp: 1000,
    check: (ctx) => ctx.unlockedAchievements.length >= 30 },
  { id: 'ach_collect60', name: 'Completionist', desc: 'Unlock 60 achievements', icon: '🏅', xp: 5000,
    check: (ctx) => ctx.unlockedAchievements.length >= 60 },
];

function generateSkillAchievements(skillId: string, label: string, icon: string): Achievement[] {
  return [
    { id: `ach_${skillId}_10`, name: `${label} Lv10`, desc: `Reach ${label} level 10`, icon, xp: 150,
      check: (ctx) => { const s = ctx.skills.find(sk => sk.id === skillId); return s ? getLevel(s.xp) >= 10 : false; } },
    { id: `ach_${skillId}_25`, name: `${label} Lv25`, desc: `Reach ${label} level 25`, icon, xp: 400,
      check: (ctx) => { const s = ctx.skills.find(sk => sk.id === skillId); return s ? getLevel(s.xp) >= 25 : false; } },
    { id: `ach_${skillId}_50`, name: `${label} Lv50`, desc: `Reach ${label} level 50`, icon, xp: 1000,
      check: (ctx) => { const s = ctx.skills.find(sk => sk.id === skillId); return s ? getLevel(s.xp) >= 50 : false; } },
    { id: `ach_${skillId}_99`, name: `${label} MAX`, desc: `Reach ${label} level 99`, icon, xp: 5000,
      check: (ctx) => { const s = ctx.skills.find(sk => sk.id === skillId); return s ? getLevel(s.xp) >= 99 : false; } },
  ];
}

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
  return newlyUnlocked;
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementCount(): number {
  return ACHIEVEMENTS.length;
}
