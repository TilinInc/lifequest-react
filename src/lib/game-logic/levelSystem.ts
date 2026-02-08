// ============================================
// LIFEQUEST — Level & XP System
// Exact port of original game mechanics
// ============================================

const MAX_LEVEL = 99;

// XP table: 85 * 1.3^(i-1) per level
const XP_TABLE: number[] = [];
(function buildXpTable() {
  let cumulative = 0;
  for (let i = 0; i < MAX_LEVEL; i++) {
    cumulative += Math.floor(85 * Math.pow(1.3, i));
    XP_TABLE.push(cumulative);
  }
})();

export function getLevel(xp: number): number {
  for (let i = 0; i < XP_TABLE.length; i++) {
    if (xp < XP_TABLE[i]) return i + 1;
  }
  return MAX_LEVEL;
}

export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL) return XP_TABLE[MAX_LEVEL - 1];
  return XP_TABLE[level - 2];
}

export function getXpToNext(xp: number): number {
  const level = getLevel(xp);
  if (level >= MAX_LEVEL) return 0;
  return XP_TABLE[level - 1] - xp;
}

export function getXpProgress(xp: number): number {
  const level = getLevel(xp);
  if (level >= MAX_LEVEL) return 1;
  const currentLevelXp = level > 1 ? XP_TABLE[level - 2] : 0;
  const nextLevelXp = XP_TABLE[level - 1];
  return (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
}

export function getTotalLevel(skills: { xp: number }[]): number {
  return skills.reduce((sum, s) => sum + getLevel(s.xp), 0);
}

// Streak XP multiplier: +10% per streak day, capped at 50%
export function getStreakMultiplier(streakDays: number): number {
  return 1 + Math.min(streakDays * 0.1, 0.5);
}

// Decay: 15% of current XP, minimum 50
export function getDecayAmount(xp: number): number {
  return Math.max(50, Math.floor(xp * 0.15));
}

// --- Global Titles ---
const GLOBAL_TITLES: [number, string][] = [
  [0, 'Unawakened'],
  [7, 'Initiate'],
  [14, 'Apprentice'],
  [28, 'Journeyman'],
  [42, 'Adept'],
  [56, 'Veteran'],
  [70, 'Elite'],
  [100, 'Champion'],
  [140, 'Master'],
  [175, 'Grandmaster'],
  [210, 'Legend'],
  [280, 'Mythic'],
  [350, 'Transcendent'],
  [420, 'Immortal'],
  [490, 'Deity'],
  [560, 'Cosmic Being'],
  [630, 'Reality Warper'],
  [680, 'Omnipotent'],
  [693, 'The One'],
];

export function getTitle(totalLevel: number, hardcoreMode: boolean = false, penaltyTier: string | null = null): string {
  if (hardcoreMode && penaltyTier === 'critical') return 'Condemned';
  if (hardcoreMode && penaltyTier === 'penaltyZone') return 'Punished';

  let title = 'Unawakened';
  for (const [threshold, t] of GLOBAL_TITLES) {
    if (totalLevel >= threshold) title = t;
  }
  return title;
}

// --- Per-Skill Titles ---
const SKILL_TITLES: Record<string, [number, string][]> = {
  strength: [[1,'Weakling'],[5,'Brawler'],[10,'Warrior'],[15,'Gladiator'],[25,'Titan'],[35,'Demigod'],[50,'Hercules'],[65,'World Breaker'],[80,'Force of Nature'],[90,'God of War'],[95,'The Unbreakable'],[99,'Strength Incarnate']],
  endurance: [[1,'Couch Potato'],[5,'Jogger'],[10,'Runner'],[15,'Marathoner'],[25,'Iron Lung'],[35,'Unstoppable'],[50,'Ultra Beast'],[65,'Perpetual Motion'],[80,'Eternal Engine'],[90,'Limitless'],[95,'Beyond Human'],[99,'Endurance Incarnate']],
  discipline: [[1,'Undisciplined'],[5,'Novice'],[10,'Dedicated'],[15,'Committed'],[25,'Iron Will'],[35,'Unshakeable'],[50,'Ascetic'],[65,'Master of Self'],[80,'Steel Mind'],[90,'Transcendent'],[95,'Above Temptation'],[99,'Discipline Incarnate']],
  intellect: [[1,'Ignorant'],[5,'Student'],[10,'Scholar'],[15,'Thinker'],[25,'Sage'],[35,'Philosopher'],[50,'Genius'],[65,'Visionary'],[80,'Oracle'],[90,'Omniscient'],[95,'Reality Hacker'],[99,'Intellect Incarnate']],
  social: [[1,'Hermit'],[5,'Acquaintance'],[10,'Socialite'],[15,'Connector'],[25,'Influencer'],[35,'Leader'],[50,'Icon'],[65,'Legend'],[80,'Movement'],[90,'Cultural Force'],[95,'Heart of the People'],[99,'Social Incarnate']],
  mind: [[1,'Restless'],[5,'Seeker'],[10,'Mindful'],[15,'Centered'],[25,'Awakened'],[35,'Enlightened'],[50,'Zen Master'],[65,'Soul Walker'],[80,'Spirit Guide'],[90,'Ascended'],[95,'One with All'],[99,'Mind Incarnate']],
  durability: [[1,'Fragile'],[5,'Recovering'],[10,'Resilient'],[15,'Hardy'],[25,'Fortified'],[35,'Indestructible'],[50,'Regenerator'],[65,'Wolverine'],[80,'Immortal Body'],[90,'Divine Vessel'],[95,'Unbreakable'],[99,'Durability Incarnate']],
};

export function getSkillTitle(skillId: string, level: number): string {
  const titles = SKILL_TITLES[skillId];
  if (!titles) return 'Unknown';
  let title = titles[0][1];
  for (const [threshold, t] of titles) {
    if (level >= threshold) title = t;
  }
  return title;
}

export { MAX_LEVEL, XP_TABLE };
