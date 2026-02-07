'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSocialStore } from '@/store/useSocialStore';
import { useAuth } from './useAuth';

/**
 * Sets up Supabase real-time subscriptions for social features.
 */
export function useRealtimeSubscriptions() {
  const { user } = useAuth();
  const addNotification = useSocialStore(s => s.addNotification);
  const prependActivity = useSocialStore(s => s.prependActivity);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications
    const notifChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          addNotification({
            id: String(payload.new.id),
            userId: payload.new.user_id,
            fromUserId: payload.new.from_user_id,
            notificationType: payload.new.notification_type,
            metadata: payload.new.metadata || {},
            readAt: null,
            createdAt: payload.new.created_at,
          });
        }
      )
      .subscribe();

    // Subscribe to activity feed updates
    const activityChannel = supabase
      .channel('activity_feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_feed' },
        (payload) => {
          if (payload.new.user_id !== user.id) {
            prependActivity({
              id: String(payload.new.id),
              userId: payload.new.user_id,
              activityType: payload.new.activity_type,
              metadata: payload.new.metadata || {},
              isPublic: payload.new.is_public,
              createdAt: payload.new.created_at,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
      supabase.removeChannel(activityChannel);
    };
  }, [user]);
}
