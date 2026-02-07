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
  const friendsList = friends && friends.length > 0 ? friends : mockFriends;
  const requestsList = friendRequests && friendRequests.length > 0 ? friendRequests : mockRequests;

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