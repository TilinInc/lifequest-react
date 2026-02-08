'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';

type TabType = 'friends' | 'requests';

interface Friend {
  id: string;
  username: string;
  avatar: string;
  totalLevel: number;
}

interface FriendRequest {
  id: string;
  username: string;
  avatar: string;
  userId: string;
}

const mockFriends: Friend[] = [
  { id: '1', username: 'Alex Chen', avatar: 'A', totalLevel: 5 },
  { id: '2', username: 'Jordan Smith', avatar: 'J', totalLevel: 8 },
  { id: '3', username: 'Sam Williams', avatar: 'S', totalLevel: 3 },
  { id: '4', username: 'Taylor Johnson', avatar: 'T', totalLevel: 12 },
];

const mockRequests: FriendRequest[] = [
  { id: '1', username: 'Morgan Lee', avatar: 'M', userId: 'user5' },
  { id: '2', username: 'Casey Davis', avatar: 'C', userId: 'user6' },
];

export default function FriendsPage() {
  const { friends, friendRequests } = useSocialStore();
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  // Use mock data if store data is empty
  const friendsList: Friend[] = friends && friends.length > 0
    ? friends.map(f => ({
        id: f.id,
        username: f.profile?.username || 'Unknown',
        avatar: f.profile?.username?.[0]?.toUpperCase() || '?',
        totalLevel: 0,
      }))
    : mockFriends;
  const requestsList: FriendRequest[] = friendRequests && friendRequests.length > 0
    ? friendRequests.map(r => ({
        id: r.id,
        username: r.profile?.username || 'Unknown',
        avatar: r.profile?.username?.[0]?.toUpperCase() || '?',
        userId: r.requesterId,
      }))
    : mockRequests;

  // Filter friends based on search
  const filteredFriends = friendsList.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter requests based on search
  const filteredRequests = requestsList.filter((request) =>
    request.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccept = (requestId: string) => {
    // In a real app, this would call an API
    console.log('Accept request:', requestId);
  };

  const handleDecline = (requestId: string) => {
    // In a real app, this would call an API
    console.log('Decline request:', requestId);
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary/50 p-4">
        <div className="mx-auto max-w-2xl">
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
            <h1 className="text-3xl font-bold text-text-primary">Friends</h1>
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
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-bg-primary border border-border-subtle px-4 py-2 pl-10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-border-subtle">
          <button
            onClick={() => setActiveTab('friends')}
            className={`relative pb-3 font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Friends
            <span className="ml-2 inline-block rounded-full bg-accent-gold/20 px-2 py-0.5 text-sm text-accent-gold font-semibold">
              {filteredFriends.length}
            </span>
            {activeTab === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold rounded-t" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`relative pb-3 font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Requests
            <span className="ml-2 inline-block rounded-full bg-accent-green/20 px-2 py-0.5 text-sm text-accent-green font-semibold">
              {filteredRequests.length}
            </span>
            {activeTab === 'requests' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold rounded-t" />
            )}
          </button>
        </div>

        {/* Friends Tab Content */}
        {activeTab === 'friends' && (
          <>
            {filteredFriends.length > 0 ? (
              <div className="space-y-3">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="glass rounded-lg border border-border-subtle bg-bg-secondary/50 p-4 flex items-center justify-between hover:bg-bg-secondary/70 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-gold to-accent-green text-bg-primary font-bold">
                        {friend.avatar}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-text-primary font-semibold">
                          {friend.username}
                        </h3>
                        <p className="text-text-muted text-sm">
                          Level {friend.totalLevel}
                        </p>
                      </div>
                    </div>

                    {/* View Profile Link */}
                    <Link
                      href={`/social/profile/${friend.id}`}
                      className="rounded-lg bg-accent-gold/20 px-4 py-2 text-accent-gold font-medium hover:bg-accent-gold/30 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border-subtle bg-bg-secondary/50 p-12 text-center">
                <p className="text-text-secondary">
                  {searchQuery
                    ? 'No friends found matching your search.'
                    : 'You have no friends yet.'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Requests Tab Content */}
        {activeTab === 'requests' && (
          <>
            {filteredRequests.length > 0 ? (
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="glass rounded-lg border border-border-subtle bg-bg-secondary/50 p-4 flex items-center justify-between hover:bg-bg-secondary/70 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-gold to-accent-green text-bg-primary font-bold">
                        {request.avatar}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-text-primary font-semibold">
                          {request.username}
                        </h3>
                        <p className="text-text-muted text-sm">wants to be your friend</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="rounded-lg bg-accent-green px-4 py-2 text-bg-primary font-medium hover:bg-accent-green/90 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="rounded-lg bg-bg-tertiary border border-border-subtle px-4 py-2 text-text-secondary font-medium hover:bg-bg-secondary transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border-subtle bg-bg-secondary/50 p-12 text-center">
                <p className="text-text-secondary">
                  {searchQuery
                    ? 'No requests found matching your search.'
                    : 'You have no pending friend requests.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button - Add Friend */}
      <Link
        href="/social/add-friend"
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-gold to-accent-green text-bg-primary font-bold text-2xl shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        title="Add Friend"
      >
        +
      </Link>
    </div>
  );
}
