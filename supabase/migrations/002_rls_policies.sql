-- ============================================
-- LIFEQUEST — Row-Level Security Policies
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (is_public = true OR auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own skills" ON skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public skills readable" ON skills FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = skills.user_id AND is_public = true)
);
CREATE POLICY "Users can manage own skills" ON skills FOR ALL USING (auth.uid() = user_id);

-- Action logs
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own logs" ON action_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON action_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own streaks" ON streaks FOR ALL USING (auth.uid() = user_id);

-- Achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public achievements readable" ON achievements FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = achievements.user_id AND is_public = true)
);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON achievements FOR UPDATE USING (auth.uid() = user_id);

-- Completed quests
ALTER TABLE completed_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own quests" ON completed_quests FOR ALL USING (auth.uid() = user_id);

-- Penalty state
ALTER TABLE penalty_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own penalty" ON penalty_state FOR ALL USING (auth.uid() = user_id);

-- Todos
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own todos" ON todos FOR ALL USING (auth.uid() = user_id);

-- Progress pictures
ALTER TABLE progress_pictures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own pictures" ON progress_pictures FOR ALL USING (auth.uid() = user_id);

-- Weight logs
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own weight" ON weight_logs FOR ALL USING (auth.uid() = user_id);

-- Custom actions
ALTER TABLE custom_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own custom actions" ON custom_actions FOR ALL USING (auth.uid() = user_id);

-- Decay logs
ALTER TABLE decay_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own decay" ON decay_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own decay" ON decay_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Friendships
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own friendships" ON friendships FOR SELECT USING (
  auth.uid() = requester_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send friend requests" ON friendships FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update own friendships" ON friendships FOR UPDATE USING (
  auth.uid() = requester_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can delete own friendships" ON friendships FOR DELETE USING (
  auth.uid() = requester_id OR auth.uid() = recipient_id
);

-- Communities
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public communities readable" ON communities FOR SELECT USING (is_public = true);
CREATE POLICY "Members can see private communities" ON communities FOR SELECT USING (
  EXISTS (SELECT 1 FROM community_members WHERE community_id = communities.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create communities" ON communities FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update communities" ON communities FOR UPDATE USING (auth.uid() = creator_id);

-- Community members
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can see community members" ON community_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM community_members cm WHERE cm.community_id = community_members.community_id AND cm.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM communities c WHERE c.id = community_members.community_id AND c.is_public = true)
);
CREATE POLICY "Users can join communities" ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave communities" ON community_members FOR DELETE USING (auth.uid() = user_id);

-- Social challenges
ALTER TABLE social_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges are readable" ON social_challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON social_challenges FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Challenge participants
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants are readable" ON challenge_participants FOR SELECT USING (true);
CREATE POLICY "Users can join challenges" ON challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON challenge_participants FOR UPDATE USING (auth.uid() = user_id);

-- Activity feed
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public activity readable" ON activity_feed FOR SELECT USING (
  is_public = true OR auth.uid() = user_id
);
CREATE POLICY "Users can insert own activity" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own DMs" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
  OR (community_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM community_members WHERE community_id = messages.community_id AND user_id = auth.uid()
  ))
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can mark read" ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
