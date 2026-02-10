import { getLevel } from './levelSystem';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  desc: string;
  skillId: string | null;
  requiredLevel: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'master' | 'special';
}

export const BADGES: Badge[] = [
  // Strength badges
  {
    id: 'strength_lv5',
    name: 'First Pump',
    icon: '💪',
    desc: 'Reached Level 5 in Strength',
    skillId: 'strength',
    requiredLevel: 5,
    tier: 'bronze',
  },
  {
    id: 'strength_lv15',
    name: 'Beast Mode',
    icon: '🏋️',
    desc: 'Reached Level 15 in Strength',
    skillId: 'strength',
    requiredLevel: 15,
    tier: 'silver',
  },
  {
    id: 'strength_lv30',
    name: 'Iron Titan',
    icon: '⛓️',
    desc: 'Reached Level 30 in Strength',
    skillId: 'strength',
    requiredLevel: 30,
    tier: 'gold',
  },
  {
    id: 'strength_lv50',
    name: 'War Machine',
    icon: '🔱',
    desc: 'Reached Level 50 in Strength',
    skillId: 'strength',
    requiredLevel: 50,
    tier: 'diamond',
  },
  {
    id: 'strength_lv75',
    name: 'God of War',
    icon: '⚔️',
    desc: 'Reached Level 75 in Strength',
    skillId: 'strength',
    requiredLevel: 75,
    tier: 'master',
  },

  // Endurance badges
  {
    id: 'endurance_lv5',
    name: 'First Mile',
    icon: '🏃',
    desc: 'Reached Level 5 in Endurance',
    skillId: 'endurance',
    requiredLevel: 5,
    tier: 'bronze',
  },
  {
    id: 'endurance_lv15',
    name: 'Cardio King',
    icon: '🫁',
    desc: 'Reached Level 15 in Endurance',
    skillId: 'endurance',
    requiredLevel: 15,
    tier: 'silver',
  },
  {
    id: 'endurance_lv30',
    name: 'Marathon Runner',
    icon: '🏅',
    desc: 'Reached Level 30 in Endurance',
    skillId: 'endurance',
    requiredLevel: 30,
    tier: 'gold',
  },
  {
    id: 'endurance_lv50',
    name: 'Unstoppable',
    icon: '🌊',
    desc: 'Reached Level 50 in Endurance',
    skillId: 'endurance',
    requiredLevel: 50,
    tier: 'diamond',
  },
  {
    id: 'endurance_lv75',
    name: 'Perpetual Motion',
    icon: '⚡',
    desc: 'Reached Level 75 in Endurance',
    skillId: 'endurance',
    requiredLevel: 75,
    tier: 'master',
  },

  // Discipline badges
  {
    id: 'discipline_lv5',
    name: 'Early Riser',
    icon: '⏰',
    desc: 'Reached Level 5 in Discipline',
    skillId: 'discipline',
    requiredLevel: 5,
    tier: 'bronze',
  },
  {
    id: 'discipline_lv15',
    name: 'Habit Forger',
    icon: '🔥',
    desc: 'Reached Level 15 in Discipline',
    skillId: 'discipline',
    requiredLevel: 15,
    tier: 'silver',
  },
  {
    id: 'discipline_lv30',
    name: 'Monk Mode',
    icon: '🧘',
    desc: 'Reached Level 30 in Discipline',
    skillId: 'discipline',
    requiredLevel: 30,
    tier: 'gold',
  },
  {
    id: 'discipline_lv50',
    name: 'Iron Will',
    icon: '🗡️',
    desc: 'Reached Level 50 in Discipline',
    skillId: 'discipline',
    requiredLevel: 50,
    tier: 'diamond',
  },
  {
    id: 'discipline_lv75',
    name: 'The Unbreakable',
    icon: '💎',
    desc: 'Reached Level 75 in Discipline',
    skillId: 'discipline',
    requiredLevel: 75,
    tier: 'master',
  },

  // Intellect badges
  {
    id: 'intellect_lv5',
    name: 'Curious Mind',
    icon: '📖',
    desc: 'Reached Level 5 in Intellect',
    skillId: 'intellect',
    requiredLevel: 5,
    tier: 'bronze',
  },
  {
    id: 'intellect_lv15',
    name: 'Quick Learner',
    icon: '🎓',
    desc: 'Reached Level 15 in Intellect',
    skillId: 'intellect',
    requiredLevel: 15,
    tier: 'silver',
  },
  {
    id: 'intellect_lv30',
    name: 'Sage',
    icon: '📚',
    desc: 'Reached Level 30 in Intellect',
    skillId: 'intellect',
    requiredLevel: 30,
    tier: 'gold',
  },
  {
    id: 'intellect_lv50',
    name: 'Genius',
    icon: '🧬',
    desc: 'Reached Level 50 in Intellect',
    skillId: 'intellect',
    requiredLevel: 50,
    tier: 'diamond',
  },
  {
    id: 'intellect_lv75',
    name: 'Omniscient',
    icon: '🌌',
    desc: 'Reached Level 75 in Intellect',
    skillId: 'intellect',
    requiredLevel: 75,
    tier: 'master',
  },

  // Social badges
  {
    id: 'social_lv5',
    name: 'Ice Breaker',
    icon: '👋',
    desc: 'Reached Level 5 in Social',
    skillId: 'social',
    requiredLevel: 5,
    tier: 'bronze',
  },
  {
    id: 'social_lv15',
    name: 'Connector',
    icon: '🤝',
    desc: 'Reached Level 15 in Social',
    skillId: 'social',
    requiredLevel: 15,
    tier: 'silver',
  },
  {
    id: 'social_lv30',
    name: 'Social Butterfly',
    icon: '🦋',
    desc: 'Reached Level 30 in Social',
    skillId: 'social',
    requiredLevel: 30,
    tier: 'gold',
  },
  {
    id: 'social_lv50',
    name: 'Influencer',
    icon: '✨',
    desc: 'Reached Level 50 in Social',
    skillId: 'social',
    requiredLevel: 50,
    tier: 'diamond',
  },
  {
    id: 'social_lv75',
    name: 'Charisma Lord',
    icon: '👑',
    desc: 'Reached Level 75 in Social',
    skillId: 'social',
    requiredLevel: 75,
    tier: 'master',
  },

  // Mind badges
  {
    id: 'mind_lv5',
    name: 'Mindful',
    icon: '🧘',
    desc: 'Reached Level 5 in Mind',
    skillId: 'mind',
    requiredLevel: 5,
    tier: 'bronze',
  },
  {
    id: 'mind_lv15',
    name: 'Inner Peace',
    icon: '☮️',
    desc: 'Reached Level 15 in Mind',
    skillId: 'mind',
    requiredLevel: 15,
    tier: 'silver',
  },
  {
    id: 'mind_lv30',
    name: 'Zen Master',
    icon: '🪷',
    desc: 'Reached Level 30 in Mind',
    skillId: 'mind',
    requiredLevel: 30,
    tier: 'gold',
  },
  {
    id: 'mind_lv50',
    name: 'Enlightened',
    icon: '🌅',
    desc: 'Reached Level 50 in Mind',
    skillId: 'mind',
    requiredLevel: 50,
    tier: 'diamond',
  },
  {
    id: 'mind_lv75',
    name: 'Transcendent',
    icon: '🕉️',
    desc: 'Reached Level 75 in Mind',
    skillId: 'mind',
    requiredLevel: 75,
    tier: 'master',
  },

  // Durability badges
  {
    id: 'durability_lv5',
    name: 'Tough Cookie',
    icon: '🍪',
    desc: 'Reached Level 5 in Durability',
    skillId: 'durability',
    requiredLevel: 5,
    tier: 'bronze',
  },
  {
    id: 'durability_lv15',
    name: 'Iron Skin',
    icon: '🛡️',
    desc: 'Reached Level 15 in Durability',
    skillId: 'durability',
    requiredLevel: 15,
    tier: 'silver',
  },
  {
    id: 'durability_lv30',
    name: 'Bulletproof',
    icon: '🦾',
    desc: 'Reached Level 30 in Durability',
    skillId: 'durability',
    requiredLevel: 30,
    tier: 'gold',
  },
  {
    id: 'durability_lv50',
    name: 'Tank',
    icon: '🏔️',
    desc: 'Reached Level 50 in Durability',
    skillId: 'durability',
    requiredLevel: 50,
    tier: 'diamond',
  },
  {
    id: 'durability_lv75',
    name: 'Immortal',
    icon: '♾️',
    desc: 'Reached Level 75 in Durability',
    skillId: 'durability',
    requiredLevel: 75,
    tier: 'master',
  },

  // Cross-skill badges
  {
    id: 'well_rounded',
    name: 'Well-Rounded',
    icon: '🎯',
    desc: 'Reached Level 10 in all 7 skills',
    skillId: null,
    requiredLevel: 10,
    tier: 'special',
  },
  {
    id: 'renaissance_man',
    name: 'Renaissance Man',
    icon: '🏛️',
    desc: 'Reached Level 25 in all 7 skills',
    skillId: null,
    requiredLevel: 25,
    tier: 'special',
  },
  {
    id: 'the_one',
    name: 'The One',
    icon: '🌟',
    desc: 'Reached Level 50 in all 7 skills',
    skillId: null,
    requiredLevel: 50,
    tier: 'special',
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === id);
}

