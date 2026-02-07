'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useGameStore } from '@/store/useGameStore';
import { useAuth } from './useAuth';

/**
 * Syncs game state between Zustand store and Supabase.
 * Call this at the dashboard layout level.
 */
export function useGameSync() {
  const { user } = useAuth();
  const setSkills = useGameStore(s => s.setSkills);
  const setLog = useGameStore(s => s.setLog);
  const setAchievements = useGameStore(s => s.setAchievements);
  const setStreaks = useGameStore(s => s.setStreaks);
  const supabase = createClient();

  // Load initial game state from Supabase
  const loadGameState = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch skills
      const { data: skills } = await supabase
        .from('skills')
        .select('skill_id, xp')
        .eq('user_id', user.id);

      if (skills) {
        setSkills(skills.map(s => ({ id: s.skill_id as any, xp: Number(s.xp) })));
      }

      // Fetch recent action logs (last 500)
      const { data: logs } = await supabase
        .from('action_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(500);

      if (logs) {
        setLog(logs.map(l => ({
          id: String(l.id),
          skillId: l.skill_id as any,
          actionId: l.action_id,
          actionName: l.action_name,
          xp: l.xp_earned,
          baseXp: l.base_xp,
          streakBonus: l.streak_bonus,
          timestamp: new Date(l.logged_at).getTime(),
        })));
      }

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (achievements) {
        setAchievements(achievements.map(a => a.achievement_id));
      }

      // Fetch streaks
      const { data: streaks } = await supabase
        .from('streaks')
        .select('skill_id, current_streak, best_streak, last_active_date')
        .eq('user_id', user.id);

      if (streaks) {
        const global = streaks.find(s => !s.skill_id);
        const perSkill: Record<string, any> = {};
        streaks.filter(s => s.skill_id).forEach(s => {
          perSkill[s.skill_id!] = {
            current: s.current_streak,
            best: s.best_streak,
            lastActiveDate: s.last_active_date,
          };
        });

        setStreaks({
          global: {
            current: global?.current_streak || 0,
            best: global?.best_streak || 0,
            lastActiveDate: global?.last_active_date || null,
          },
          perSkill,
        });
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }, [user, supabase, setSkills, setLog, setAchievements, setStreaks]);

  // Save action to Supabase
  const syncAction = useCallback(async (
    skillId: string,
    actionId: string,
    actionName: string,
    xpEarned: number,
    baseXp: number,
    streakBonus: number
  ) => {
    if (!user) return;

    try {
      // Insert action log
      await supabase.from('action_logs').insert({
        user_id: user.id,
        skill_id: skillId,
        action_id: actionId,
        action_name: actionName,
        xp_earned: xpEarned,
        base_xp: baseXp,
        streak_bonus: streakBonus,
      });

      // Update skill XP
      await supabase.rpc('increment_skill_xp', {
        p_user_id: user.id,
        p_skill_id: skillId,
        p_xp: xpEarned,
      });
    } catch (error) {
      console.error('Failed to sync action:', error);
      // TODO: Queue for offline sync
    }
  }, [user, supabase]);

  // Load on mount
  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  return { loadGameState, syncAction };
}
