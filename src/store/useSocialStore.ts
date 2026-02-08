// ============================================
// LIFEQUEST — Social State Store (Zustand)
// ============================================

import { create } from 'zustand';
import { UserProfile, Friendship, Community, ActivityItem, Notification, Message, SocialChallenge } from '@/lib/types';

interface SocialStore {
  // Friends
  friends: Friendship[];
  friendRequests: Friendship[];
  setFriends: (friends: Friendship[]) => void;
  setFriendRequests: (requests: Friendship[]) => void;
  addFriend: (friendship: Friendship) => void;
  removeFriend: (friendshipId: string) => void;
  acceptRequest: (friendshipId: string) => void;

  // Communities
  communities: Community[];
  joinedCommunities: string[];
  setCommunities: (communities: Community[]) => void;
  setJoinedCommunities: (ids: string[]) => void;

  // Activity feed
  activityFeed: ActivityItem[];
  setActivityFeed: (items: ActivityItem[]) => void;
  prependActivity: (item: ActivityItem) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifs: Notification[]) => void;
  addNotification: (notif: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Messages
  conversations: Record<string, Message[]>;
  setConversation: (partnerId: string, messages: Message[]) => void;
  addMessage: (partnerId: string, message: Message) => void;

  // Challenges
  challenges: SocialChallenge[];
  setChallenges: (challenges: SocialChallenge[]) => void;

  // Leaderboard
  leaderboard: UserProfile[];
  setLeaderboard: (users: UserProfile[]) => void;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  friends: [],
  friendRequests: [],
  setFriends: (friends) => set({ friends }),
  setFriendRequests: (requests) => set({ friendRequests: requests }),
  addFriend: (friendship) => set(s => ({ friends: [...s.friends, friendship] })),
  removeFriend: (friendshipId) => set(s => ({
    friends: s.friends.filter(f => f.id !== friendshipId),
  })),
  acceptRequest: (friendshipId) => set(s => ({
    friendRequests: s.friendRequests.filter(f => f.id !== friendshipId),
    friends: [...s.friends, ...s.friendRequests.filter(f => f.id === friendshipId).map(f => ({ ...f, status: 'accepted' as const }))],
  })),

  communities: [],
  joinedCommunities: [],
  setCommunities: (communities) => set({ communities }),
  setJoinedCommunities: (ids) => set({ joinedCommunities: ids }),

  activityFeed: [],
  setActivityFeed: (items) => set({ activityFeed: items }),
  prependActivity: (item) => set(s => ({ activityFeed: [item, ...s.activityFeed].slice(0, 100) })),

  notifications: [],
  unreadCount: 0,
  setNotifications: (notifs) => set({
    notifications: notifs,
    unreadCount: notifs.filter(n => !n.readAt).length,
  }),
  addNotification: (notif) => set(s => ({
    notifications: [notif, ...s.notifications],
    unreadCount: s.unreadCount + 1,
  })),
  markNotificationRead: (id) => set(s => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n),
    unreadCount: Math.max(0, s.unreadCount - 1),
  })),
  markAllRead: () => set(s => ({
    notifications: s.notifications.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() })),
    unreadCount: 0,
  })),

  conversations: {},
  setConversation: (partnerId, messages) => set(s => ({
    conversations: { ...s.conversations, [partnerId]: messages },
  })),
  addMessage: (partnerId, message) => set(s => ({
    conversations: {
      ...s.conversations,
      [partnerId]: [...(s.conversations[partnerId] || []), message],
    },
  })),

  challenges: [],
  setChallenges: (challenges) => set({ challenges }),

  leaderboard: [],
  setLeaderboard: (users) => set({ leaderboard: users }),
}));
