'use client';

import { useGameStore } from '@/store/useGameStore';
import { getLevel, getXpProgress, getTotalLevel, getTitle } from '@/lib/game-logic/levelSystem';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import SkillCard from '@/components/Dashboard/SkillCard';
import { todayStr } from '@/lib/game-logic/questSystem';

export default function SkillsPage() {
  const skills = useGameStore(s => s.skills);
  const log = useGameStore(s => s.log);
  const hardcoreMode = useGameStore(s => s.hardcoreMode);
  const penalty = useGameStore(s => s.penalty);

  const totalLevel = getTotalLevel(skills);
  const title = getTitle(totalLevel, hardcoreMode, penalty.tier);
  const today = todayStr();

  const todayLog = log.filter(l => {
    const d = new Date(l.timestamp);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === today;
  });

  return (
    <div className="space-y-6">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold">Skills</h1>
        <p className="text-text-secondary text-sm">{title} — Level {totalLevel}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SKILL_DEFS.map(def => {
          const skill = skills.find(s => s.id === def.id);
          const xp = skill?.xp || 0;
          const level = getLevel(xp);
          const progress = getXpProgress(xp);
          const todayCount = todayLog.filter(l => l.skillId === def.id).length;

          return (
            <SkillCard
              key={def.id}
              skillDef={def}
              level={level}
              progress={progress}
              todayCount={todayCount}
            />
          );
        })}
      </div>

      {/* Skill Legend */}
      <div className="glass rounded-xl p-4 border border-border-subtle">
        <h3 className="font-bold text-sm mb-2 text-text-secondary">XP Mechanics</h3>
        <div className="space-y-1 text-xs text-text-muted">
          <p>• Each level requires progressively more XP (85 × 1.3^level)</p>
          <p>• Max level per skill: 99 (Total cap: 693)</p>
          <p>• Streaks give up to +50% bonus XP</p>
          <p>• Inactivity causes 15% XP decay per day</p>
        </div>
      </div>
    </div>
  );
}
