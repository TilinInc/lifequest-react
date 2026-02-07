// ============================================
// LIFEQUEST â Type Definitions
// ============================================

// --- Skills ---
export type SkillId = 'strength' | 'endurance' | 'discipline' | 'intellect' | 'social' | 'mind' | 'durability';

export interface SkillAction {
  id: string;
  name: string;
  xp: number;
  desc?: string;
  custom?: boolean;
}

export interface SkillDefinition {
  id: SkillId;
  name: string;
  icon: string;
  color: string;
  desc: string;
  actions: SkillAction[];
}

export interface SkillState {
  id: SkillId;
  xp: number;
}

// --- Action Log ---
export interface ActionLogEntry {
  id: string;
  skillId: SkillId;
  actionId: string;
  actionName: string;
  xp: number;
  baseXp: number;
  streakBonus: number;
  timestamp: number;
}

// --- Streaks ---
export interface StreakData {
  current: number;
  best: number;
  lastActiveDate: string | null; // YYYY-MM-DD
}

// --- Quests ---
export type QuestType = 'skill_count' | 'skill_action' | 'actions' | 'unique_skills';

export interface Quest {
  id: string;
  name: string;
  desc: string;
  type: QuestType;
  skill?: SkillId;
  target: number;
  xp: number;
}

export interface QuestCompletion {
  dailyDate: string;
  daily: Record<string, boolean>;
  weeklyDate: string;
  weekly: Record<string, boolean>;
}

// --- Achievements ---
export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  xp: number;
  check: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  skills: SkillState[];
  log: ActionLogEntry[];
  unlockedAchievements: string[];
  globalStreak: number;
  totalActions: number;
  totalLevel: number;
}

// --- Hardcore / Penalty ---
export type PenaltyTier = 'warning' | 'penaltyZone' | 'critical' | null;

export interface PenaltyState {
  tier: PenaltyTier;
  consecutiveMisses: number;
  penaltyZoneSurvived: number;
  xpDecayed: number;
  lastCheckDate: string | null;
  penaltyQuestActive: boolean;
}

// --- Todos ---
export interface TodoItem {
  id: string;
  skillId: SkillId;
  actionId: string;
  actionName: string;
  completed: boolean;
}

export interface TodoState {
  lastResetDate: string;
  items: TodoItem[];
}

// --- Progress Pictures ---
export interface ProgressPicture {
  id: string;
  dataUrl: string;
  dateStr: string;
  timestamp: number;
  level: number;
  title: string;
}

// --- Weight Log ---
export interface WeightEntry {
  id: string;
  timestamp: number;
  weight: number;
  dateStr: string;
  weekKey: string;
  level: number;
  title: string;
}

// --- System Messages ---
export interface SystemMessage {
  id: string;
  text: string;
  tier?: PenaltyTier;
  ts: number;
}

// --- Full Game State ---
export interface GameState {
  skills: SkillState[];
  log: ActionLogEntry[];
  unlockedAchievements: string[];
  completedAchievementRewards: string[];
  streaks: {
    global: StreakData;
    perSkill: Record<string, StreakData>;
  };
  hardcoreMode: boolean;
  penalty: PenaltyState;
  systemMessages: SystemMessage[];
  lastDecayDate: string | null;
  decayLog: any[];
  completedQuests: QuestCompletion;
  todos: TodoState;
  progressPictures: { uploads: ProgressPicture[] };
  weightLog: { entries: WeightEntry[] };
  createdAt: number;
}

// --- Social Types ---
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  isPublic: boolean;
  totalLevel: number;
  createdAt: string;
}

export interface Friendship {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
  profile?: UserProfile;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  creatorId: string;
  memberCount: number;
  isPublic: boolean;
  createdAt: string;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: 'creator' | 'moderator' | 'member';
  joinedAt: string;
  profile?: UserProfile;
}

export interface SocialChallenge {
  id: string;
  creatorId: string;
  challengeType: '1v1' | 'community' | 'leaderboard';
  title: string;
  description: string;
  skillFilter: SkillId | null;
  targetValue: number;
  startDate: string;
  endDate: string;
  participants?: ChallengeParticipant[];
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  joinedAt: string;
  profile?: UserProfile;
}

export type ActivityType = 'level_up' | 'achievement' | 'streak' | 'challenge_complete' | 'community_join';

export interface ActivityItem {
  id: string;
  userId: string;
  activityType: ActivityType;
  metadata: Record<string, any>;
  isPublic: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId?: string;
  communityId?: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  senderProfile?: UserProfile;
}

export interface Notification {
  id: string;
  userId: string;
  fromUserId: string | null;
  notificationType: string;
  metadata: Record<string, any>;
  readAt: string | null;
  createdAt: string;
  fromProfile?: UserProfile;
}

// --- UI Types ---
export type TabId = 'dashboard' | 'skills' | 'social' | 'quests' | 'profile';
export type ToastType = 'xp' | 'system' | 'penalty' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timestamp: number;
}
