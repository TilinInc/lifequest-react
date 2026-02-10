// ============================================
// LIFEQUEST — Game State Store (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SkillState, ActionLogEntry, StreakData, PenaltyState, QuestCompletion, TodoItem, SkillId, MoneyEntry, ProgressPicture, WeightEntry } from '@/lib/types';
import { getLevel, getTotalLevel, getTitle, getStreakMultiplier, getDecayAmount, getMoneyLevel } from '@/lib/game-logic/levelSystem';
import { getDefaultSkills, SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { getDailyQuests, getWeeklyQuests, getQuestProgress, isQuestComplete, todayStr, getWeekKey } from '@/lib/game-logic/questSystem';
import { checkAchievements, getAchievement, ACHIEVEMENTS } from '@/lib/game-logic/achievementSystem';
import { updateStreak, getDefaultStreaks, getStreakMultiplier as streakMult } from '@/lib/game-logic/streakSystem';
import { getDefaultPenalty, checkDailyPenalty } from '@/lib/game-logic/hardcoreMode';
import { checkBadges } from '@/lib/game-logic/badgeSystem';

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
  progressPictures: { uploads: ProgressPicture[] };
  weightLog: { entries: WeightEntry[] };
  moneyLog: {
    entries: MoneyEntry[];
    currentNetWorth: number;
  };
  profilePicture: string | null;
  unlockedBadges: string[];
  customActions: Record<string, { id: string; name: string; xp: number; custom: true }[]>;

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
    newBadges: string[];
  };
  logNetWorth: (netWorth: number, note?: string) => {
    previousLevel: number;
    newLevel: number;
    leveledUp: boolean;
  };
  toggleHardcore: () => void;
  addTodo: (skillId: SkillId, actionId: string, actionName: string) => void;
  removeTodo: (index: number) => void;
  toggleTodo: (index: number) => void;
  resetTodosIfNeeded: () => void;
  checkDecay: () => { decayed: boolean; losses: { skillId: string; amount: number }[] };
  setProfilePicture: (dataUrl: string | null) => void;
  loadState: (state: Partial<GameStore>) => void;
  setSkills: (skills: SkillState[]) => void;
  setLog: (log: ActionLogEntry[]) => void;
  setAchievements: (ids: string[]) => void;
  setStreaks: (streaks: { global: StreakData; perSkill: Record<string, StreakData> }) => void;
  completeQuest: (questId: string, type: 'daily' | 'weekly') => void;
  addCustomAction: (skillId: string, name: string, xp: number) => void;
  removeCustomAction: (skillId: string, actionId: string) => void;
}

export const useGameStore = create<GameStore>()(persist((set, get) => ({
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
  progressPictures: { uploads: [] },
  weightLog: { entries: [] },
  moneyLog: { entries: [], currentNetWorth: 0 },
  profilePicture: null,
  unlockedBadges: [],
  customActions: {},

  totalLevel: () => getTotalLevel(get().skills),
  title: () => getTitle(getTotalLevel(get().skills), get().hardcoreMode, get().penalty.tier),

  logAction: (skillId, actionId, actionName, baseXp) => {
    const state = get();
    const skillIndex = state.skills.findIndex(s => s.id === skillId);
    if (skillIndex === -1) return { xpEarned: 0, leveledUp: false, previousLevel: 0, newLevel: 0, newAchievements: [], questsCompleted: [], newBadges: [] };

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

    // Check badges
    const newBadges = checkBadges(newSkills, state.unlockedBadges || []);

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
      unlockedBadges: [...(state.unlockedBadges || []), ...newBadges],
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
      newBadges,
    };
  },

  logNetWorth: (netWorth: number, note?: string) => {
    const state = get();
    const newTotal = state.moneyLog.currentNetWorth + netWorth;
    const entry: MoneyEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      dateStr: todayStr(),
      netWorth: newTotal,
      note,
    };
    const previousLevel = getMoneyLevel(state.moneyLog.currentNetWorth);
    const newLevel = getMoneyLevel(newTotal);

    set({
      moneyLog: {
        entries: [...state.moneyLog.entries, entry],
        currentNetWorth: newTotal,
      },
    });

    return {
      previousLevel,
      newLevel,
      leveledUp: newLevel > previousLevel,
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

    // First run — no decay on first use
    if (!state.lastDecayDate) {
      set({ lastDecayDate: today });
      return { decayed: false, losses: [] };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

    // Build a set of skill IDs that had activity yesterday (per-skill check)
    const activeSkillsYesterday = new Set<string>();
    for (const l of state.log) {
      const d = new Date(l.timestamp);
      const logDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (logDate === yesterdayStr) {
        activeSkillsYesterday.add(l.skillId);
      }
    }

    // Apply per-skill decay: only skills with NO activity yesterday lose XP
    // Money is excluded — it's net-worth-based, not XP-based
    // Progress Pictures and Weight Logs are optional trackers with no decay consequences
    const losses: { skillId: string; amount: number }[] = [];
    const newSkills = state.skills.map(s => {
      if (s.xp <= 0 || s.id === 'money') return s;
      // If this skill had activity yesterday, no decay
      if (activeSkillsYesterday.has(s.id)) return s;

      const amount = getDecayAmount(s.xp, state.hardcoreMode);
      losses.push({ skillId: s.id, amount });
      const newXp = Math.max(0, s.xp - amount);
      return { ...s, xp: newXp };
    });

    set({ skills: newSkills, lastDecayDate: today });
    return { decayed: losses.length > 0, losses };
  },

  setProfilePicture: (dataUrl) => set({ profilePicture: dataUrl }),

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
  addCustomAction: (skillId, name, xp) => {
    const cappedXp = Math.min(xp, 50); // Cap at 50 XP
    const newAction = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name,
      xp: cappedXp,
      custom: true as const,
    };
    set(s => ({
      customActions: {
        ...s.customActions,
        [skillId]: [...(s.customActions[skillId] || []), newAction],
      },
    }));
  },

  removeCustomAction: (skillId, actionId) => {
    set(s => ({
      customActions: {
        ...s.customActions,
        [skillId]: (s.customActions[skillId] || []).filter(a => a.id !== actionId),
      },
    }));
  },

}),
  {
    name: 'lifequest-game-state',
    version: 1,
    partialize: (state) => ({
      skills: state.skills,
      log: state.log,
      unlockedAchievements: state.unlockedAchievements,
      completedAchievementRewards: state.completedAchievementRewards,
      streaks: state.streaks,
      hardcoreMode: state.hardcoreMode,
      penalty: state.penalty,
      completedQuests: state.completedQuests,
      todos: state.todos,
      lastDecayDate: state.lastDecayDate,
      progressPictures: state.progressPictures,
      weightLog: state.weightLog,
      moneyLog: state.moneyLog,
      profilePicture: state.profilePicture,
      unlockedBadges: state.unlockedBadges,
      customActions: state.customActions,
    }),
  }
));
