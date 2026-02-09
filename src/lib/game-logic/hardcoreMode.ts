// ============================================
// LIFEQUEST — Hardcore Mode & Penalty System
// ============================================

import { PenaltyState, PenaltyTier } from '../types';
import { todayStr } from './questSystem';
import { getLevel } from './levelSystem';

export const PENALTY_CONFIG = {
  dailyMinActions: 3,
  warningThreshold: 1,
  penaltyZoneThreshold: 2,
  shadowExtractionThreshold: 5,
  decayRates: {
    warning: 0.02,
    penaltyZone: 0.05,
    critical: 0.10,
  },
  escapeRequirements: {
    actions: 5,
    uniqueSkills: 4,
  },
  escapeRewards: {
    warning: 250,
    penaltyZone: 250,
    critical: 300,
  },
};

export function getDefaultPenalty(): PenaltyState {
  return {
    tier: null,
    consecutiveMisses: 0,
    penaltyZoneSurvived: 0,
    xpDecayed: 0,
    lastCheckDate: null,
    penaltyQuestActive: false,
  };
}

export function getPenaltyTier(consecutiveMisses: number): PenaltyTier {
  if (consecutiveMisses >= PENALTY_CONFIG.shadowExtractionThreshold) return 'critical';
  if (consecutiveMisses >= PENALTY_CONFIG.penaltyZoneThreshold) return 'penaltyZone';
  if (consecutiveMisses >= PENALTY_CONFIG.warningThreshold) return 'warning';
  return null;
}

export function checkDailyPenalty(
  penalty: PenaltyState,
  todayActionCount: number,
  hardcoreEnabled: boolean
): PenaltyState {
  if (!hardcoreEnabled) return getDefaultPenalty();

  const today = todayStr();
  if (penalty.lastCheckDate === today) return penalty;

  // Check if yesterday met minimum actions
  const missedYesterday = todayActionCount < PENALTY_CONFIG.dailyMinActions;

  if (missedYesterday) {
    const newMisses = penalty.consecutiveMisses + 1;
    const newTier = getPenaltyTier(newMisses);
    return {
      ...penalty,
      consecutiveMisses: newMisses,
      tier: newTier,
      lastCheckDate: today,
      penaltyQuestActive: newTier === 'penaltyZone' || newTier === 'critical',
    };
  }

  // Met requirement — reduce penalty
  if (penalty.consecutiveMisses > 0) {
    const newMisses = Math.max(0, penalty.consecutiveMisses - 1);
    return {
      ...penalty,
      consecutiveMisses: newMisses,
      tier: getPenaltyTier(newMisses),
      lastCheckDate: today,
      penaltyQuestActive: false,
    };
  }

  return { ...penalty, lastCheckDate: today };
}

// Calculate penalty decay with level-scaled minimums
// Removes the aggressive flat 50 XP minimum and uses level-proportional minimums instead
// Level 1: min 3 XP, Level 10: min 30 XP, Level 20: min 60 XP
// This keeps penalties meaningful while protecting low-level players
export function calculatePenaltyDecay(xp: number, tier: PenaltyTier): number {
  if (!tier) return 0;

  const currentLevel = getLevel(xp);

  const rate = PENALTY_CONFIG.decayRates[tier] || 0;
  const minimumDecay = currentLevel * 3; // Level-proportional minimum: level * 3
  return Math.max(minimumDecay, Math.floor(xp * rate));
}

export function checkPenaltyEscape(
  todayActionCount: number,
  uniqueSkillsToday: number
): boolean {
  return (
    todayActionCount >= PENALTY_CONFIG.escapeRequirements.actions ||
    uniqueSkillsToday >= PENALTY_CONFIG.escapeRequirements.uniqueSkills
  );
}

export function escapePenalty(penalty: PenaltyState): PenaltyState {
  const reward = penalty.tier ? PENALTY_CONFIG.escapeRewards[penalty.tier] || 250 : 0;
  return {
    ...penalty,
    tier: null,
    consecutiveMisses: 0,
    penaltyQuestActive: false,
    penaltyZoneSurvived: penalty.tier === 'penaltyZone' || penalty.tier === 'critical'
      ? penalty.penaltyZoneSurvived + 1
      : penalty.penaltyZoneSurvived,
  };
}
