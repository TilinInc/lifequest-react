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

// Decay: 30% normal, 50% hardcore — per missed day per skill
// Minimum decay = level * 5 XP so even low-XP skills still feel it
export function getDecayAmount(xp: number, hardcore: boolean = false): number {
  const rate = hardcore ? 0.50 : 0.30;
  const currentLevel = getLevel(xp);
  const minimumDecay = currentLevel * 5;
  return Math.max(minimumDecay, Math.floor(xp * rate));
}

// --- Global Titles (original witty progression with images) ---
const GI = 'https://cdn.jsdelivr.net/gh/game-icons/icons@master/';
const GLOBAL_TITLES: [number, string, string][] = [
  [0, 'Absolute Loser', GI+'lorc/despair.svg'],
  [7, 'Absolute Loser', GI+'lorc/despair.svg'],
  [14, 'Wimp', GI+'lorc/broken-shield.svg'],
  [28, "Bully's Dream", GI+'lorc/pummeled.svg'],
  [49, 'Girl Turnoff', GI+'lorc/broken-heart.svg'],
  [70, 'Noob', GI+'lorc/wooden-sign.svg'],
  [105, 'Girlfriend Still Cheating On You', GI+'delapouite/shrug.svg'],
  [150, 'Average Joe', GI+'delapouite/person.svg'],
  [200, 'Mr. Locked In', GI+'lorc/padlock.svg'],
  [260, 'Not So Average Joe', GI+'lorc/muscle-up.svg'],
  [320, 'Above Average Joe', GI+'lorc/sword-clash.svg'],
  [380, 'Superstar', GI+'lorc/crown.svg'],
  [430, 'Himothy', GI+'lorc/crowned-skull.svg'],
  [480, 'Elite Human', GI+'lorc/winged-shield.svg'],
  [530, 'Super Human', GI+'lorc/bolt-shield.svg'],
  [580, 'Giga Human', GI+'lorc/sunbeams.svg'],
  [630, 'Enlightened', GI+'lorc/meditation.svg'],
  [660, 'Transcendent', GI+'lorc/angel-wings.svg'],
  [680, 'Ascended Being', GI+'lorc/holy-grail.svg'],
  [693, 'The One', GI+'lorc/all-for-one.svg'],
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

export function getTitleWithImage(totalLevel: number, hardcoreMode: boolean = false, penaltyTier: string | null = null): { title: string; img: string } {
  if (hardcoreMode && penaltyTier === 'critical') return { title: 'Condemned', img: GI+'lorc/death-zone.svg' };
  if (hardcoreMode && penaltyTier === 'penaltyZone') return { title: 'Punished', img: GI+'lorc/cage.svg' };

  let title = 'Absolute Loser';
  let img = GI+'lorc/despair.svg';
  for (const [threshold, t, i] of GLOBAL_TITLES) {
    if (totalLevel >= threshold) {
      title = t;
      img = i;
    }
  }
  return { title, img };
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

// --- Money Category (Net Worth-Based Levels) ---
const MONEY_THRESHOLDS: [number, string, number][] = [
  [0, 'Dead Broke', 1],
  [1000, 'Couch Cushion Digger', 2],
  [5000, 'Ramen Budget Elite', 3],
  [10000, 'Five Figure Fraud', 5],
  [25000, 'Emergency Fund Haver', 8],
  [50000, 'Half-Stack Hero', 12],
  [75000, "Parents Aren't Embarrassed", 16],
  [100000, 'Six Figure Starter', 20],
  [150000, 'Adulting Successfully', 25],
  [250000, 'Quarter Millionaire Flex', 30],
  [500000, 'Half a Milli', 40],
  [750000, 'Almost There...', 50],
  [1000000, 'Millionaire', 60],
  [2500000, 'Multi-Millionaire', 70],
  [5000000, 'Stupid Rich', 75],
  [10000000, 'Eight Figure Energy', 80],
  [25000000, 'Private Jet Adjacent', 85],
  [50000000, 'Generational Wealth', 90],
  [100000000, 'Hundred Millionaire', 95],
  [1000000000, 'Billionaire', 99],
];

export function getMoneyLevel(netWorth: number): number {
  let level = 1;
  for (const [threshold, , lvl] of MONEY_THRESHOLDS) {
    if (netWorth >= threshold) level = lvl;
  }
  return level;
}

export function getMoneyTitle(netWorth: number): string {
  let title = 'Dead Broke';
  for (const [threshold, t] of MONEY_THRESHOLDS) {
    if (netWorth >= threshold) title = t;
  }
  return title;
}

export function getMoneyProgress(netWorth: number): number {
  let currentThreshold = 0;
  let nextThreshold = 1000;
  for (let i = 0; i < MONEY_THRESHOLDS.length; i++) {
    if (netWorth >= MONEY_THRESHOLDS[i][0]) {
      currentThreshold = MONEY_THRESHOLDS[i][0];
      nextThreshold = i + 1 < MONEY_THRESHOLDS.length ? MONEY_THRESHOLDS[i + 1][0] : MONEY_THRESHOLDS[i][0];
    }
  }
  if (currentThreshold === nextThreshold) return 1;
  return (netWorth - currentThreshold) / (nextThreshold - currentThreshold);
}

export function formatMoney(amount: number): string {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
}

export { MAX_LEVEL, XP_TABLE };
