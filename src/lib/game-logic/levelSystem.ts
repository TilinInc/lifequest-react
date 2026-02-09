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

// Decay: 5% of current XP with scaling minimum based on level
// Minimum decay = level * 5 XP, which protects low-level players
// Level 1: min 5 XP decay, Level 10: min 50 XP decay, etc.
export function getDecayAmount(xp: number): number {
  const currentLevel = getLevel(xp);
  const minimumDecay = currentLevel * 5;
  return Math.max(minimumDecay, Math.floor(xp * 0.05));
}

// --- Global Titles (original witty progression) ---
const GLOBAL_TITLES: [number, string][] = [
  [0, 'Absolute Loser'],
  [7, 'Absolute Loser'],
  [14, 'Wimp'],
  [28, "Bully's Dream"],
  [49, 'Girl Turnoff'],
  [70, 'Noob'],
  [105, 'Girlfriend Still Cheating On You'],
  [150, 'Average Joe'],
  [200, 'Mr. Locked In'],
  [260, 'Not So Average Joe'],
  [320, 'Above Average Joe'],
  [380, 'Superstar'],
  [430, 'Himothy'],
  [480, 'Elite Human'],
  [530, 'Super Human'],
  [580, 'Giga Human'],
  [630, 'Enlightened'],
  [660, 'Transcendent'],
  [680, 'Ascended Being'],
  [693, 'The One'],
];

export function getTitle(totalLevel: number, hardcoreMode: boolean = false, penaltyTier: string | null = null): string {
  if (hardcoreMode && penaltyTier === 'critical') return 'Condemned';
  if (hardcoreMode && penaltyTier === 'penaltyZone') return 'Punished';

  let title = 'Absolute Loser';
  for (const [threshold, t] of GLOBAL_TITLES) {
    if (totalLevel >= threshold) title = t;
  }
  return title;
}

// --- Per-Skill Titles (original witty progression) ---
const SKILL_TITLES: Record<string, [number, string][]> = {
  strength: [[1,'Noodle Arms'],[5,'Planet Fitness Regular'],[10,'Can Open Your Own Jars'],[15,'Built Different'],[25,'Local Gym Knows Your Name'],[35,'Veins Like Garden Hoses'],[50,'Refrigerator Physique'],[60,'Doorframe Breaker'],[70,'Protein Powder Prophet'],[80,'Living Chest Freezer'],[90,'God of War'],[99,'Muscles Have Muscles']],
  endurance: [[1,'Winded by Stairs'],[5,'Maybe Jogged Once'],[10,'Cardio Curious'],[15,'Can Run Without Dying'],[25,'Marathon Training Started'],[35,'Breathing Techniques Unlocked'],[50,'Energizer Bunny Vibes'],[60,'Never Needs Rest Days'],[70,'Oxygen Is Just Vibes'],[80,'Usain Bolt Could Never'],[90,'Living Perpetual Motion'],[99,'Bionic Man']],
  discipline: [[1,'Snooze Button Champion'],[5,'Sometimes Shows Up'],[10,'Occasionally Follows Through'],[15,'Discipline Curious'],[25,'Consistent-ish'],[35,'The Grind Recognizes The Grind'],[50,'Monk Mode Activated'],[60,'Iron Will Incarnate'],[70,"Temptation's Sworn Enemy"],[80,'Discipline Is My Religion'],[90,'Living Stoic Statue'],[99,'The Disciplinary']],
  intellect: [[1,'Smooth Brain Energy'],[5,'Google Search Warrior'],[10,'Can Read Instructions'],[15,'Knows Stuff Sometimes'],[25,'Dangerous When Thinks'],[35,'College Dropout Success'],[50,'Literally A Genius'],[60,'Big Brain Time'],[70,'Walking Wikipedia'],[80,'IQ Breaks Scales'],[90,'Future Billionaire Energy'],[99,'Literal Supercomputer']],
  social: [[1,'Basement Dweller'],[5,'Can Say Hello'],[10,'Party Knows Your Name'],[15,'Noticeably Charming'],[25,'The Cool Guy'],[35,'Crowd Controller'],[50,'Social Butterfly Evolved'],[60,'Charisma Off The Charts'],[70,'Entire Room Gravitates To You'],[80,'Presidential Candidate Level'],[90,'Literal Human Magnet'],[99,'Pure Chaotic Charm']],
  mind: [[1,'Anxiety Ridden'],[5,'Coping Mechanism User'],[10,'Can Meditate For 30 Seconds'],[15,'Mental Health Enthusiast'],[25,'Surprisingly Zen'],[35,'Therapy Graduate'],[50,'Inner Peace Acquired'],[60,'Meditation Master'],[70,'Thoughts Are Your Slaves'],[80,'Enlightened Awareness'],[90,'The Unshakeable'],[99,'Nirvana Achieved']],
  durability: [[1,'Paper Thin'],[5,'Sickly Dude'],[10,'Cold Gets You'],[15,'Mostly Functional'],[25,'Resilient Bro'],[35,'Tough As Nails'],[50,'Practically Indestructible'],[60,'Regeneration Suspected'],[70,'Pain Is Just Fiction'],[80,'Tank Level Durability'],[90,'Basically Wolverine'],[99,'Cockroach Status']],
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
