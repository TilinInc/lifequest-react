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
  const customActions = useGameStore(s => s.customActions);
  const addCustomAction = useGameStore(s => s.addCustomAction);
  const removeCustomAction = useGameStore(s => s.removeCustomAction);
  const showToast = useUIStore(s => s.showToast);
  const showLevelUpModal = useUIStore(s => s.showLevelUpModal);

  const [newName, setNewName] = useState('');
  const [newXp, setNewXp] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

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
  const skillCustomActions = customActions[skillId] || [];

  const today = todayStr();
  const todayLog = log.filter(l => {
    const d = new Date(l.timestamp);
    return (
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === today
    );
  });
  const loggedToday = todayLog.some(l => l.skillId === skillId);
  const todayCount = todayLog.filter(l => l.skillId === skillId).length;
  const skillLog = log.filter(l => l.skillId === skillId).slice(0, 10);

  const handleLogAction = (actionId: string, actionName: string, baseXp: number) => {
    const result = logAction(skillId as SkillId, actionId, actionName, baseXp);
    showToast(`+${result.xpEarned} XP from ${actionName}`, 'xp');
    if (result.leveledUp) {
      showLevelUpModal(skillId, result.newLevel);
    }
    if (result.newAchievements.length > 0) {
      setTimeout(() => showToast('🏆 Achievement Unlocked!', 'success'), 500);
    }
  };

  const handleCreateCustom = () => {
    const xpVal = parseInt(newXp);
    if (!newName.trim() || isNaN(xpVal) || xpVal < 1) {
      showToast('Enter a name and XP (1-50)', 'error');
      return;
    }
    addCustomAction(skillId, newName.trim(), Math.min(xpVal, 50));
    showToast(`Custom action "${newName.trim()}" created (${Math.min(xpVal, 50)} XP)`, 'success');
    setNewName('');
    setNewXp('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6 pb-24">
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
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-secondary">XP Progress</span>
            <span className="text-xs text-text-muted">
              {skill.xp} / (next in {xpToNext})
            </span>
          </div>
          <ProgressBar progress={xpProgress} color={skillDef.color} height={10} />
        </div>
        {todayCount > 0 && (
          <p className="text-xs text-text-muted">{todayCount} action{todayCount !== 1 ? 's' : ''} logged today</p>
        )}
      </div>

      {/* Streak Info */}
      <div className="glass rounded-xl p-4 border border-border-subtle">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-text-secondary">Current Streak</div>
            <div className="text-2xl font-bold">
              {skillStreak?.current || 0} {skillStreak && skillStreak.current > 0 ? '🔥' : ''}
            </div>
            <div className="text-xs text-text-muted">Best: {skillStreak?.best || 0}</div>
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
              className="glass rounded-xl p-4 border border-border-subtle hover:border-accent-gold hover:bg-bg-secondary/40 transition-all text-left active:scale-95"
            >
              <div className="text-sm font-medium">{action.name}</div>
              <div className="text-xs text-text-muted mt-1">{action.desc}</div>
              <div className="text-accent-gold font-bold mt-2">+{action.xp} XP</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Custom Actions</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="text-sm font-bold px-3 py-1.5 rounded-lg bg-accent-gold/20 border border-accent-gold/50 text-accent-gold hover:bg-accent-gold/30 transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Create'}
          </button>
        </div>

        {showCreateForm && (
          <div className="glass rounded-xl p-4 border border-accent-gold/30 mb-3 space-y-3">
            <input
              type="text"
              placeholder="Action name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              maxLength={30}
              className="w-full bg-bg-secondary rounded-lg px-3 py-2 text-sm border border-border-subtle focus:border-accent-gold focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="XP (max 50)"
                value={newXp}
                onChange={e => setNewXp(e.target.value)}
                min={1}
                max={50}
                className="flex-1 bg-bg-secondary rounded-lg px-3 py-2 text-sm border border-border-subtle focus:border-accent-gold focus:outline-none"
              />
              <button
                onClick={handleCreateCustom}
                className="px-4 py-2 rounded-lg bg-accent-gold text-bg-primary font-bold text-sm hover:brightness-110 transition-all"
              >
                Add
              </button>
            </div>
            <p className="text-[10px] text-text-muted">Custom actions are capped at 50 XP to prevent abuse.</p>
          </div>
        )}

        {skillCustomActions.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {skillCustomActions.map(action => (
              <div key={action.id} className="glass rounded-xl p-4 border border-dashed border-accent-gold/40 relative group">
                <button
                  onClick={() => handleLogAction(action.id, action.name, action.xp)}
                  className="text-left w-full active:scale-95 transition-transform"
                >
                  <div className="font-medium text-sm">★ {action.name}</div>
                  <div className="text-xs mt-1 text-accent-gold">+{action.xp} XP</div>
                </button>
                <button
                  onClick={() => removeCustomAction(skillId, action.id)}
                  className="absolute top-2 right-2 text-red-400/60 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : !showCreateForm ? (
          <p className="text-sm text-text-muted text-center py-4">No custom actions yet. Tap + Create to add one!</p>
        ) : null}
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
