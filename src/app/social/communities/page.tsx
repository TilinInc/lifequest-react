'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';

interface Community {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  description: string;
  isJoined: boolean;
  type: 'public' | 'private';
}

const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Iron Warriors',
    icon: '⚔️',
    memberCount: 1243,
    description: 'A community dedicated to strength training and physical excellence.',
    isJoined: true,
    type: 'public',
  },
  {
    id: '2',
    name: 'Mind Masters',
    icon: '🧠',
    memberCount: 2156,
    description: 'Focus on cognitive growth, learning, and mental challenges.',
    isJoined: false,
    type: 'public',
  },
  {
    id: '3',
    name: 'Streak Lords',
    icon: '🔥',
    memberCount: 3421,
    description: 'Build unstoppable daily habits and maintain epic streaks.',
    isJoined: true,
    type: 'public',
  },
  {
    id: '4',
    name: 'All-Rounders',
    icon: '🌟',
    memberCount: 892,
    description: 'Balance life across all dimensions and master holistic growth.',
    isJoined: false,
    type: 'public',
  },
];

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    isPrivate: false,
  });

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCommunity = () => {
    if (newCommunity.name.trim()) {
      const community: Community = {
        id: String(communities.length + 1),
        name: newCommunity.name,
        icon: '✨',
        memberCount: 1,
        description: newCommunity.description || 'No description yet',
        isJoined: true,
        type: newCommunity.isPrivate ? 'private' : 'public',
      };
      setCommunities([...communities, community]);
      setNewCommunity({ name: '', description: '', isPrivate: false });
      setShowCreateModal(false);
    }
  };

  const handleToggleJoin = (id: string) => {
    setCommunities(
      communities.map((c) =>
        c.id === id ? { ...c, isJoined: !c.isJoined } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-40 border-b border-border-subtle bg-bg-primary/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link
              href="/social/feed"
              className="text-text-secondary hover:text-text-primary transition"
            >
              Feed
            </Link>
            <Link
              href="/social/communities"
              className="border-b-2 border-accent-gold text-text-primary font-semibold"
            >
              Communities
            </Link>
            <Link
              href="/social/challenges"
              className="text-text-secondary hover:text-text-primary transition"
            >
              Challenges
            </Link>
            <Link
              href="/social/friends"
              className="text-text-secondary hover:text-text-primary transition"
            >
              Friends
            </Link>
            <Link
              href="/social/leaderboard"
              className="text-text-secondary hover:text-text-primary transition"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">Communities</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              Create
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition"
          />
        </div>
      </div>

      {/* Communities Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="glass rounded-lg p-6 border border-border-subtle hover:border-accent-gold transition group"
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
                <span>👥 {community.memberCount.toLocaleString()} members</span>
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
