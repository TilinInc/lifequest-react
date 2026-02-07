'use client';

import { useState } from 'react';
import { ACHIEVEMENTS } from 'A/lib/game-logic/achievementSystem';
import { useGameStore } from '@/store/useGameStore';

type FilterTab = 'all' | 'unlocked' | 'locked';

export default function AchievementsPage() {
  const unlockedAchievements = useGameStore(s => s.unlockedAchievements);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  const filteredAchievements = ACHIEVEMENTS.filter(ach => {
    const isUnlocked = unlockedAchievements.includes(ach.id);
    if (filterTab === 'unlocked') return isUnlocked;
    if (filterTab === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold mb-2">Achievements</h1>
        <p className="text-text-secondary text-sm">
          <span className="text-accent-gold font-bold">{unlockedCount}</span> / {totalCount} Unlocked
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 justify-center">
        {(['all', 'unlocked', 'locked'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterTab === tab
                ? 'bg-accent-gold text-bg-primary'
                : 'glass border border-border-subtle text-text-secondary hover:border-accent-gold'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`glass rounded-xl p-4 border transition-all relative overflow-hidden ${
                isUnlocked
                  ? 'border-accent-gold shadow-lg shadow-accent-gold/30 opacity-100'
                  : 'border-border-subtle opacity-40'
              }`}
            >
              {/* Lock Icon for Locked Achievements */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2 text-lg opacity-60">ð</div>
              )}

              {/* Icon */}
              <div className="text-4xl mb-2">{achievement.icon}</div>

              {/* Name */}
              <h3 className="font-bold text-sm mb-1 text-text-primary">
                {achievement.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-text-secondary mb-3 leading-snug">
                {achievement.desc}
              </p>

              {/* XP Reward */}
              <div className="text-xs font-semibold text-accent-gold">
                +{achievement.xp} XP
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-50">
            {filterTab === 'unlocked' ? 'ðï¸' : 'ð'}
          </div>
          <p className="text-text-muted">
            {filterTab === 'unlocked'
              ? 'No unlocked achievements yet'
              : filterTab === 'locked'
                ? 'All achievements unlocked!'
                : 'No achievements found'}
          </p>
        </div>
      )}
    </div>
  );
}