export function checkBadges(
  skills: { id: string; xp: number }[],
  unlockedBadges: string[]
): string[] {
  const newBadges: string[] = [];

  // Create a map of skill levels
  const skillLevels: Record<string, number> = {};
  const skillIds = ['strength', 'endurance', 'discipline', 'intellect', 'social', 'mind', 'durability'];

  for (const skill of skills) {
    skillLevels[skill.id] = getLevel(skill.xp);
  }

  // Check individual skill badges
  for (const badge of BADGES) {
    // Skip cross-skill badges for now
    if (badge.skillId === null) continue;

    // Skip if already unlocked
    if (unlockedBadges.includes(badge.id)) continue;

    // Check if skill level requirement is met
    const skillLevel = skillLevels[badge.skillId] || 0;
    if (skillLevel >= badge.requiredLevel) {
      newBadges.push(badge.id);
    }
  }

  // Check cross-skill badges
  const allSkillsAtLevel10 = skillIds.every((id) => (skillLevels[id] || 0) >= 10);
  const allSkillsAtLevel25 = skillIds.every((id) => (skillLevels[id] || 0) >= 25);
  const allSkillsAtLevel50 = skillIds.every((id) => (skillLevels[id] || 0) >= 50);

  if (allSkillsAtLevel10 && !unlockedBadges.includes('well_rounded')) {
    newBadges.push('well_rounded');
  }

  if (allSkillsAtLevel25 && !unlockedBadges.includes('renaissance_man')) {
    newBadges.push('renaissance_man');
  }

  if (allSkillsAtLevel50 && !unlockedBadges.includes('the_one')) {
    newBadges.push('the_one');
  }

  return newBadges;
}
