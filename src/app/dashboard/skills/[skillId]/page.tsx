'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { getLevel, getXpProgress, getXpToNext, getSkillTitle } from '@/lib/game-logic/levelSystem';
import { SKILL_DEFS, getSkillDef } from '@/lib/game-logic/skillSystem';
import { todayStr } from '@/lib/game-logic/questSystem';
import { SkillId } from '@/lib/types';
import ProgressBar from '@/components/Shared/ProgressBar';

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.skillId as string;

  const skills = useGameStore(s => s.skills);
  const log = useGameStore(s => s.log);
  const streaks = useGameStore(s => s.streaks);
  const logAction = useGameStore(s => s.logAction);
  const showToast = useUIStore(s => s.showToast);

  const skillDef = getSkillDef(skillId);
  const skill = skills.find(s => s.id === skillId);

  if (!skillDef || !skill) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Skill not found</p>
        <Link href="/dashboard" className="text-accent-gold mt-4 inline-block">
          ← Back
        </Link>
      </div>
    );
  }

  const level = getLevel(skill.xp);
  const skillTitle = getSkillTitle(skillId, level);
  const xpProgress = getXpProgress(skill.xp);
  const xpToNext = getXpToNext(skill.xp);

  const skillStreak = streaks.perSkill[skillId];
  const streakMultiplier = skillStreak?.current || 0;
  const streakBonus = streakMultiplier > 0 ? `+${Math.min(streakMultiplier * 10, 50)}%` : '0%';

  // Check if skill was logged today
  const today = todayStr();
  const todayLog = log.filter(l => {
    const d = new Date(l.timestamp);
    return (
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === today
    );
  });
  const loggedToday = todayLog.some(l => l.skillId === skillId);

  // Recent activity for this skill (last 10)
  const skillLog = log.filter(l => l.skillId === skillId).slice(0, 10);

  // Handle action logging
  const handleLogAction = (actionId: string, actionName: string, baseXp: number) => {
    const result = logAction(skillId as SkillId, actionId, actionName, baseXp);
    showToast(`+${result.xpEarned} XP from ${actionName}`, 'xp');
    if (result.leveledUp) {
      showToast(`${skillDef.name} Level ${result.newLevel}!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 pb-4">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{skillDef.icon}</span>
            <h1 className="text-2xl font-bold">{skillDef.name}</h1>
          </div>
        </div>
      </div>

      {/* Skill Header Info */}
      <div className="glass rounded-xl p-5 border border-border-subtle space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-text-secondary">Level</div>
            <div className="text-3xl font-bold" style={{ color: skillDef.color }}>
              {level}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-text-secondary">Title</div>
            <div className="text-xl font-bold">{skillTitle}</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-secondary">XP Progress</span>
            <span className="text-xs text-text-muted">
              {skill.xp} / (next in {xpToNext})
            </span>
          </div>
          <ProgressBar progress={xpProgress} color={skillDef.color} height={10} />
        </div>
      </div>

      {/* Streak Info */}
      <div className="glass rounded-xl p-4 border border-border-subtle">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-text-secondary">Current Streak</div>
            <div className="text-2xl font-bold">
              {skillStreak?.current || 0} {skillStreak && skillStreak.current > 0 ? '🔥' : ''}
            </div>
            <div className="text-xs text-text-muted">
              Best: {skillStreak?.best || 0}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-text-secondary">Streak Bonus</div>
            <div className="text-2xl font-bold" style={{ color: skillDef.color }}>
              {streakBonus}
            </div>
          </div>
        </div>
      </div>

      {/* Decay Warning */}
      {!loggedToday && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-600 text-sm">
          ⚠️ Skill not logged today. Log an action to maintain your streak and avoid decay!
        </div>
      )}

      {/* Action Buttons Grid */}
      <div>
        <h2 className="font-bold text-lg mb-3">Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {skillDef.actions.map(action => (
            <button
              key={action.id}
              onClick={() => handleLogAction(action.id, action.name, action.xp)}
              className="glass rounded-xl p-4 border border-border-subtle hover:border-border-active hover:bg-bg-secondary/40 transition-all text-left"
            >
              <div className="text-sm font-medium">{action.name}</div>
              <div className="text-xs text-text-muted mt-1">{action.desc}</div>
              <div className="text-accent-gold font-bold mt-2">+{action.xp} XP</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {skillLog.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {skillLog.map(entry => (
              <div
                key={entry.id}
                className="glass rounded-xl p-4 border border-border-subtle flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium">{entry.actionName}</div>
                  <div className="text-xs text-text-muted">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-accent-gold font-bold">+{entry.xp} XP</div>
                  {entry.streakBonus > 0 && (
                    <div className="text-xs text-yellow-500">
                      +{entry.streakBonus} streak
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {skillLog.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p>No activity yet. Log your first action!</p>
        </div>
      )}
    </div>
  );
}
