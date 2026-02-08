'use client';

import { useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { getLevel, getTotalLevel, getTitle, getSkillTitle } from '@/lib/game-logic/levelSystem';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { ACHIEVEMENTS } from '@/lib/game-logic/achievementSystem';

export default function ProfilePage() {
  const profileSection = useUIStore(s => s.profileSection);
  const setProfileSection = useUIStore(s => s.setProfileSection);

  const skills = useGameStore(s => s.skills);
  const log = useGameStore(s => s.log);
  const unlockedAchievements = useGameStore(s => s.unlockedAchievements);
  const streaks = useGameStore(s => s.streaks);
  const hardcoreMode = useGameStore(s => s.hardcoreMode);
  const penalty = useGameStore(s => s.penalty);
  const toggleHardcore = useGameStore(s => s.toggleHardcore);
  const loadState = useGameStore(s => s.loadState);

  const totalLevel = getTotalLevel(skills);
  const title = getTitle(totalLevel, hardcoreMode, penalty.tier);
  const globalStreak = streaks.global.current;
  const bestStreak = streaks.global.best;
  const totalActions = log.length;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get first letter of title for avatar
  const avatarLetter = title.charAt(0).toUpperCase();

  // Export game state as JSON
  const handleExport = () => {
    const gameState = {
      skills,
      log,
      unlockedAchievements,
      streaks,
      hardcoreMode,
      penalty,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(gameState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifequest-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import game state from JSON
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedState = JSON.parse(content);

        // Validate and load state
        if (importedState.skills && importedState.log && importedState.unlockedAchievements) {
          loadState(importedState);
          alert('Game state imported successfully!');
        } else {
          alert('Invalid game state file. Please check the file format.');
        }
      } catch (err) {
        alert('Failed to import game state. Please ensure the file is valid JSON.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (profileSection === 'pictures') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setProfileSection('main')}
            className="text-2xl hover:opacity-70 transition"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Progress Pictures</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-50">📸</div>
          <p className="text-text-muted">Progress pictures feature coming soon</p>
        </div>
      </div>
    );
  }

  if (profileSection === 'weight') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setProfileSection('main')}
            className="text-2xl hover:opacity-70 transition"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Weight Log</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-50">⚖️</div>
          <p className="text-text-muted">Weight log feature coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="text-center pt-2">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/60 flex items-center justify-center text-3xl font-bold text-bg-primary">
            {avatarLetter}
          </div>
        </div>

        {/* Title and Level */}
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-text-secondary text-sm">Total Level: {totalLevel}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-4 border border-border-subtle">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Level</div>
          <div className="text-3xl font-bold text-accent-gold">{totalLevel}</div>
        </div>
        <div className="glass rounded-xl p-4 border border-border-subtle">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Global Streak</div>
          <div className="text-3xl font-bold">{globalStreak} 🔥</div>
        </div>
        <div className="glass rounded-xl p-4 border border-border-subtle">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Best Streak</div>
          <div className="text-3xl font-bold">{bestStreak} 🏆</div>
        </div>
        <div className="glass rounded-xl p-4 border border-border-subtle">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Actions Logged</div>
          <div className="text-3xl font-bold">{totalActions}</div>
        </div>
        <div className="glass rounded-xl p-4 border border-border-subtle col-span-2">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Achievements Unlocked</div>
          <div className="text-3xl font-bold">
            <span className="text-accent-gold">{unlockedAchievements.length}</span>
            <span className="text-text-muted text-lg"> / {ACHIEVEMENTS.length}</span>
          </div>
        </div>
      </div>

      {/* Skill Badges */}
      <div>
        <h2 className="font-bold text-lg mb-3">Skills</h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-min">
            {SKILL_DEFS.map(skillDef => {
              const skill = skills.find(s => s.id === skillDef.id);
              const xp = skill?.xp || 0;
              const level = getLevel(xp);
              const skillTitle = getSkillTitle(skillDef.id, level);

              return (
                <div
                  key={skillDef.id}
                  className="glass rounded-xl px-4 py-3 border border-border-subtle whitespace-nowrap flex items-center gap-3"
                  style={{
                    borderColor: skillDef.color + '33',
                    background: skillDef.color + '08',
                  }}
                >
                  <div className="text-2xl">{skillDef.icon}</div>
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider font-bold">
                      {skillDef.name}
                    </div>
                    <div className="text-lg font-bold" style={{ color: skillDef.color }}>
                      {level}
                    </div>
                    <div className="text-[10px] text-text-muted">{skillTitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hardcore Mode Toggle */}
      <div className="glass rounded-xl p-4 border border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-text-primary">Hardcore Mode</h3>
            <p className="text-xs text-text-muted mt-1">
              {hardcoreMode ? 'Enabled - Penalties active' : 'Disabled - No penalties'}
            </p>
          </div>
          <button
            onClick={toggleHardcore}
            className={`relative w-12 h-6 rounded-full transition-all ${
              hardcoreMode ? 'bg-red-500/50' : 'bg-gray-500/30'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all ${
                hardcoreMode ? 'translate-x-6 bg-red-500' : 'bg-gray-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-3">
        <button
          onClick={() => setProfileSection('pictures')}
          className="w-full glass rounded-xl p-4 border border-border-subtle hover:border-accent-gold hover:shadow-lg hover:shadow-accent-gold/20 transition-all text-left"
        >
          <div className="text-3xl mb-2">📸</div>
          <h3 className="font-bold text-text-primary">Progress Pictures</h3>
          <p className="text-xs text-text-muted mt-1">Track your physical transformation</p>
        </button>

        <button
          onClick={() => setProfileSection('weight')}
          className="w-full glass rounded-xl p-4 border border-border-subtle hover:border-accent-gold hover:shadow-lg hover:shadow-accent-gold/20 transition-all text-left"
        >
          <div className="text-3xl mb-2">⚖️</div>
          <h3 className="font-bold text-text-primary">Weight Log</h3>
          <p className="text-xs text-text-muted mt-1">Monitor your weight progression</p>
        </button>
      </div>

      {/* Export / Import Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="w-full glass rounded-xl px-4 py-3 border border-border-subtle text-text-primary font-bold hover:border-accent-gold hover:bg-accent-gold/5 transition-all flex items-center justify-center gap-2"
        >
          <span>📥</span>
          Export Game State
        </button>

        <button
          onClick={handleImport}
          className="w-full glass rounded-xl px-4 py-3 border border-border-subtle text-text-primary font-bold hover:border-accent-gold hover:bg-accent-gold/5 transition-all flex items-center justify-center gap-2"
        >
          <span>📤</span>
          Import Game State
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Import game state file"
        />
      </div>
    </div>
  );
}
