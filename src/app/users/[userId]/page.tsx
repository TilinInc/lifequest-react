'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProgressBar from '@/components/Shared/ProgressBar';

// Mock public profile data (in production, fetched from Supabase)
const MOCK_PROFILE = {
  username: 'warrior_elite',
  displayName: 'Elite Warrior',
  bio: 'Leveling up every day. Strength main, but balanced build.',
  avatarUrl: null,
  totalLevel: 87,
  title: 'Champion',
  joinedDate: '2025-06-15',
  globalStreak: 23,
  bestStreak: 45,
  actionsLogged: 342,
  achievementsUnlocked: 18,
  skills: [
    { id: 'strength', name: 'Strength', icon: '💪', color: '#EF4444', level: 18 },
    { id: 'endurance', name: 'Endurance', icon: '🏃', color: '#F59E0B', level: 14 },
    { id: 'discipline', name: 'Discipline', icon: '⚔️', color: '#8B5CF6', level: 15 },
    { id: 'intellect', name: 'Intellect', icon: '🧠', color: '#3B82F6', level: 12 },
    { id: 'social', name: 'Social', icon: '👥', color: '#EC4899', level: 10 },
    { id: 'mind', name: 'Mind', icon: '🧘', color: '#14B8A6', level: 9 },
    { id: 'durability', name: 'Durability', icon: '🛡️', color: '#6366F1', level: 9 },
  ],
  recentAchievements: [
    { name: 'Centurion Grinder', icon: '🔥', desc: '100 total actions' },
    { name: 'Week Warrior', icon: '📅', desc: '7-day streak' },
    { name: 'STR Lv10', icon: '💪', desc: 'Reach STR level 10' },
  ],
};

export default function PublicProfilePage() {
  const params = useParams();
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none');
  const profile = MOCK_PROFILE;

  const handleFriendAction = () => {
    if (friendStatus === 'none') setFriendStatus('pending');
    else if (friendStatus === 'pending') setFriendStatus('none');
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {/* Back */}
        <Link href="/social/feed" className="text-text-muted hover:text-text-primary text-sm">← Back</Link>

        {/* Profile Header */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-gold to-accent-orange mx-auto flex items-center justify-center text-3xl font-bold text-bg-primary mb-3">
            {profile.displayName[0]}
          </div>
          <h1 className="text-xl font-bold">{profile.displayName}</h1>
          <p className="text-text-secondary text-sm">@{profile.username}</p>
          <p className="text-accent-gold font-medium mt-1">{profile.title} — Level {profile.totalLevel}</p>
          {profile.bio && <p className="text-text-muted text-sm mt-2">{profile.bio}</p>}

          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={handleFriendAction}
              className={`px-6 py-2 rounded-xl font-medium text-sm transition-all ${
                friendStatus === 'friends' ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' :
                friendStatus === 'pending' ? 'bg-bg-tertiary text-text-muted border border-border-subtle' :
                'bg-accent-gold text-bg-primary hover:brightness-110'
              }`}
            >
              {friendStatus === 'friends' ? '✓ Friends' : friendStatus === 'pending' ? 'Pending...' : 'Add Friend'}
            </button>
            <Link href={`/social/messages/${params.userId}`} className="px-6 py-2 rounded-xl font-medium text-sm border border-border-subtle hover:bg-bg-hover transition-all">
              Message
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Level', value: profile.totalLevel },
            { label: 'Streak', value: `${profile.globalStreak}d` },
            { label: 'Actions', value: profile.actionsLogged },
            { label: 'Awards', value: profile.achievementsUnlocked },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-xl p-3 text-center border border-border-subtle">
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className="font-bold mb-3">Skills</h2>
          <div className="space-y-2">
            {profile.skills.map(skill => (
              <div key={skill.id} className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-border-subtle">
                <span className="text-xl">{skill.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs font-bold" style={{ color: skill.color }}>Lv.{skill.level}</span>
                  </div>
                  <ProgressBar progress={skill.level / 99} color={skill.color} height={4} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h2 className="font-bold mb-3">Recent Achievements</h2>
          <div className="space-y-2">
            {profile.recentAchievements.map(ach => (
              <div key={ach.name} className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-accent-gold/20">
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <div className="text-sm font-bold text-accent-gold">{ach.name}</div>
                  <div className="text-xs text-text-muted">{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-text-muted text-xs">Member since {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>
    </div>
  );
}
