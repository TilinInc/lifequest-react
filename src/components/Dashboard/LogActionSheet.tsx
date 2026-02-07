'use client';

import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { SKILL_DEFS } from 'A/lib/game-logic/skillSystem';
import { getLevel } from 'A/lib/game-logic/levelSystem';
import Modal from '@/components/Shared/Modal';

export default function LogActionSheet() {
  const skills = useGameStore(s => s.skills);
  const logAction = useGameStore(s => s.logAction);
  const closeLogSheet = useUIStore(s => s.closeLogSheet);
  const showToast = useUIStore(s => s.showToast);
  const showLevelUpModal = useUIStore(s => s.showLevelUpModal);

  const handleLog = (skillId: string, actionId: string, actionName: string, xp: number) => {
    const result = logAction(skillId as any, actionId, actionName, xp);
    showToast(`+${result.xpEarned} XP â ${actionName}`, 'xp');

    if (result.leveledUp) {
      showLevelUpModal(skillId, result.newLevel);
    }

    if (result.newAchievements.length > 0) {
      setTimeout(() => showToast(`ð Achievement Unlocked!`, 'success'), 500);
    }

    if (result.questsCompleted.length > 0) {
      setTimeout(() => showToast(`ð Quest Completed!`, 'success'), 800);
    }

    closeLogSheet();
  };

  return (
    <Modal isOpen={true} onClose={closeLogSheet} title="Log Action" size="lg">
      <div className="space-y-4">
        {SKILL_DEFS.map(def => {
          const skill = skills.find(s => s.id === def.id);
          const level = getLevel(skill?.xp || 0);

          return (
            <div key={def.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{def.icon}</span>
                <span className="font-bold text-sm" style={{ color: def.color }}>{def.name}</span>
                <span className="text-xs text-text-muted">Lv.{level}</span>
              </div>
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
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
