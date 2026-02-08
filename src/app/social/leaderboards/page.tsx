'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';

type LeaderboardType = 'global' | 'friends' | 'skill';

interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp?: number;
}

const mockGlobalLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: '1', username: 'Alex Chen', avatar: 'A', level: 25, xp: 15000 },
  { rank: 2, id: '2', username: 'Jordan Smith', avatar: 'J', level: 23, xp: 14200 },
  { rank: 3, id: '3', username: 'Sam Williams', avatar: 'S', level: 22, xp: 13800 },
  { rank: 4, id: '4', username: 'Taylor Johnson', avatar: 'T', level: 20, xp: 12500 },
  { rank: 5, id: '5', username: 'Morgan Lee', avatar: 'M', level: 19, xp: 11900 },
  { rank: 6, id: '6', username: 'Casey Davis', avatar: 'C', level: 18, xp: 11200 },
  { rank: 7, id: '7', username: 'Blake Turner', avatar: 'B', level: 17, xp: 10500 },
  { rank: 8, id: '8', username: 'Riley White', avatar: 'R', level: 16, xp: 9800 },
  { rank: 9, id: '9', username: 'Charlie Brown', avatar: 'C', level: 15, xp: 9200 },
  { rank: 10, id: '10', username: 'Dana Green', avatar: 'D', level: 14, xp: 8500 },
];

const mockFriendsLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: '1', username: 'Alex Chen', avatar: 'A', level: 25, xp: 15000 },
  { rank: 2, id: '2', username: 'Jordan Smith', avatar: 'J', level: 23, xp: 14200 },
  { rank: 3, id: '3', username: 'Sam Williams', avatar: 'S', level: 22, xp: 13800 },
  { rank: 4, id: '4', username: 'Taylor Johnson', avatar: 'T', level: 20, xp: 12500 },
];

const skills = ['JavaScript', 'Python', 'Design', 'Data Science', 'DevOps'];

const getMedalEmoji = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

export default function LeaderboardPage() {
  const { leaderboard } = useSocialStore();
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('global');
  const [selectedSkill, setSelectedSkill] = useState('JavaScript');
  const [searchQuery, setSearchQuery] = useState('');
  const currentUserId = '1'; // Mock current user ID

  // Use appropriate mock data based on selection
  let displayData = mockGlobalLeaderboard;
  if (leaderboardType === 'friends') {
    displayData = mockFriendsLeaderboard;
  } else if (leaderboardType === 'skill') {
    // In a real app, this would fetch skill-specific data
    displayData = mockGlobalLeaderboard;
  }

  // Filter based on search query
  const filteredLeaderboard = displayData.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary/50 p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/social/feed"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">Leaderboards</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Find user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-bg-primary border border-border-subtle px-4 py-2 pl-10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Type Selector Tabs */}
        <div className="mb-8 flex gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setLeaderboardType('global')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                leaderboardType === 'global'
                  ? 'bg-accent-gold text-bg-primary'
                  : 'bg-bg-secondary text-text-secondary border border-border-subtle hover:text-text-primary'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setLeaderboardType('friends')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                leaderboardType === 'friends'
                  ? 'bg-accent-gold text-bg-primary'
                  : 'bg-bg-secondary text-text-secondary border border-border-subtle hover:text-text-primary'
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setLeaderboardType('skill')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                leaderboardType === 'skill'
                  ? 'bg-accent-gold text-bg-primary'
                  : 'bg-bg-secondary text-text-secondary border border-border-subtle hover:text-text-primary'
              }`}
            >
              Per-Skill
            </button>
          </div>

          {/* Skill Dropdown - only show if Per-Skill is selected */}
          {leaderboardType === 'skill' && (
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="rounded-lg bg-bg-secondary border border-border-subtle px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold ml-auto"
            >
              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-2">
          {filteredLeaderboard.length > 0 ? (
            <>
              {/* Header Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-text-muted text-sm font-semibold">
                <div className="col-span-2">Rank</div>
                <div className="col-span-5">User</div>
                <div className="col-span-3">Level</div>
                <div className="col-span-2">XP</div>
              </div>

              {/* Leaderboard Rows */}
              {filteredLeaderboard.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                return (
                  <div
                    key={user.id}
                    className={`glass rounded-lg border transition-all ${
                      isCurrentUser
                        ? 'border-accent-gold bg-accent-gold/10 shadow-lg'
                        : 'border-border-subtle bg-bg-secondary/50 hover:bg-bg-secondary/70'
                    } p-4`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {getMedalEmoji(user.rank)}
                        </span>
                        <span className="text-lg font-bold text-text-primary">
                          #{user.rank}
                        </span>
                      </div>

                      {/* User Info */}
                      <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-gold to-accent-green text-bg-primary font-bold text-sm">
                          {user.avatar}
                        </div>
                        <span className="text-text-primary font-semibold">
                          {user.username}
                        </span>
                      </div>

                      {/* Level */}
                      <div className="col-span-6 md:col-span-3 flex items-center">
                        <span className="text-text-secondary text-sm md:text-base">
                          Level <span className="text-accent-gold font-bold text-lg">{user.level}</span>
                        </span>
                      </div>

                      {/* XP */}
                      <div className="col-span-6 md:col-span-2 flex justify-end md:justify-start">
                        <span className="text-text-muted text-sm">
                          {user.xp ? `${user.xp.toLocaleString()} XP` : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Current User Badge */}
                    {isCurrentUser && (
                      <div className="mt-2 text-center">
                        <span className="inline-block rounded-full bg-accent-gold/30 px-3 py-1 text-xs font-semibold text-accent-gold">
                          You
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="rounded-lg border border-border-subtle bg-bg-secondary/50 p-12 text-center">
              <p className="text-text-secondary">
                No users found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
