'use client';

import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { getLevel, getXpProgress, getTitle, getTotalLevel, getSkillTitle } from '@/lib/game-logic/levelSystem';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { getDailyQuests, getQuestProgress, todayStr } from '@/lib/game-logic/questSystem';
import ProgressBar from '@/components/Shared/ProgressBar';
import SkillCard from '@/components/Dashboard/SkillCard';
import LogActionSheet from '@/components/Dashboard/LogActionSheet';
import Link from 'next/link';

export default function DashboardPage() {
  const skills = useGameStore(s => s.skills);
  const log = useGameStore(s => s.log);
  const streaks = useGameStore(s => s.streaks);
  const hardcoreMode = useGameStore(s => s.hardcoreMode);
  const penalty = useGameStore(s => s.penalty);
  const showLogSheet = useUIStore(s => s.showLogSheet);
  const openLogSheet = useUIStore(s => s.openLogSheet);

  const totalLevel = getTotalLevel(skills);
  const title = getTitle(totalLevel, hardcoreMode, penalty.tier);
  const globalStreak = streaks.global.current;

  // Today's action count
  const today = todayStr();
  const todayLog = log.filter(l => {
    const d = new Date(l.timestamp);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === today;
  });

  // Daily quests preview
  const dailyQuests = getDailyQuests(today);
  const completedToday = dailyQuests.filter(q => getQuestProgress(q, todayLog) >= q.target).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="text-3xl mb-1">âï¸</div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-text-secondary text-sm">
          Level {totalLevel}
          {globalStreak > 0 && <span className="text-accent-gold ml-2">ð¥ {globalStreak} day streak</span>}
        </p>
        {hardcoreMode && penalty.tier && (
          <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
            penalty.tier === 'critical' ? 'bg-red-500/20 text-red-400' :
            penalty.tier === 'penaltyZone' ? 'bg-orange-500/20 text-orange-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {penalty.tier === 'critical' ? 'ð CRITICAL' : penalty.tier === 'penaltyZone' ? 'â ï¸ PENALTY ZONE' : 'â¡ WARNING'}
          </div>
        )}
      </div>
    </div>
  );
}
