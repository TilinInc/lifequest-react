'use client';

import { useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { getLevel, getTotalLevel, getTitle, getSkillTitle } from '@/lib/game-logic/levelSystem';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import { ACHIEVEMENTS } from '@/lib/game-logic/achievementSystem';
import { BADGES, getBadgeById } from '@/lib/game-logic/badgeSystem';

export default function ProfilePage() {
  const profileSection = useUIStore(s => s.profileSection);
  const setProfileSection = useUIStore(s => s.setProfileSection);
  const skills = useGameStore(s => s.skills);
  const log = useGameStore(s => s.log);
  const unlockedAchievements = useGameStore(s => s.unlockedAchievements);
  const unlockedBadges = useGameStore(s => s.unlockedBadges);
  const streaks = useGameStore(s => s.streaks);
  const hardcoreMode = useGameStore(s => s.hardcoreMode);
  const penalty = useGameStore(s => s.penalty);
  const toggleHardcore = useGameStore(s => s.toggleHardcore);
  const loadState = useGameStore(s => s.loadState);
  const profilePicture = useGameStore(s => s.profilePicture);
  const setProfilePicture = useGameStore(s => s.setProfilePicture);

  const totalLevel = getTotalLevel(skills);
  const title = getTitle(totalLevel, hardcoreMode, penalty.tier);
  const globalStreak = streaks.global.current;
  const bestStreak = streaks.global.best;
  const totalActions = log.length;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pictureInputRef = useRef<HTMLInputElement>(null);

  const handlePictureUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let w = img.width;
        let h = img.height;
        if (w > h) { h = (h / w) * MAX_SIZE; w = MAX_SIZE; }
        else { w = (w / h) * MAX_SIZE; h = MAX_SIZE; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setProfilePicture(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    if (pictureInputRef.current) pictureInputRef.current.value = '';
  }, [setProfilePicture]);

  const handleExport = () => {
    const gameState = {
      skills, log, unlockedAchievements, unlockedBadges, streaks,
      hardcoreMode, penalty, profilePicture,
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

  const handleImport = () => { fileInputRef.current?.click(); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedState = JSON.parse(content);
        if (importedState.skills && importedState.log && importedState.unlockedAchievements) {
          loadState(importedState);
          alert('Game state imported successfully!');
        } else {
          alert('Invalid game state file.');
        }
      } catch (err) {
        alert('Failed to import game state.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const badgeData = (unlockedBadges || []).map(id => getBadgeById(id)).filter(Boolean);
  const tierOrder = ['master', 'diamond', 'gold', 'silver', 'bronze', 'special'] as const;

  if (profileSection === 'pictures') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setProfileSection('main')} className="text-2xl hover:opacity-70 transition">{'\u2190'}</button>
          <h1 className="text-2xl font-bold">Progress Pictures</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-50">{'\uD83D\uDCF8'}</div>
          <p className="text-text-muted">Progress pictures feature coming soon</p>
        </div>
      </div>
    );
  }

  if (profileSection === 'weight') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setProfileSection('main')} className="text-2xl hover:opacity-70 transition">{'\u2190'}</button>
          <h1 className="text-2xl font-bold">Weight Log</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-50">{'\u2696\uFE0F'}</div>
          <p className="text-text-muted">Weight log feature coming soon</p>
        </div>
      </div>
    );
  }

  if (profileSection === 'badges') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setProfileSection('main')} className="text-2xl hover:opacity-70 transition">{'\u2190'}</button>
          <h1 className="text-2xl font-bold">Badges</h1>
          <span className="text-sm text-text-muted ml-auto">{badgeData.length}/{BADGES.length}</span>
        </div>
        {BADGES.length > 0 && (
          <div className="space-y-4">
            {tierOrder.map(tier => {
              const tierBadges = BADGES.filter(b => b.tier === tier);
              if (tierBadges.length === 0) return null;
              const tierColors: Record<string, string> = {
                master: 'text-red-400', diamond: 'text-cyan-400', gold: 'text-yellow-400',
                silver: 'text-gray-300', bronze: 'text-orange-400', special: 'text-purple-400'
              };
              return (
                <div key={tier}>
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${tierColors[tier] || 'text-text-muted'}`}>
                    {tier === 'special' ? '\u2B50 Special' : `${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {tierBadges.map(badge => {
                      const isUnlocked = (unlockedBadges || []).includes(badge.id);
                      return (
                        <div key={badge.id} className={`glass rounded-xl p-3 border text-center transition-all ${isUnlocked ? 'border-accent-gold/30 bg-accent-gold/5' : 'border-border-subtle opacity-40 grayscale'}`}>
                          <div className="text-2xl mb-1">{badge.icon}</div>
                          <div className="text-[10px] font-bold leading-tight">{badge.name}</div>
                          <div className="text-[9px] text-text-muted mt-0.5">{badge.skillId ? `Lv${badge.requiredLevel}` : 'All skills'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center pt-2">
        <div className="flex justify-center mb-4">
          <button onClick={() => pictureInputRef.current?.click()} className="relative group">
            {profilePicture ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent-gold shadow-lg shadow-accent-gold/20">
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/60 flex items-center justify-center text-3xl font-bold text-bg-primary">
                {title.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xl">{'\uD83D\uDCF7'}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center text-bg-primary text-xs font-bold shadow">
              {'\u270F\uFE0F'}
            </div>
          </button>
          <input ref={pictureInputRef} type="file" accept="image/*" onChange={handlePictureUpload} className="hidden" aria-label="Upload profile picture" />
        </div>
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-text-secondary text-sm">Total Level: {totalLevel}</p>
        {profilePicture && (
          <button onClick={() => setProfilePicture(null)} className="text-xs text-red-400 hover:text-red-300 mt-1 transition-colors">Remove Picture</button>
        )}
      </div>

      {badgeData.length > 0 ? (
        <button onClick={() => setProfileSection('badges')} className="w-full glass rounded-xl p-4 border border-border-subtle hover:border-accent-gold hover:shadow-lg hover:shadow-accent-gold/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-text-primary">{'\uD83C\uDFC5'} Badges</h3>
            <span className="text-xs text-text-muted">{badgeData.length}/{BADGES.length} {'\u2192'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {badgeData.slice(-6).reverse().map(badge => badge && (
              <span key={badge.id} className="text-lg" title={badge.name}>{badge.icon}</span>
            ))}
            {badgeData.length > 6 && <span className="text-xs text-text-muted self-center">+{badgeData.length - 6} more</span>}
          </div>
        </button>
      ) : (
        <button onClick={() => setProfileSection('badges')} className="w-full glass rounded-xl p-4 border border-border-subtle hover:border-accent-gold transition-all text-left">
          <div className="text-3xl mb-2">{'\uD83C\uDFC5'}</div>
          <h3 className="font-bold text-text-primary">Badges</h3>
          <p className="text-xs text-text-muted mt-1">Earn badges by leveling up your skills</p>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-4 border border-border-subtle">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Level</div>
          <div className="text-3xl font-bold text-accent-gold">{totalLevel}</div>
        </div>
        <div className="glass rounded-xl p-4 border border-border-subtle">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Global Streak</div>
          <div className="text-3xl font-bold">{globalStreak} {'\uD83D\uDD25'}</div>
        </div>
        <div className="glass rounded-xl p-4 border border-border-subtle">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Best Streak</div>
          <div className="text-3xl font-bold">{bestStreak} {'\uD83C\uDFC6'}</div>
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
                <div key={skillDef.id} className="glass rounded-xl px-4 py-3 border border-border-subtle whitespace-nowrap flex items-center gap-3" style={{ borderColor: skillDef.color + '33', background: skillDef.color + '08' }}>
                  <div className="text-2xl">{skillDef.icon}</div>
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider font-bold">{skillDef.name}</div>
                    <div className="text-lg font-bold" style={{ color: skillDef.color }}>{level}</div>
                    <div className="text-[10px] text-text-muted">{skillTitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-4 border border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-text-primary">Hardcore Mode</h3>
            <p className="text-xs text-text-muted mt-1">{hardcoreMode ? 'Enabled - Penalties active' : 'Disabled - No penalties'}</p>
          </div>
          <button onClick={toggleHardcore} className={`relative w-12 h-6 rounded-full transition-all ${hardcoreMode ? 'bg-red-500/50' : 'bg-gray-500/30'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all ${hardcoreMode ? 'translate-x-6 bg-red-500' : 'bg-gray-400'}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={() => setProfileSection('pictures')} className="w-full glass rounded-xl p-4 border border-border-subtle hover:border-accent-gold hover:shadow-lg hover:shadow-accent-gold/20 transition-all text-left">
          <div className="text-3xl mb-2">{'\uD83D\uDCF8'}</div>
          <h3 className="font-bold text-text-primary">Progress Pictures</h3>
          <p className="text-xs text-text-muted mt-1">Track your physical transformation</p>
        </button>
        <button onClick={() => setProfileSection('weight')} className="w-full glass rounded-xl p-4 border border-border-subtle hover:border-accent-gold hover:shadow-lg hover:shadow-accent-gold/20 transition-all text-left">
          <div className="text-3xl mb-2">{'\u2696\uFE0F'}</div>
          <h3 className="font-bold text-text-primary">Weight Log</h3>
          <p className="text-xs text-text-muted mt-1">Monitor your weight progression</p>
        </button>
      </div>

      <div className="space-y-3">
        <button onClick={handleExport} className="w-full glass rounded-xl px-4 py-3 border border-border-subtle text-text-primary font-bold hover:border-accent-gold hover:bg-accent-gold/5 transition-all flex items-center justify-center gap-2">
          <span>{'\uD83D\uDCE5'}</span> Export Game State
        </button>
        <button onClick={handleImport} className="w-full glass rounded-xl px-4 py-3 border border-border-subtle text-text-primary font-bold hover:border-accent-gold hover:bg-accent-gold/5 transition-all flex items-center justify-center gap-2">
          <span>{'\uD83D\uDCE4'}</span> Import Game State
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" aria-label="Import game state file" />
      </div>
    </div>
  );
}
