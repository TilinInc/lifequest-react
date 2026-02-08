'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';

interface Challenge {
  id: string;
  title: string;
  description: string;
  skill: string;
  targetValue: number;
  participantCount: number;
  startDate: string;
  endDate: string;
  progress: number;
  type: '1v1' | 'Community' | 'Open';
  participants: { id: string; avatar: string; username: string }[];
  isJoined: boolean;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '7-Day Strength Sprint',
    description: 'Complete 7 consecutive days of strength training.',
    skill: 'Strength',
    targetValue: 7,
    participantCount: 156,
    startDate: '2024-02-07',
    endDate: '2024-02-14',
    progress: 5,
    type: 'Open',
    participants: [
      { id: 'p1', avatar: '👨', username: 'AlexJ' },
      { id: 'p2', avatar: '👩', username: 'SarahM' },
      { id: 'p3', avatar: '👨', username: 'MikeD' },
    ],
    isJoined: true,
  },
  {
    id: '2',
    title: 'Community XP Race',
    description: 'Earn 5000 XP before the deadline with your community.',
    skill: 'Any',
    targetValue: 5000,
    participantCount: 423,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    progress: 3200,
    type: 'Community',
    participants: [
      { id: 'p4', avatar: '👨', username: 'JasonL' },
      { id: 'p5', avatar: '👩', username: 'EmilyR' },
      { id: 'p6', avatar: '👨', username: 'ChrisP' },
    ],
    isJoined: false,
  },
  {
    id: '3',
    title: '1v1 Discipline Duel',
    description: 'Head-to-head meditation challenge. 20 minutes daily.',
    skill: 'Mindfulness',
    targetValue: 20,
    participantCount: 2,
    startDate: '2024-02-10',
    endDate: '2024-02-17',
    progress: 0,
    type: '1v1',
    participants: [
      { id: 'p7', avatar: '👨', username: 'RyanK' },
      { id: 'p8', avatar: '👨', username: 'TomasZ' },
    ],
    isJoined: false,
  },
];

type FilterTab = 'active' | 'upcoming' | 'completed';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [activeTab, setActiveTab] = useState<FilterTab>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    skill: 'Any',
    targetValue: 10,
    durationDays: 7,
  });

  const filteredChallenges = challenges.filter((challenge) => {
    const today = new Date('2024-02-07');
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);

    if (activeTab === 'active') {
      return start <= today && today <= end;
    } else if (activeTab === 'upcoming') {
      return start > today;
    } else {
      return end < today;
    }
  });

  const handleCreateChallenge = () => {
    if (newChallenge.title.trim()) {
      const today = new Date('2024-02-07');
      const startDate = today.toISOString().split('T')[0];
      const endDate = new Date(today.getTime() + newChallenge.durationDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const challenge: Challenge = {
        id: String(challenges.length + 1),
        title: newChallenge.title,
        description: newChallenge.description,
        skill: newChallenge.skill,
        targetValue: newChallenge.targetValue,
        participantCount: 1,
        startDate,
        endDate,
        progress: 0,
        type: 'Open',
        participants: [{ id: 'user1', avatar: '👤', username: 'You' }],
        isJoined: true,
      };
      setChallenges([...challenges, challenge]);
      setNewChallenge({
        title: '',
        description: '',
        skill: 'Any',
        targetValue: 10,
        durationDays: 7,
      });
      setShowCreateModal(false);
    }
  };

  const handleToggleJoinChallenge = (id: string) => {
    setChallenges(
      challenges.map((c) =>
        c.id === id
          ? {
              ...c,
              isJoined: !c.isJoined,
              participantCount: c.isJoined
                ? c.participantCount - 1
                : c.participantCount + 1,
            }
          : c
      )
    );
  };

  const getProgressPercentage = (challenge: Challenge) => {
    return (challenge.progress / challenge.targetValue) * 100;
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
              className="text-text-secondary hover:text-text-primary transition"
            >
              Communities
            </Link>
            <Link
              href="/social/challenges"
              className="border-b-2 border-accent-gold text-text-primary font-semibold"
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
            <h1 className="text-4xl font-bold">Challenges</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              Create Challenge
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4">
            {(['active', 'upcoming', 'completed'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                  activeTab === tab
                    ? 'bg-accent-gold text-black'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="glass rounded-lg p-6 border border-border-subtle hover:border-accent-gold transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{challenge.title}</h3>
                    <span className="px-3 py-1 bg-accent-gold bg-opacity-20 text-accent-gold text-xs font-semibold rounded-full">
                      {challenge.type}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-3">{challenge.description}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-text-muted text-sm">Skill</p>
                  <p className="font-semibold">{challenge.skill}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Target</p>
                  <p className="font-semibold">{challenge.targetValue} points</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Participants</p>
                  <p className="font-semibold">{challenge.participantCount}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Duration</p>
                  <p className="font-semibold">
                    {challenge.startDate} to {challenge.endDate}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-text-muted">Progress</p>
                  <p className="text-sm font-semibold">
                    {challenge.progress} / {challenge.targetValue}
                  </p>
                </div>
                <div className="w-full bg-bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent-gold h-full transition-all duration-300"
                    style={{ width: `${Math.min(getProgressPercentage(challenge), 100)}%` }}
                  />
                </div>
              </div>

              {/* Participants Avatars */}
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm text-text-muted">Participants:</p>
                <div className="flex -space-x-2">
                  {challenge.participants.slice(0, 5).map((participant) => (
                    <div
                      key={participant.id}
                      className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-subtle flex items-center justify-center text-sm hover:scale-110 transition"
                      title={participant.username}
                    >
                      {participant.avatar}
                    </div>
                  ))}
                  {challenge.participants.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-subtle flex items-center justify-center text-xs text-text-muted font-semibold">
                      +{challenge.participants.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => handleToggleJoinChallenge(challenge.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  challenge.isJoined
                    ? 'bg-bg-tertiary border border-border-subtle text-text-primary hover:bg-bg-secondary'
                    : 'bg-accent-gold text-black hover:bg-yellow-500'
                }`}
              >
                {challenge.isJoined ? 'Joined' : 'Join Challenge'}
              </button>
            </div>
          ))}

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted text-lg mb-4">
                No {activeTab} challenges at the moment.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
              >
                Create the first one
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="glass rounded-lg p-8 border border-border-subtle max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Create Challenge</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Challenge Title
                </label>
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={(e) =>
                    setNewChallenge({ ...newChallenge, title: e.target.value })
                  }
                  placeholder="Enter challenge title"
                  className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Description
                </label>
                <textarea
                  value={newChallenge.description}
                  onChange={(e) =>
                    setNewChallenge({
                      ...newChallenge,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the challenge"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Skill
                  </label>
                  <select
                    value={newChallenge.skill}
                    onChange={(e) =>
                      setNewChallenge({ ...newChallenge, skill: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:border-accent-gold transition"
                  >
                    <option>Any</option>
                    <option>Strength</option>
                    <option>Cardio</option>
                    <option>Mindfulness</option>
                    <option>Learning</option>
                    <option>Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={newChallenge.targetValue}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        targetValue: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:outline-none focus:border-accent-gold transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Duration (days): {newChallenge.durationDays}
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={newChallenge.durationDays}
                  onChange={(e) =>
                    setNewChallenge({
                      ...newChallenge,
                      durationDays: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
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
                onClick={handleCreateChallenge}
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
