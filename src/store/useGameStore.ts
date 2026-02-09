// ============================================
// LIFEQUEST — Game State Store (Zustand)
// ============================================

import { create } from 'zustand';
import { SkillState, ActionLogEntry, StreakData, PenaltyState, QuestCompletion, TodoItem, SkillId } from '@/lib/types';
import { getLevel, getTotalLevel, getTitle, getStreakMultiplier, getDecayAmount } from '@/lib/game-logic/levelSystem';
import { getDefaultSkills, SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { getDailyQuests, getWeeklyQuests, getQuestProgress, isQuestComplete, todayStr, getWeekKey } from '@/lib/game-logic/questSystem';
import { checkAchievements, getAchievement, ACHIEVEMENTS } from '@/lib/game-logic/achievementSystem';
import { updateStreak, getDefaultStreaks, getStreakMultiplier as streakMult } from '@/lib/game-logic/streakSystem';
import { getDefaultPenalty, checkDailyPenalty } from '@/lib/game-logic/hardcoreMode';

interface GameStore {
  // Core state
  skills: SkillState[];
  log: ActionLogEntry[];
  unlockedAchievements: string[];
  completedAchievementRewards: string[];
  streaks: { global: StreakData; perSkill: Record<string, StreakData> };
  hardcoreMode: boolean;
  penalty: PenaltyState;
  completedQuests: QuestCompletion;
  todos: { lastResetDate: string; items: TodoItem[] };
  lastDecayDate: string | null;

  // Computed
  totalLevel: () => number;
  title: () => string;

  // Actions
  logAction: (skillId: SkillId, actionId: string, actionName: string, baseXp: number) => {
    xpEarned: number;
    leveledUp: boolean;
    previousLevel: number;
    newLevel: number;
    newAchievements: string[];
    questsCompleted: string[];
  };
  toggleHardcore: () => void;
  addTodo: (skillId: SkillId, actionId: string, actionName: string) => void;
  removeTodo: (index: number) => void;
  toggleTodo: (index: number) => void;
  resetTodosIfNeeded: () => void;
  checkDecay: () => { decayed: boolean; losses: { skillId: string; amount: number }[] };
  loadState: (state: Partial<GameStore>) => void;
  setSkills: (skills: SkillState[]) => void;
  setLog: (log: ActionLogEntry[]) => void;
  setAchievements: (ids: string[]) => void;
  setStreaks: (streaks: { global: StreakData; perSkill: Record<string, StreakData> }) => void;
  completeQuest: (questId: string, type: 'daily' | 'weekly') => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  skills: getDefaultSkills() as SkillState[],
  log: [],
  unlockedAchievements: [],
  completedAchievementRewards: [],
  streaks: getDefaultStreaks(),
  hardcoreMode: false,
  penalty: getDefaultPenalty(),
  completedQuests: { dailyDate: todayStr(), daily: {}, weeklyDate: getWeekKey(), weekly: {} },
  todos: { lastResetDate: todayStr(), items: [] },
  lastDecayDate: null,

  totalLevel: () => getTotalLevel(get().skills),
  title: () => getTitle(getTotalLevel(get().skills), get().hardcoreMode, get().penalty.tier),

  logAction: (skillId, actionId, actionName, baseXp) => {
    const state = get();
    const skillIndex = state.skills.findIndex(s => s.id === skillId);
    if (skillIndex === -1) return { xpEarned: 0, leveledUp: false, previousLevel: 0, newLevel: 0, newAchievements: [], questsCompleted: [] };

    // Calculate streak bonus
    const globalStreak = state.streaks.global.current;
    const multiplier = getStreakMultiplier(globalStreak);
    const streakBonus = Math.floor(baseXp * (multiplier - 1));
    const totalXp = baseXp + streakBonus;

    const previousLevel = getLevel(state.skills[skillIndex].xp);

    // Update skill XP
    const newSkills = [...state.skills];
    newSkills[skillIndex] = { ...newSkills[skillIndex], xp: newSkills[skillIndex].xp + totalXp };
    const newLevel = getLevel(newSkills[skillIndex].xp);

    // Create log entry
    const entry: ActionLogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      skillId,
      actionId,
      actionName,
      xp: totalXp,
      baseXp,
      streakBonus,
      timestamp: Date.now(),
    };

    // Update streaks
    const newGlobalStreak = updateStreak(state.streaks.global);
    const skillStreak = state.streaks.perSkill[skillId] || { current: 0, best: 0, lastActiveDate: null };
    const newSkillStreak = updateStreak(skillStreak);

    const newStreaks = {
      global: newGlobalStreak,
      perSkill: { ...state.streaks.perSkill, [skillId]: newSkillStreak },
    };

    const newLog = [entry, ...state.log].slice(0, 500); // Keep last 500

    // Auto-complete matching todos
    const newTodos = { ...state.todos };
    newTodos.items = newTodos.items.map(t =>
      t.skillId === skillId && t.actionId === actionId && !t.completed
        ? { ...t, completed: true }
        : t
    );

    // Check achievements
    const totalLvl = getTotalLevel(newSkills);
    const totalActions = newLog.length;
    const newAchievements = checkAchievements({
      skills: newSkills,
      log: newLog,
      unlockedAchievements: state.unlockedAchievements,
      globalStreak: newGlobalStreak.current,
      totalActions,
      totalLevel: totalLvl,
    });

    // Check quest completion
    const today = todayStr();
    const weekKey = getWeekKey();
    const todayLog = newLog.filter(l => {
      const d = new Date(l.timestamp);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === today;
    });
    const weekLog = newLog.filter(l => {
      const d = new Date(l.timestamp);
      const logDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const weekStart = new Date(weekKey);
      return logDate >= weekStart;
    });

    const dailyQuests = getDailyQuests(today);
    const weeklyQuests = getWeeklyQuests(weekKey);
    const questsCompleted: string[] = [];

    const newCompletedQuests = { ...state.completedQuests };
    if (newCompletedQuests.dailyDate !== today) {
      newCompletedQuests.dailyDate = today;
      newCompletedQuests.daily = {};
    }
    if (newCompletedQuests.weeklyDate !== weekKey) {
      newCompletedQuests.weeklyDate = weekKey;
      newCompletedQuests.weekly = {};
    }

    for (const q of dailyQuests) {
      if (!newCompletedQuests.daily[q.id] && isQuestComplete(q, todayLog)) {
        newCompletedQuests.daily[q.id] = true;
        questsCompleted.push(q.id);
      }
    }
    for (const q of weeklyQuests) {
      if (!newCompletedQuests.weekly[q.id] && isQuestComplete(q, weekLog)) {
        newCompletedQuests.weekly[q.id] = true;
        questsCompleted.push(q.id);
      }
    }

    set({
      skills: newSkills,
      log: newLog,
      streaks: newStreaks,
      unlockedAchievements: [...state.unlockedAchievements, ...newAchievements],
      completedQuests: newCompletedQuests,
      todos: newTodos,
    });

    return {
      xpEarned: totalXp,
      leveledUp: newLevel > previousLevel,
      previousLevel,
      newLevel,
      newAchievements,
      questsCompleted,
    };
  },

  toggleHardcore: () => {
    set(s => ({
      hardcoreMode: !s.hardcoreMode,
      penalty: !s.hardcoreMode ? getDefaultPenalty() : s.penalty,
    }));
  },

  addTodo: (skillId, actionId, actionName) => {
    set(s => ({
      todos: {
        ...s.todos,
        items: [...s.todos.items, {
          id: `todo_${Date.now()}`,
          skillId,
          actionId,
          actionName,
          completed: false,
        }],
      },
    }));
  },

  removeTodo: (index) => {
    set(s => ({
      todos: {
        ...s.todos,
        items: s.todos.items.filter((_, i) => i !== index),
      },
    }));
  },

  toggleTodo: (index) => {
    set(s => ({
      todos: {
        ...s.todos,
        items: s.todos.items.map((t, i) => i === index ? { ...t, completed: !t.completed } : t),
      },
    }));
  },

  resetTodosIfNeeded: () => {
    const today = todayStr();
    if (get().todos.lastResetDate !== today) {
      set({ todos: { lastResetDate: today, items: [] } });
    }
  },

  checkDecay: () => {
    const state = get();
    const today = todayStr();
    if (state.lastDecayDate === today) return { decayed: false, losses: [] };

    // Check if any skill was logged yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

    const loggedYesterday = state.log.some(l => {
      const d = new Date(l.timestamp);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === yesterdayStr;
    });

    if (loggedYesterday || !state.lastDecayDate) {
      set({ lastDecayDate: today });
      return { decayed: false, losses: [] };
    }

    // Apply decay with protection against dropping below level 1
    const losses: { skillId: string; amount: number }[] = [];
    const newSkills = state.skills.map(s => {
      if (s.xp <= 0) return s;
      const amount = getDecayAmount(s.xp);
      losses.push({ skillId: s.id, amount });

      // Calculate the new XP after decay, but never allow it to go negative
      const newXp = Math.max(0, s.xp - amount);

      return { ...s, xp: newXp };
    });

    set({ skills: newSkills, lastDecayDate: today });
    return { decayed: true, losses };
  },

  loadState: (state) => set(state),
  setSkills: (skills) => set({ skills }),
  setLog: (log) => set({ log }),
  setAchievements: (ids) => set({ unlockedAchievements: ids }),
  setStreaks: (streaks) => set({ streaks }),
  completeQuest: (questId, type) => {
    set(s => {
      const newCompleted = { ...s.completedQuests };
      if (type === 'daily') newCompleted.daily = { ...newCompleted.daily, [questId]: true };
      else newCompleted.weekly = { ...newCompleted.weekly, [questId]: true };
      return { completedQuests: newCompleted };
    });
  },
}));
