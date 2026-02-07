'use client';

import Link from 'next/link';
import { SkillDefinition } from '@/lib/types';
import { getSkillTitle } from '@/lib/game-logic/levelSystem';
import ProgressBar from '@/components/Shared/ProgressBar';

interface SkillCardProps {
  skillDef: SkillDefinition;
  level: number;
  progress: number;
  todayCount: number;
}

export default function SkillCard({ skillDef, level, progress, todayCount }: SkillCardProps) {
  const skillTitle = getSkillTitle(skillDef.id, level);

  return (
    <Link
      href={`/dashboard/skills/${skillDef.id}`}
      className="glass rounded-xl p-4 border border-border-subtle hover:border-border-medium transition-all group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{skillDef.icon}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: skillDef.color, background: `${skillDef.color}15` }}>
          Lv.{level}
        </span>
      </div>

      <h3 className="font-bold text-sm mb-0.5">{skillDef.name}</h3>
      <p className="text-[10px] text-text-muted mb-2">{skillTitle}</p>

      <ProgressBar progress={progress} color={skillDef.color} height={4} />

      {todayCount > 0 && (
        <div className="mt-2 text-[10px] text-text-muted">
          {todayCount} action{todayCount > 1 ? 's' : ''} today
        </div>
      )}
    </Link>
  );
}
