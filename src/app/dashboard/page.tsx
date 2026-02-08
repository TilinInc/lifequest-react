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
        <div className="text-3xl mb-1">⚔️</div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-text-secondary text-sm">
          Level {totalLevel}
          {globalStreak > 0 && <span className="text-accent-gold ml-2">🔥 {globalStreak} day streak</span>}
        </p>
        {hardcoreMode && penalty.tier && (
          <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
            penalty.tier === 'critical' ? 'bg-red-500/20 text-red-400' :
            penalty.tier === 'penaltyZone' ? 'bg-orange-500/20 text-orange-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {penalty.tier === 'critical' ? '💀 CRITICAL' : penalty.tier === 'penaltyZone' ? '⚠️ PENALTY ZONE' : '⚡ WARNING'}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center border border-border-subtle">
          <div className="text-xl font-bold text-accent-gold">{todayLog.length}</div>
          <div className="text-[10px] text-text-muted">Today</div>
        </div>
        <div className="glass rounded-xl p-3 text-center border border-border-subtle">
          <div className="text-xl font-bold">{completedToday}/5</div>
          <div className="text-[10px] text-text-muted">Quests</div>
        </div>
        <div className="glass rounded-xl p-3 text-center border border-border-subtle">
          <div className="text-xl font-bold">{globalStreak > 0 ? `+${Math.min(globalStreak * 10, 50)}%` : '0%'}</div>
          <div className="text-[10px] text-text-muted">Streak Bonus</div>
        </div>
      </div>

      {/* Skills Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Skills</h2>
          <Link href="/dashboard/skills" className="text-accent-gold text-sm">View All →</Link>
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
      </div>

      {/* Recent Activity */}
      {todayLog.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3">Today's Activity</h2>
          <div className="space-y-2">
            {todayLog.slice(0, 5).map(entry => {
              const skillDef = SKILL_DEFS.find(s => s.id === entry.skillId);
              return (
                <div key={entry.id} className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-border-subtle">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{skillDef?.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{entry.actionName}</div>
                      <div className="text-xs text-text-muted">{skillDef?.name}</div>
                    </div>
                  </div>
                  <div className="text-accent-gold text-sm font-bold">+{entry.xp} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Log Action FAB */}
      <button
        onClick={openLogSheet}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-accent-gold text-bg-primary text-2xl font-bold shadow-lg hover:brightness-110 transition-all glow-gold z-40 flex items-center justify-center"
      >
        +
      </button>

      {/* Log Action Sheet */}
      {showLogSheet && <LogActionSheet />}
    </div>
  );
}
