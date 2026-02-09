// ============================================
// LIFEQUEST - Skill Definitions
// All 7 skills + Money category with updated colors
// ============================================

import { SkillDefinition } from '../types';

export const SKILL_DEFS: SkillDefinition[] = [
  {
    id: 'strength',
    name: 'Strength',
    icon: '💪',
    color: '#EF4444', // Red - physical power
    desc: 'Lifting, physical training, raw power',
    actions: [
      { id: 'gym', name: 'Gym Session', xp: 75, desc: 'Hit the weights' },
      { id: 'home_workout', name: 'Home Workout', xp: 50, desc: 'Bodyweight training at home' },
      { id: 'give_me_10', name: 'Give Me 10', xp: 2, desc: 'Quick 10 reps of anything' },
      { id: 'martial_arts', name: 'Martial Arts', xp: 70, desc: 'Combat training session' },
    ],
  },
  {
    id: 'endurance',
    name: 'Endurance',
    icon: '🏃',
    color: '#F97316', // Orange - closer to red on color wheel
    desc: 'Cardio, consistency, stamina',
    actions: [
      { id: 'run_30', name: 'Run 30min', xp: 60, desc: '30 minute run' },
      { id: 'sports_1hr', name: 'Sports Activity 1hr+', xp: 70, desc: 'Active sport for 1+ hours' },
      { id: 'hiit_30', name: 'HIIT 30min', xp: 90, desc: 'High intensity interval training' },
      { id: 'steps_2500', name: '2,500 Steps', xp: 7, desc: 'Walk 2500 steps' },
    ],
  },
  {
    id: 'discipline',
    name: 'Discipline',
    icon: '⚔️',
    color: '#EAB308', // Yellow/Gold - golden willpower
    desc: 'Habits, streaks, routines',
    actions: [
      { id: 'early_bird', name: 'Early Bird', xp: 30, desc: 'Wake up early' },
      { id: 'worked_out', name: 'Worked Out', xp: 50, desc: 'Completed a workout' },
      { id: 'cold_shower', name: 'Cold Shower', xp: 20, desc: 'Took a cold shower' },
      { id: 'ate_clean', name: 'Ate Clean', xp: 50, desc: 'Clean eating all day' },
      { id: 'f_vices', name: 'F My Vices', xp: 60, desc: 'Resisted temptation' },
    ],
  },
  {
    id: 'intellect',
    name: 'Intellect',
    icon: '🧠',
    color: '#3B82F6', // Blue - mental/brain
    desc: 'Studying, reading, learning',
    actions: [
      { id: 'reading_30', name: 'Reading 30min', xp: 40, desc: '30 minutes of reading' },
      { id: 'course', name: 'Course / Lecture', xp: 60, desc: 'Completed a lesson' },
      { id: 'deep_work', name: 'Deep Work 1hr', xp: 80, desc: '1 hour of focused work' },
      { id: 'writing', name: 'Writing / Creating', xp: 50, desc: 'Creative output' },
      { id: 'coding', name: 'Coding Session', xp: 50, desc: 'Programming work' },
      { id: 'instrument', name: 'Play Instrument', xp: 40, desc: 'Music practice' },
      { id: 'podcast', name: 'Podcast / Documentary', xp: 25, desc: 'Educational content' },
    ],
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    color: '#EC4899', // Pink - social/heart
    desc: 'Conversations, networking, dating',
    actions: [
      { id: 'whatsapp', name: 'WhatsApp Friend', xp: 50, desc: 'Messaged a friend' },
      { id: 'new_connection', name: 'New Connection', xp: 80, desc: 'Met someone new' },
      { id: 'social_event', name: 'Social Event', xp: 70, desc: 'Attended a gathering' },
      { id: 'call_family', name: 'Call Family', xp: 40, desc: 'Called a family member' },
    ],
  },
  {
    id: 'mind',
    name: 'Mind',
    icon: '🧘',
    color: '#8B5CF6', // Purple - spiritual/mind
    desc: 'Meditation, faith, emotional regulation',
    actions: [
      { id: 'meditation', name: 'Meditation 15min', xp: 50, desc: '15 minutes of meditation' },
      { id: 'breathwork', name: 'Breathwork', xp: 30, desc: 'Breathing exercises' },
      { id: 'therapy', name: 'Therapy / Coaching', xp: 100, desc: 'Professional session' },
      { id: 'gratitude', name: 'Gratitude Practice', xp: 25, desc: 'Write down what you\'re grateful for' },
      { id: 'church', name: 'Go To Church', xp: 200, desc: 'Attended service' },
      { id: 'pray', name: 'Pray', xp: 20, desc: 'Prayer session' },
    ],
  },
  {
    id: 'durability',
    name: 'Durability',
    icon: '🛡️',
    color: '#14B8A6', // Teal - health/healing
    desc: 'Sleep, recovery, health upkeep',
    actions: [
      { id: 'sleep_7hr', name: '7hr Sleep', xp: 70, desc: 'Got 7+ hours of sleep' },
      { id: 'vitamins', name: 'Drink Vitamins', xp: 30, desc: 'Took vitamins/supplements' },
      { id: 'cold_sauna', name: 'Cold Shower / Sauna', xp: 40, desc: 'Recovery session' },
      { id: 'stretching', name: 'Stretching / Mobility', xp: 30, desc: 'Flexibility work' },
    ],
  },
  {
    id: 'money',
    name: 'Money',
    icon: '💰',
    color: '#22C55E', // Green - money green
    desc: 'Net worth tracking, financial growth',
    actions: [], // No actions - levels based on net worth input
  },
];

export function getSkillDef(skillId: string): SkillDefinition | undefined {
  return SKILL_DEFS.find(s => s.id === skillId);
}

export function getSkillAction(skillId: string, actionId: string) {
  const skill = getSkillDef(skillId);
  return skill?.actions.find(a => a.id === actionId);
}

export function getAllSkillIds(): string[] {
  return SKILL_DEFS.map(s => s.id);
}

export function getDefaultSkills() {
  return SKILL_DEFS.map(s => ({ id: s.id, xp: 0 }));
}
