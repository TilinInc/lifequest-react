'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { getLevel } from '@/lib/game-logic/levelSystem';
import Modal from '@/components/Shared/Modal';

export default function LogActionSheet() {
  const skills = useGameStore(s => s.skills);
  const logAction = useGameStore(s => s.logAction);
  const customActions = useGameStore(s => s.customActions);
  const addCustomAction = useGameStore(s => s.addCustomAction);
  const closeLogSheet = useUIStore(s => s.closeLogSheet);
  const showToast = useUIStore(s => s.showToast);
  const showLevelUpModal = useUIStore(s => s.showLevelUpModal);

  const [creatingFor, setCreatingFor] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newXp, setNewXp] = useState('');

  const handleLog = (skillId: string, actionId: string, actionName: string, xp: number) => {
    const result = logAction(skillId as any, actionId, actionName, xp);
    showToast(`+${result.xpEarned} XP — ${actionName}`, 'xp');

    if (result.leveledUp) {
      showLevelUpModal(skillId, result.newLevel);
    }
    if (result.newAchievements.length > 0) {
      setTimeout(() => showToast('🏆 Achievement Unlocked!', 'success'), 500);
    }
    if (result.questsCompleted.length > 0) {
      setTimeout(() => showToast('📜 Quest Completed!', 'success'), 800);
    }

    closeLogSheet();
  };

  const handleCreateCustom = (skillId: string) => {
    const xp = parseInt(newXp);
    if (!newName.trim() || isNaN(xp) || xp < 1) {
      showToast('Enter a name and XP (1-50)', 'error');
      return;
    }
    addCustomAction(skillId, newName.trim(), Math.min(xp, 50));
    showToast(`Custom action "${newName.trim()}" created (${Math.min(xp, 50)} XP)`, 'success');
    setCreatingFor(null);
    setNewName('');
    setNewXp('');
  };

  return (
    <Modal isOpen={true} onClose={closeLogSheet} title="Log Action" size="lg">
      <div className="space-y-4">
        {SKILL_DEFS.filter(d => d.id !== 'money').map(def => {
          const skill = skills.find(s => s.id === def.id);
          const level = getLevel(skill?.xp || 0);
          const customs = customActions[def.id] || [];

          return (
            <div key={def.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{def.icon}</span>
                <span className="font-bold text-sm" style={{ color: def.color }}>{def.name}</span>
                <span className="text-xs text-text-muted">Lv.{level}</span>
                <button
                  onClick={() => setCreatingFor(creatingFor === def.id ? null : def.id)}
                  className="ml-auto text-xs px-2 py-0.5 rounded bg-bg-tertiary border border-border-subtle hover:border-accent-gold transition-colors"
                >
                  + Custom
                </button>
              </div>

              {creatingFor === def.id && (
                <div className="flex gap-2 mb-2 items-end">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Action name"
                    className="flex-1 px-2 py-1.5 rounded-lg bg-bg-secondary border border-border-subtle focus:border-accent-gold focus:outline-none text-sm"
                    maxLength={30}
                  />
                  <input
                    type="number"
                    value={newXp}
                    onChange={e => setNewXp(e.target.value)}
                    placeholder="XP"
                    min="1"
                    max="50"
                    className="w-16 px-2 py-1.5 rounded-lg bg-bg-secondary border border-border-subtle focus:border-accent-gold focus:outline-none text-sm"
                  />
                  <button
                    onClick={() => handleCreateCustom(def.id)}
                    className="px-3 py-1.5 rounded-lg bg-accent-gold text-bg-primary font-bold text-sm"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {def.actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleLog(def.id, action.id, action.name, action.xp)}
                    className="text-left px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border-subtle hover:border-border-medium transition-all"
                  >
                    <div className="text-sm font-medium truncate">{action.name}</div>
                    <div className="text-xs text-accent-gold">+{action.xp} XP</div>
                  </button>
                ))}
                {customs.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleLog(def.id, action.id, action.name, action.xp)}
                    className="text-left px-3 py-2.5 rounded-lg bg-bg-tertiary border border-dashed border-accent-gold/40 hover:border-accent-gold transition-all"
                  >
                    <div className="text-sm font-medium truncate">{action.name}</div>
                    <div className="text-xs text-accent-gold">+{action.xp} XP ★</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
