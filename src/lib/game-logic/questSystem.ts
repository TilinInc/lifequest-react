// ============================================
// LIFEQUEST — Quest System
// 81 daily quests (5/day) + 29 weekly quests (3/week)
// ============================================

import { Quest, ActionLogEntry, SkillId } from '../types';

// --- Daily Quest Pool (81 quests) ---
export const DAILY_QUESTS: Quest[] = [
  // Skill count quests
  { id: 'dq_built_diff', name: 'Built Different', desc: '2 Strength actions', type: 'skill_count', skill: 'strength', target: 2, xp: 150 },
  { id: 'dq_cardio_king', name: 'Cardio King', desc: '2 Endurance actions', type: 'skill_count', skill: 'endurance', target: 2, xp: 150 },
  { id: 'dq_iron_will', name: 'Iron Will', desc: '2 Discipline actions', type: 'skill_count', skill: 'discipline', target: 2, xp: 150 },
  { id: 'dq_big_brain', name: 'Big Brain', desc: '2 Intellect actions', type: 'skill_count', skill: 'intellect', target: 2, xp: 150 },
  { id: 'dq_people_person', name: 'People Person', desc: '2 Social actions', type: 'skill_count', skill: 'social', target: 2, xp: 150 },
  { id: 'dq_inner_peace', name: 'Inner Peace', desc: '2 Mind actions', type: 'skill_count', skill: 'mind', target: 2, xp: 150 },
  { id: 'dq_recovery', name: 'Recovery Day', desc: '2 Durability actions', type: 'skill_count', skill: 'durability', target: 2, xp: 150 },
  { id: 'dq_str3', name: 'Power Hour', desc: '3 Strength actions', type: 'skill_count', skill: 'strength', target: 3, xp: 200 },
  { id: 'dq_end3', name: 'Endurance Test', desc: '3 Endurance actions', type: 'skill_count', skill: 'endurance', target: 3, xp: 200 },
  { id: 'dq_dis3', name: 'Disciplined Day', desc: '3 Discipline actions', type: 'skill_count', skill: 'discipline', target: 3, xp: 200 },
  { id: 'dq_int3', name: 'Scholar\'s Path', desc: '3 Intellect actions', type: 'skill_count', skill: 'intellect', target: 3, xp: 200 },

  // Multi-skill quests
  { id: 'dq_no_days_off', name: 'No Days Off', desc: 'Log 4 different skills', type: 'unique_skills', target: 4, xp: 200 },
  { id: 'dq_well_rounded', name: 'Well-Rounded', desc: 'Log 5 different skills', type: 'unique_skills', target: 5, xp: 250 },
  { id: 'dq_all_around', name: 'All-Around Legend', desc: 'Log all 7 skills', type: 'unique_skills', target: 7, xp: 300 },
  { id: 'dq_3skills', name: 'Triple Threat', desc: 'Log 3 different skills', type: 'unique_skills', target: 3, xp: 150 },

  // Action count quests
  { id: 'dq_active5', name: 'Stay Active', desc: '5 total actions today', type: 'actions', target: 5, xp: 175 },
  { id: 'dq_active7', name: 'Grind Mode', desc: '7 total actions today', type: 'actions', target: 7, xp: 225 },
  { id: 'dq_active10', name: 'Unstoppable', desc: '10 total actions today', type: 'actions', target: 10, xp: 300 },
  { id: 'dq_active3', name: 'Getting Started', desc: '3 total actions today', type: 'actions', target: 3, xp: 100 },

  // Specific skill-action quests
  { id: 'dq_gym_day', name: 'Gym Day', desc: 'Hit the gym', type: 'skill_action', skill: 'strength', target: 1, xp: 100 },
  { id: 'dq_run_day', name: 'Runner\'s High', desc: 'Go for a run', type: 'skill_action', skill: 'endurance', target: 1, xp: 100 },
  { id: 'dq_read_day', name: 'Bookworm', desc: 'Read for 30 min', type: 'skill_action', skill: 'intellect', target: 1, xp: 100 },
  { id: 'dq_meditate', name: 'Zen State', desc: 'Meditate today', type: 'skill_action', skill: 'mind', target: 1, xp: 100 },
  { id: 'dq_sleep_well', name: 'Well Rested', desc: 'Get 7hr sleep', type: 'skill_action', skill: 'durability', target: 1, xp: 100 },
  { id: 'dq_clean_eat', name: 'Clean Machine', desc: 'Eat clean today', type: 'skill_action', skill: 'discipline', target: 1, xp: 100 },
  { id: 'dq_connect', name: 'Stay Connected', desc: 'Reach out to someone', type: 'skill_action', skill: 'social', target: 1, xp: 100 },

  // Combo quests
  { id: 'dq_body_mind', name: 'Body & Mind', desc: 'Strength + Mind action', type: 'unique_skills', target: 2, xp: 175 },
  { id: 'dq_warrior', name: 'Warrior Spirit', desc: 'Strength + Endurance + Discipline', type: 'unique_skills', target: 3, xp: 200 },
  { id: 'dq_scholar_warrior', name: 'Scholar Warrior', desc: 'Strength + Intellect', type: 'unique_skills', target: 2, xp: 175 },
  { id: 'dq_social_mind', name: 'Emotional IQ', desc: 'Social + Mind', type: 'unique_skills', target: 2, xp: 175 },

  // More variants for pool variety
  { id: 'dq_double_str', name: 'Double Down: STR', desc: '2 Strength actions', type: 'skill_count', skill: 'strength', target: 2, xp: 140 },
  { id: 'dq_double_end', name: 'Double Down: END', desc: '2 Endurance actions', type: 'skill_count', skill: 'endurance', target: 2, xp: 140 },
  { id: 'dq_double_dis', name: 'Double Down: DIS', desc: '2 Discipline actions', type: 'skill_count', skill: 'discipline', target: 2, xp: 140 },
  { id: 'dq_double_int', name: 'Double Down: INT', desc: '2 Intellect actions', type: 'skill_count', skill: 'intellect', target: 2, xp: 140 },
  { id: 'dq_double_soc', name: 'Double Down: SOC', desc: '2 Social actions', type: 'skill_count', skill: 'social', target: 2, xp: 140 },
  { id: 'dq_double_mnd', name: 'Double Down: MND', desc: '2 Mind actions', type: 'skill_count', skill: 'mind', target: 2, xp: 140 },
  { id: 'dq_double_dur', name: 'Double Down: DUR', desc: '2 Durability actions', type: 'skill_count', skill: 'durability', target: 2, xp: 140 },

  { id: 'dq_grinder4', name: 'The Grinder', desc: '4 total actions', type: 'actions', target: 4, xp: 125 },
  { id: 'dq_grinder6', name: 'Non-Stop', desc: '6 total actions', type: 'actions', target: 6, xp: 200 },
  { id: 'dq_grinder8', name: 'Machine Mode', desc: '8 total actions', type: 'actions', target: 8, xp: 250 },

  { id: 'dq_morning_routine', name: 'Morning Routine', desc: 'Discipline + Durability', type: 'unique_skills', target: 2, xp: 150 },
  { id: 'dq_evening_wind', name: 'Evening Wind Down', desc: 'Mind + Durability', type: 'unique_skills', target: 2, xp: 150 },
  { id: 'dq_full_body', name: 'Full Body', desc: 'Strength + Endurance', type: 'unique_skills', target: 2, xp: 150 },
  { id: 'dq_brain_body', name: 'Brain & Body', desc: 'Intellect + Endurance', type: 'unique_skills', target: 2, xp: 150 },

  { id: 'dq_quad', name: 'Quad Stack', desc: '4 actions in any skill', type: 'actions', target: 4, xp: 150 },
  { id: 'dq_penta', name: 'Penta Kill', desc: '5 different skills', type: 'unique_skills', target: 5, xp: 225 },
  { id: 'dq_hexa', name: 'Hexa Grind', desc: '6 different skills', type: 'unique_skills', target: 6, xp: 275 },

  // Extra quests to reach ~81
  { id: 'dq_str_focus', name: 'Strength Focus', desc: 'Log Strength', type: 'skill_action', skill: 'strength', target: 1, xp: 80 },
  { id: 'dq_end_focus', name: 'Endurance Focus', desc: 'Log Endurance', type: 'skill_action', skill: 'endurance', target: 1, xp: 80 },
  { id: 'dq_dis_focus', name: 'Discipline Focus', desc: 'Log Discipline', type: 'skill_action', skill: 'discipline', target: 1, xp: 80 },
  { id: 'dq_int_focus', name: 'Intellect Focus', desc: 'Log Intellect', type: 'skill_action', skill: 'intellect', target: 1, xp: 80 },
  { id: 'dq_soc_focus', name: 'Social Focus', desc: 'Log Social', type: 'skill_action', skill: 'social', target: 1, xp: 80 },
  { id: 'dq_mnd_focus', name: 'Mind Focus', desc: 'Log Mind', type: 'skill_action', skill: 'mind', target: 1, xp: 80 },
  { id: 'dq_dur_focus', name: 'Durability Focus', desc: 'Log Durability', type: 'skill_action', skill: 'durability', target: 1, xp: 80 },

  { id: 'dq_beast_mode', name: 'Beast Mode', desc: '12 total actions', type: 'actions', target: 12, xp: 350 },
  { id: 'dq_legend_day', name: 'Legendary Day', desc: '15 total actions', type: 'actions', target: 15, xp: 500 },
  { id: 'dq_str4', name: 'Strength Overload', desc: '4 Strength actions', type: 'skill_count', skill: 'strength', target: 4, xp: 250 },
  { id: 'dq_dis4', name: 'Self-Mastery', desc: '4 Discipline actions', type: 'skill_count', skill: 'discipline', target: 4, xp: 250 },

  { id: 'dq_soul_body', name: 'Soul & Body', desc: 'Mind + Strength', type: 'unique_skills', target: 2, xp: 150 },
  { id: 'dq_social_butterfly', name: 'Social Butterfly', desc: '3 Social actions', type: 'skill_count', skill: 'social', target: 3, xp: 200 },
  { id: 'dq_monk', name: 'The Monk', desc: '3 Mind actions', type: 'skill_count', skill: 'mind', target: 3, xp: 200 },
  { id: 'dq_tank', name: 'The Tank', desc: '3 Durability actions', type: 'skill_count', skill: 'durability', target: 3, xp: 200 },
  { id: 'dq_quick2', name: 'Quick Two', desc: '2 actions any skill', type: 'actions', target: 2, xp: 75 },
  { id: 'dq_warmup', name: 'Warm Up', desc: '1 action any skill', type: 'actions', target: 1, xp: 50 },

  { id: 'dq_productivity', name: 'Productivity Burst', desc: 'Intellect + Discipline', type: 'unique_skills', target: 2, xp: 175 },
  { id: 'dq_health_day', name: 'Health Day', desc: 'Durability + Endurance + Discipline', type: 'unique_skills', target: 3, xp: 200 },
  { id: 'dq_mind_body_spirit', name: 'Mind Body Spirit', desc: 'Strength + Mind + Durability', type: 'unique_skills', target: 3, xp: 200 },
  { id: 'dq_social_scholar', name: 'Social Scholar', desc: 'Social + Intellect', type: 'unique_skills', target: 2, xp: 150 },
  { id: 'dq_night_owl', name: 'Night Owl', desc: '3 actions after 6pm', type: 'actions', target: 3, xp: 125 },
  { id: 'dq_starter', name: 'Day Starter', desc: '2 actions', type: 'actions', target: 2, xp: 80 },
  { id: 'dq_trio', name: 'Power Trio', desc: '3 different skills', type: 'unique_skills', target: 3, xp: 160 },
  { id: 'dq_duo', name: 'Dynamic Duo', desc: '2 different skills', type: 'unique_skills', target: 2, xp: 120 },
  { id: 'dq_nine', name: 'Nine Lives', desc: '9 actions', type: 'actions', target: 9, xp: 275 },
  { id: 'dq_eleven', name: 'Turn It Up', desc: '11 actions', type: 'actions', target: 11, xp: 325 },
];

