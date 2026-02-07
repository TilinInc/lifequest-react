'use client';

import { useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { getLevel, getTotalLevel, getTitle, getSkillTitle } from '@/lib/game-logic/levelSystem';
import { SKILL_DEFS } from 'A/lib/game-logic/skillSystem';
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
            â
          </button>
          <h1 className="text-2xl font-bold">Progress Pictures</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-50">ð¸</div>
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
            â
          </button>
          <h1 className="text-2xl font-bold">Weight Log</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-50">âï¸</div>
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
          <div className="text-3xl font-bold">{globalStreak} ð¥</dited-lg p-6 border border-border-subtle hover:border-accent-gold transition group"
            >
              {/* Header with Icon and Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{community.icon}</div>
                {community.isJoined && (
                  <span className="px-3 py-1 bg-accent-green bg-opacity-20 text-accent-green text-sm font-semibold rounded-full">
                    Joined
                  </span>
                )}
              </div>

              {/* Community Name */}
              <h3 className="text-xl font-bold mb-2">{community.name}</h3>

              {/* Description */}
              <p className="text-text-secondary text-sm mb-4">
                {community.description}
              </p>

              {/* Member Count */}
              <div className="flex items-center text-text-muted text-sm mb-4">
                <span>ð¥ {community.memberCount.toLocaleString()} members</span>
              </div>

              {/* Join/Joined Button */}
              <button
                onClick={() => handleToggleJoin(community.id)}
                className={`w-full py-2 rounded-lg font-semibold transition ${
                  community.isJoined
                    ? 'bg-bg-tertiary border border-border-subtle text-text-primary hover:bg-bg-secondary'
                    : 'bg-accent-gold text-black hover:bg-yellow-500'
                }`}
              >
                {community.isJoined ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">
              No communities found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="glass rounded-lg p-8 border border-border-subtle max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Create Community</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, name: e.target.value })
                  }
                  placeholder="Enter community name"
                  className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Description
                </label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) =>
                    setNewCommunity({
                      ...newCommunity,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter community description"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition resize-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newCommunity.isPrivate}
                  onChange={(e) =>
                    setNewCommunity({
                      ...newCommunity,
                      isPrivate: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-border-subtle cursor-pointer"
                />
                <label
                  htmlFor="isPrivate"
                  className="ml-2 text-sm font-semibold text-text-secondary cursor-pointer"
                >
                  Make this community private
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-bg-tertiary border border-border-subtle text-text-primary font-semibold rounded-lg hover:bg-bg-secondary transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCommunity}
                className="flex-1 px-4 py-2 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
