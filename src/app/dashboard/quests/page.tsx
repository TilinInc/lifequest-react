'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';
import { getDailyQuests, getWeeklyQuests, getQuestProgress, todayStr, getWeekKey } from '@/lib/game-logic/questSystem';
import ProgressBar from 'A/components/Shared/ProgressBar';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const log = useGameStore(s => s.log);
  const completedQuests = useGameStore(s => s.completedQuests);

  // Get today's and week's quests
  const today = todayStr();
  const weekKey = getWeekKey();

  const dailyQuests = getDailyQuests(today);
  const weeklyQuests = getWeeklyQuests(weekKey);

  // Filter today's log
  const todayLog = log.filter(l => {
    const d = new Date(l.timestamp);
    return (
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === today
    );
  });

  // Filter week's log
  const weekLog = log.filter(l => {
    const d = new Date(l.timestamp);
    const logDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const weekStart = new Date(weekKey);
    return logDate >= weekStart;
  });

  // Quest card component
  const QuestCard = ({
    quest,
    isCompleted,
    progress,
  }: {
    quest: any;
    isCompleted: boolean;
    progress: number;
  }) => {
    const progressPercent = Math.min((progress / quest.target) * 100, 100);

    return (
      <div
        className={`glass rounded-xl p-5 border transition-all ${
          isCompleted
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-border-subtle'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-base">{quest.name}</h3>
            <p className="text-xs text-text-secondary mt-1">{quest.desc}</p>
          </div>
          {isCompleted && (
            <div className="ml-3 text-green-400">
              <div className="text-2xl">â</div>
              <div className="text-[10px] font-bold">Completed</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted">
              {progress} / {quest.target}
            </span>
            <span className="text-xs text-text-muted">{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar
            progress={progress / quest.target}
            color={isCompleted ? '#22C55E' : '#F5C842'}
            height={6}
          />
        </div>

        {/* XP Reward */}
        <div className="text-sm font-bold text-accent-gold">+{quest.xp} XP</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          â
        </Link>
        <h1 className="text-2xl font-bold">Quests</h1>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 border-b border-border-subtle">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'daily'
              ? 'border-accent-gold text-accent-gold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Daily (5)
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'weekly'
              ? 'border-accent-gold text-accent-gold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Weekly Boss (3)
        </button>
      </div>

      {/* Daily Quests */}
      {activeTab === 'daily' && (
        <div className="space-y-3">
          {dailyQuests.map(quest => {
            const progress = getQuestProgress(quest, todayLog);
            const isCompleted = completedQuests.daily[quest.id] || progress >= quest.target;
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                isCompleted={isCompleted}
                progress={progress}
              />
            );
          })}
        </div>
      )}

      {/* Weekly Quests */}
      {activeTab === 'weekly' && (
        <div className="space-y-3">
          {weeklyQuests.map(quest => {
            const progress = getQuestProgress(quest, weekLog);
            const isCompleted = completedQuests.weekly[quest.id] || progress >= quest.target;
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                isCompleted={isCompleted}
                progress={progress}
              />
            );
          })}
        </div>
      )}

      {/* Info Section */}
      <div className="glass rounded-xl p-4 border border-border-subtle text-sm text-text-secondary">
        <p className="mb-2">ð¡ Complete quests to earn bonus XP and progress faster!</p>
        <p>Daily quests reset at midnight. Weekly quests reset every Sunday.</p>
      </div>
    </div>
  
("