// --- Weekly Quest Pool (29 quests) ---
export const WEEKLY_QUESTS: Quest[] = [
  { id: 'wq_str_covenant', name: 'Strength Covenant', desc: '15 Strength actions this week', type: 'skill_count', skill: 'strength', target: 15, xp: 800 },
  { id: 'wq_end_covenant', name: 'Endurance Covenant', desc: '15 Endurance actions', type: 'skill_count', skill: 'endurance', target: 15, xp: 800 },
  { id: 'wq_dis_covenant', name: 'Discipline Covenant', desc: '15 Discipline actions', type: 'skill_count', skill: 'discipline', target: 15, xp: 800 },
  { id: 'wq_int_covenant', name: 'Intellect Covenant', desc: '15 Intellect actions', type: 'skill_count', skill: 'intellect', target: 15, xp: 800 },
  { id: 'wq_soc_covenant', name: 'Social Covenant', desc: '10 Social actions', type: 'skill_count', skill: 'social', target: 10, xp: 700 },
  { id: 'wq_mnd_covenant', name: 'Mind Covenant', desc: '10 Mind actions', type: 'skill_count', skill: 'mind', target: 10, xp: 700 },
  { id: 'wq_dur_covenant', name: 'Durability Covenant', desc: '10 Durability actions', type: 'skill_count', skill: 'durability', target: 10, xp: 700 },

  { id: 'wq_legendary', name: 'Legendary Week', desc: '50 total actions', type: 'actions', target: 50, xp: 1200 },
  { id: 'wq_consistent', name: 'Consistency King', desc: '30 total actions', type: 'actions', target: 30, xp: 800 },
  { id: 'wq_grinder', name: 'Weekly Grinder', desc: '20 total actions', type: 'actions', target: 20, xp: 500 },
  { id: 'wq_starter', name: 'Weekly Starter', desc: '10 total actions', type: 'actions', target: 10, xp: 300 },

  { id: 'wq_renaissance', name: 'Renaissance Master', desc: 'All 7 skills this week', type: 'unique_skills', target: 7, xp: 1500 },
  { id: 'wq_balanced', name: 'Balanced Life', desc: '5 different skills this week', type: 'unique_skills', target: 5, xp: 600 },
  { id: 'wq_explorer', name: 'Skill Explorer', desc: '4 different skills', type: 'unique_skills', target: 4, xp: 400 },
  { id: 'wq_dual', name: 'Dual Focus', desc: '3 different skills', type: 'unique_skills', target: 3, xp: 250 },

  { id: 'wq_warrior_week', name: 'Warrior Week', desc: '10 STR + 10 END', type: 'actions', target: 20, xp: 900 },
  { id: 'wq_mind_week', name: 'Mindful Week', desc: '10 Mind actions', type: 'skill_count', skill: 'mind', target: 10, xp: 600 },
  { id: 'wq_social_week', name: 'Social Butterfly Week', desc: '8 Social actions', type: 'skill_count', skill: 'social', target: 8, xp: 500 },
  { id: 'wq_mega_grind', name: 'Mega Grind', desc: '70 total actions', type: 'actions', target: 70, xp: 2000 },
  { id: 'wq_ultra_grind', name: 'Ultra Grind', desc: '40 total actions', type: 'actions', target: 40, xp: 1000 },

  { id: 'wq_str8', name: 'Power Week', desc: '8 Strength actions', type: 'skill_count', skill: 'strength', target: 8, xp: 500 },
  { id: 'wq_end8', name: 'Stamina Week', desc: '8 Endurance actions', type: 'skill_count', skill: 'endurance', target: 8, xp: 500 },
  { id: 'wq_dis8', name: 'Willpower Week', desc: '8 Discipline actions', type: 'skill_count', skill: 'discipline', target: 8, xp: 500 },
  { id: 'wq_int8', name: 'Brain Week', desc: '8 Intellect actions', type: 'skill_count', skill: 'intellect', target: 8, xp: 500 },
  { id: 'wq_dur8', name: 'Recovery Week', desc: '8 Durability actions', type: 'skill_count', skill: 'durability', target: 8, xp: 500 },

  { id: 'wq_all_rounder', name: 'All-Rounder', desc: '6 different skills', type: 'unique_skills', target: 6, xp: 1000 },
  { id: 'wq_15_actions', name: 'Halfway Mark', desc: '15 total actions', type: 'actions', target: 15, xp: 400 },
  { id: 'wq_25_actions', name: 'Quarter Century', desc: '25 total actions', type: 'actions', target: 25, xp: 650 },
  { id: 'wq_35_actions', name: 'Marathon Week', desc: '35 total actions', type: 'actions', target: 35, xp: 900 },
];

// --- Seeded Shuffle (deterministic) ---
function dateHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function todayStr(): string {
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

export function getDailyQuests(date?: string): Quest[] {
  const d = date || todayStr();
  const seed = dateHash('daily_' + d);
  return seededShuffle(DAILY_QUESTS, seed).slice(0, 5);
}

export function getWeeklyQuests(weekKey?: string): Quest[] {
  const wk = weekKey || getWeekKey();
  const seed = dateHash('weekly_' + wk);
  return seededShuffle(WEEKLY_QUESTS, seed).slice(0, 3);
}

// --- Quest Progress Calculation ---
export function getQuestProgress(quest: Quest, log: ActionLogEntry[]): number {
  switch (quest.type) {
    case 'actions':
      return log.length;
    case 'unique_skills':
      return new Set(log.map(l => l.skillId)).size;
    case 'skill_count':
      return log.filter(l => l.skillId === quest.skill).length;
    case 'skill_action':
      return log.filter(l => l.skillId === quest.skill).length > 0 ? 1 : 0;
    default:
      return 0;
  }
}

export function isQuestComplete(quest: Quest, log: ActionLogEntry[]): boolean {
  return getQuestProgress(quest, log) >= quest.target;
}
