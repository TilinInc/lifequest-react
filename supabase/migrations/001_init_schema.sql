-- ============================================
-- LIFEQUEST â Database Schema
-- Supabase PostgreSQL Migration
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE GAME TABLES
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT true,
  hardcore_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills (7 per user)
CREATE TABLE skills (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  xp BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Action logs
CREATE TABLE action_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  action_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  xp_earned INT NOT NULL,
  base_xp INT NOT NULL DEFAULT 0,
  streak_bonus INT DEFAULT 0,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_action_logs_user_date ON action_logs(user_id, logged_at);

-- Streaks (global + per-skill)
CREATE TABLE streaks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT, -- NULL for global streak
  current_streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, COALESCE(skill_id, '__global__'))
);

-- Achievements
CREATE TABLE achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  reward_claimed BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Completed quests tracking
CREATE TABLE completed_quests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  quest_type TEXT NOT NULL, -- 'daily' or 'weekly'
  assigned_date DATE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id, assigned_date)
);

-- Hardcore penalty state
CREATE TABLE penalty_state (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT, -- null, 'warning', 'penaltyZone', 'critical'
  consecutive_misses INT DEFAULT 0,
  penalty_zone_survived INT DEFAULT 0,
  xp_decayed BIGINT DEFAULT 0,
  last_check_date DATE, 
  penalty_quest_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Todos
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  action_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_todos user_date ON todos(user_id, reset_date);

-- Progress pictures
CREATE TABLE progress_pictures (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  caption TEXT,
  level_at_upload INT DEFAULT 0,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight log
CREATE TABLE weight_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_weight_user_date ON weight_logs(user_id, logged_at);

-- Custom actions
CREATE TABLE custom_actions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  action_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  xp INT NOT NULL DEFAULT 25,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id, action_id)
);

-- Decay log
CREATE TABLE decay_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  xp_lost INT NOT NULL,
  decay_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SOCIAL TABLES
-- ============================================

-- Friendships
CREATE TABLE friendships (
  id BIGSERIAL PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);
CREATE INDEX idx_friendships_recipient ON friendships(recipient_id, status);

-- Communities
CREATE TABLE communities (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  icon_url TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_count INT DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community members
CREATE TABLE community_members (
  id BIGSERIAL PRIMARY KEY,
  community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('creator', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Social challenges
CREATE TABLE social_challenges (
  id BIGSERIAL PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id BIGINT REFERENCES communities(id) ON DELETE SET NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('1v1', 'community', 'open')),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  skill_filter TEXT,
  target_value INT NOT NULL,
  metric TEXT DEFAULT 'actions' CHECK (metric IN ('actions', 'xp', 'level')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge participants
CREATE TABLE challenge_participants (
  id BIGSERIAL PRIMARY KEY,
  challenge_id BIGINT NOT NULL REFERENCES social_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Activity feed
CREATE TABLE activity_feed (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_activity_user ON activity_feed(user_id, created_at DESC);

-- Messages (DM + community)
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id BIGINT REFERENCES communities(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (recipient_id IS NOT NULL OR community_id IS NOT NULL)
);
CREATE INDEX idx_messages_dm ON messages(recipient_id, created_at DESC) WHERE recipient_id IS NOT NULL;
CREATE INDEX idx_messages_community ON messages(community_id, created_at DESC) WHERE community_id IS NOT NULL;

-- Notifications
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function: increment skill XP
CREATE OR REPLACE FUNCTION increment_skill_xp(p_user_id UUID, p_skill_id TEXT, p_xp INT)
RETURNS void AS $$
BEGIN
  UPDATE skills SET xp = xp + p_xp, updated_at = NOW()
  WHERE user_id = p_user_id AND skill_id = p_skill_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: initialize new user (called after signup)
CREATE OR REPLACE FUNCTION init_user_game_state()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, username, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'display_name');

  -- Create 7 skills
  INSERT INTO skills (user_id, skill_id) VALUES
    (NEW.id, 'strength'), (NEW.id, 'endurance'), (NEW.id, 'discipline'),
    (NEW.id, 'intellect'), (NEW.id, 'social'), (NEW.id, 'mind'), (NEW.id, 'durability');

  -- Create global streak
  INSERT INTO streaks (user_id, skill_id) VALUES (NEW.id, NULL);

  -- Create penalty state
  INSERT INTO penalty_state (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-init on signap
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION init_user_game_state();

-- Function: get user leaderboard position
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INT DEFAULT 50, p_offset INT DEFAULT 0)
RETURNS TABLE(
  user_id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  total_xp BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    COALESCE(SUM(s.xp), 0) AS total_xp,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(s.xp), 0) DESC) AS rank
  FROM profiles p
  LEFT JOIN skills s ON s.user_id = p.id
  WHERE p.is_public = true
  GROUP BY p.id, p.username, p.display_name, p.avatar_url
  ORDER BY total_xp DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
