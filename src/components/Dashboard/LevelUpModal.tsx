'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { getSkillTitle } from '@/lib/game-logic/levelSystem';

export default function LevelUpModal() {
  const showLevelUp = useUIStore(s => s.showLevelUp);
  const closeLevelUp = useUIStore(s => s.closeLevelUp);

  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(closeLevelUp, 4000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, closeLevelUp]);

  if (!showLevelUp) return null;

  const skill = SKILL_DEFS.find(s => s.id === showLevelUp.skillId);
  if (!skill) return null;

  const newTitle = getSkillTitle(skill.id, showLevelUp.newLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto rounded-2xl p-8 text-center animate-bounce-in shadow-2xl border max-w-sm mx-4"
        style={{
          background: `linear-gradient(135deg, ${skill.color}20 0%, ${skill.color}05 100%)`,
          borderColor: `${skill.color}40`,
          boxShadow: `0 0 60px ${skill.color}30`,
        }}
        onClick={closeLevelUp}
      >
        <div className="text-5xl mb-3">{skill.icon}</div>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: skill.color }}>
          Level Up!
        </div>
        <div className="text-3xl font-black mb-1" style={{ color: skill.color }}>
          {skill.name} Lv.{showLevelUp.newLevel}
        </div>
        <div className="text-sm text-text-muted mt-2">
          &ldquo;{newTitle}&rdquo;
        </div>
      </div>
    </div>
  );
}
