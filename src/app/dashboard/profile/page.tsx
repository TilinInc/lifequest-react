// ============================================
// LIFEQUEST â Quest System
// 81 daily quests (5/day) + 29 weekly quests (3/week)
// ============================================

import { Quest, ActionLogEntry, SkillId } from '../types';

/- --- Daily Quest Pool (81 quests) ---
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
  { id: 'dq_dis
4', name: 'Self-Mastery', desc: '4 Discip+PÃP]e Xcti[cà¢ÂöFc