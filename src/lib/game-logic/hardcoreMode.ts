// ============================================
// LIFEQUEST â Hardcore Mode & Penalty System
// ============================================

import { PenaltyState, PenaltyTier } from '../types';
import { todayStr } from './questSystem';

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

export function getDefaultPenalty): PenaltyState {
  return {
    tier: null,
    consecutiveMisses: 0, 
    penaltyZoneSurvived: 0,
    xpDecayed: 0,
    lastCheckDate: null,
    penaltyQuestActive: false,
  };
}