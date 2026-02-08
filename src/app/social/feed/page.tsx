'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';

type FilterType = 'all' | 'achievements' | 'level_ups' | 'streaks';

interface Activity {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  type: 'level_up' | 'achievement' | 'streak';
  description: string;
  timestamp: Date;
}

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

const mockActivities: Activity[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'Alex Chen',
    userAvatar: 'A',
    type: 'level_up',
    description: 'reached Level 5 in JavaScript',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
  },
  {
    id: '2',
    userId: 'user2',
    username: 'Jordan Smith',
    userAvatar: 'J',
    type: 'achievement',
    description: 'unlocked "Code Master" achievement',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
  },
  {
    id: '3',
    userId: 'user3',
    username: 'Sam Williams',
    userAvatar: 'S',
    type: 'streak',
    description: 'hit a 30-day streak in Daily Coding',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
  },
  {
    id: '4',
    userId: 'user4',
    username: 'Taylor Johnson',
    userAvatar: 'T',
    type: 'level_up',
    description: 'reached Level 8 in Design',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h ago
  },
  {
    id: '5',
    userId: 'user5',
    username: 'Morgan Lee',
    userAvatar: 'M',
    type: 'achievement',
    description: 'unlocked "Speed Runner" achievement',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1d ago
  },
];

export default function FeedPage() {
  const { activityFeed } = useSocialStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use mock data if activityFeed is empty
  const activities: Activity[] = activityFeed && activityFeed.length > 0
    ? activityFeed.map(item => ({
        id: item.id,
        userId: item.userId,
        username: item.profile?.username || 'Unknown',
        userAvatar: item.profile?.avatarUrl || '',
        type: item.activityType as Activity['type'],
        description: item.metadata?.description || '',
        timestamp: new Date(item.createdAt),
      }))
    : mockActivities;

  // Filter activities based on selected filter
  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true;
    if (filter === 'achievements') return activity.type === 'achievement';
    if (filter === 'level_ups') return activity.type === 'level_up';
    if (filter === 'streaks') return activity.type === 'streak';
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top Navigation Tabs */}
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-bg-primary/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex gap-8">
            <Link
              href="/social/feed"
              className="border-b-2 border-accent-gold pb-2 text-text-primary font-medium"
            >
              Feed
            </Link>
            <Link
              href="/social/friends"
              className="border-b-2 border-transparent pb-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Friends
            </Link>
            <Link
              href="/social/leaderboards"
              className="border-b-2 border-transparent pb-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-text-primary">Activity Feed</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`rounded-full p-2 transition-all ${
              isRefreshing ? 'animate-spin' : 'hover:bg-bg-secondary'
            } text-text-secondary`}
            title="Refresh"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="rounded-lg bg-bg-secondary border border-border-subtle px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold"
          >
            <option value="all">All Activity</option>
            <option value="achievements">Achievements</option>
            <option value="level_ups">Level Ups</option>
            <option value="streaks">Streaks</option>
          </select>
        </div>

        {/* Activity Cards */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="glass rounded-xl border border-border-subtle bg-bg-secondary/50 p-4 transition-all hover:bg-bg-secondary/70"
              >
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-gold to-accent-green text-bg-primary font-bold text-lg">
                      {activity.userAvatar}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-text-primary font-semibold">
                        {activity.username}
                      </h3>
                      <span className="text-text-muted text-sm">
                        {getRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-text-secondary mt-1">{activity.description}</p>
                  </div>

                  {/* Activity Type Badge */}
                  <div className="flex-shrink-0">
                    {activity.type === 'level_up' && (
                      <span className="inline-block rounded-full bg-accent-green/20 px-3 py-1 text-xs font-medium text-accent-green">
                        Level Up
                      </span>
                    )}
                    {activity.type === 'achievement' && (
                      <span className="inline-block rounded-full bg-accent-gold/20 px-3 py-1 text-xs font-medium text-accent-gold">
                        Achievement
                      </span>
                    )}
                    {activity.type === 'streak' && (
                      <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
                        Streak
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border-subtle bg-bg-secondary/50 p-12 text-center">
            <p className="text-text-secondary mb-4">
              No activity yet. Add friends to see their progress!
            </p>
            <Link
              href="/social/friends"
              className="inline-block rounded-lg bg-accent-gold px-6 py-2 text-bg-primary font-medium hover:bg-accent-gold/90 transition-colors"
            >
              Add Friends
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
