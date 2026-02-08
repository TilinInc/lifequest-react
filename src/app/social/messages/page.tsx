'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';

interface Conversation {
  id: string;
  userId: string;
  avatar: string;
  username: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: 'user1',
    avatar: '👨',
    username: 'AlexJ',
    lastMessage: 'Just completed the strength sprint! Great challenge.',
    timestamp: '2 hours ago',
    unreadCount: 2,
  },
  {
    id: '2',
    userId: 'user2',
    avatar: '👩',
    username: 'SarahM',
    lastMessage: 'Want to join the meditation challenge together?',
    timestamp: '5 hours ago',
    unreadCount: 0,
  },
  {
    id: '3',
    userId: 'user3',
    avatar: '👨',
    username: 'MikeD',
    lastMessage: 'See you at the community meetup next week!',
    timestamp: '1 day ago',
    unreadCount: 0,
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(
    mockConversations
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState('');

  const filteredConversations = conversations.filter((conversation) =>
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsRead = (id: string) => {
    setConversations(
      conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleNewMessage = () => {
    if (selectedUsername.trim()) {
      const exists = conversations.some(
        (c) => c.username.toLowerCase() === selectedUsername.toLowerCase()
      );

      if (!exists) {
        const newConversation: Conversation = {
          id: String(conversations.length + 1),
          userId: `user${conversations.length + 1}`,
          avatar: '👤',
          username: selectedUsername,
          lastMessage: 'No messages yet',
          timestamp: 'now',
          unreadCount: 0,
        };
        setConversations([newConversation, ...conversations]);
      }

      setSelectedUsername('');
      setShowNewMessageModal(false);
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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
              className="text-text-secondary hover:text-text-primary transition"
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
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold">Messages</h1>
              {totalUnread > 0 && (
                <p className="text-sm text-text-secondary mt-1">
                  {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-6 py-2 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              New Message
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        {filteredConversations.length > 0 ? (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/social/messages/${conversation.userId}`}
                onClick={() => handleMarkAsRead(conversation.id)}
              >
                <div className="glass rounded-lg p-4 border border-border-subtle hover:border-accent-gold hover:bg-bg-secondary/50 transition cursor-pointer group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-2xl flex-shrink-0">
                      {conversation.avatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-text-primary group-hover:text-accent-gold transition">
                          {conversation.username}
                        </h3>
                        <span className="text-xs text-text-muted">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {/* Unread Badge */}
                    {conversation.unreadCount > 0 && (
                      <div className="w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg mb-4">
              No messages yet. Start a conversation with a friend!
            </p>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-6 py-2 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition inline-block"
            >
              Send a Message
            </button>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="glass rounded-lg p-8 border border-border-subtle max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Start a Conversation</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleNewMessage();
                    }
                  }}
                />
              </div>

              <p className="text-sm text-text-muted">
                Start a direct message with any user in the community.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setSelectedUsername('');
                }}
                className="flex-1 px-4 py-2 bg-bg-tertiary border border-border-subtle text-text-primary font-semibold rounded-lg hover:bg-bg-secondary transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNewMessage}
                className="flex-1 px-4 py-2 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedUsername.trim()}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
