'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { getLevel, getXpProgress, getSkillTitle } from '@/lib/game-logic/levelSystem';
import ProgressBar from '@/components/Shared/ProgressBar';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;

  const skills = useGameStore(s => s.skills);
  const log = useGameStore(s => s.log);
  const logAction = useGameStore(s => s.logAction);
  const customActions = useGameStore(s => s.customActions);
  const addCustomAction = useGameStore(s => s.addCustomAction);
  const removeCustomAction = useGameStore(s => s.removeCustomAction);
  const showToast = useUIStore(s => s.showToast);
  const showLevelUpModal = useUIStore(s => s.showLevelUpModal);

  const [newName, setNewName] = useState('');
  const [newXp, setNewXp] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const skillDef = SKILL_DEFS.find(d => d.id === skillId);
  if (!skillDef) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Skill not found</p>
        <button onClick={() => router.back()} className="text-accent-gold mt-4">Go Back</button>
      </div>
    );
  }

  const skill = skills.find(s => s.id === skillId);
  const xp = skill?.xp || 0;
  const level = getLevel(xp);
  const progress = getXpProgress(xp);
  const skillTitle = getSkillTitle(skillId, level);
  const skillCustomActions = customActions[skillId] || [];

  const handleLog = (actionId: string, actionName: string, actionXp: number) => {
    const result = logAction(skillId as any, actionId, actionName, actionXp);
    showToast(`+${result.xpEarned} XP \u2014 ${actionName}`, 'xp');
    if (result.leveledUp) {
      showLevelUpModal(skillId, result.newLevel);
    }
    if (result.newAchievements.length > 0) {
      setTimeout(() => showToast('\ud83c\udfc6 Achievement Unlocked!', 'success'), 500);
    }
  };

  const handleCreateCustom = () => {
    const xpVal = parseInt(newXp);
    if (!newName.trim() || isNaN(xpVal) || xpVal < 1) {
      showToast('Enter a name and XP (1-50)', 'error');
      return;
    }
    addCustomAction(skillId, newName.trim(), Math.min(xpVal, 50));
    showToast(`Custom action "\${newName.trim()}" created (${Math.min(xpVal, 50)} XP)`, 'success');
    setNewName('');
    setNewXp('');
    setShowCreateForm(false);
  };

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const todayCount = log.filter(l => {
    const d = new Date(l.timestamp);
    return l.skillId === skillId && `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === todayKey;
  }).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center pt-2 relative">
        <button onClick={() => router.back()} className="absolute left-0 top-2 text-text-muted hover:text-white transition-colors text-sm">
          \u2190 Back
        </button>
        <div className="text-4xl mb-2">{skillDef.icon}</div>
        <h1 className="text-2xl font-bold">{skillDef.name}</h1>
        <p className="text-sm" style={{ color: skillDef.color }}>{skillTitle}</p>
        <div className="mt-3 max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>Level {level}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <ProgressBar progress={progress} color={skillDef.color} height={6} />
        </div>
        {todayCount > 0 && (
          <p className="text-xs text-text-muted mt-2">{todayCount} action{todayCount !== 1 ? 's' : ''} logged today</p>
        )}
      </div>

      {/* Actions */}
      <div>
        <h2 className="font-bold text-lg mb-3">Actions</h2>
        <div className="grid grid-cols-2 gap-2">
          {skillDef.actions.map(action => (
            <button
              key={action.id}
              onClick={() => handleLog(action.id, action.name, action.xp)}
              className="glass rounded-xl p-3 border border-border-subtle hover:border-accent-gold transition-all text-left active:scale-95"
            >
              <div className="font-medium text-sm">{action.name}</div>
              <div className="text-xs mt-0.5" style={{ color: skillDef.color }}>+{action.xp} XP</div>
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

        {/* Create Form */}
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

        {/* Custom Actions List */}
        {skillCustomActions.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {skillCustomActions.map(action => (
              <div key={action.id} className="glass rounded-xl p-3 border border-dashed border-accent-gold/40 relative group">
                <button
                  onClick={() => handleLog(action.id, action.name, action.xp)}
                  className="text-left w-full active:scale-95 transition-transform"
                >
                  <div className="font-medium text-sm">\u2605 {action.name}</div>
                  <div className="text-xs mt-0.5 text-accent-gold">+{action.xp} XP</div>
                </button>
                <button
                  onClick={() => removeCustomAction(skillId, action.id)}
                  className="absolute top-1 right-2 text-red-400/60 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  \u2715
                </button>
              </div>
            ))}
          </div>
        ) : !showCreateForm ? (
          <p className="text-sm text-text-muted text-center py-4">No custom actions yet. Tap + Create to add one!</p>
        ) : null}
      </div>
    </div>
  );
}
