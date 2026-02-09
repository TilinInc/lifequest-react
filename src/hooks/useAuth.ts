'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface ExtendedUser extends User {
  isGuest?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      // Check for guest mode in localStorage/cookie
      if (typeof window !== 'undefined') {
        const guestCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('lifequest_guest='))
          ?.split('=')[1];

        if (guestCookie === 'true') {
          // Return a mock guest user
          const mockGuestUser: ExtendedUser = {
            id: 'guest',
            aud: 'authenticated',
            user_metadata: {},
            app_metadata: {},
            created_at: new Date().toISOString(),
            isGuest: true,
          };
          setUser(mockGuestUser);
          setIsGuest(true);
          setLoading(false);
          return;
        }
      }

      // Otherwise, fetch real user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ ...user, isGuest: false });
      } else {
        setUser(null);
      }
      setIsGuest(false);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ ...session.user, isGuest: false });
        setIsGuest(false);
      } else {
        setUser(null);
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Check if guest user
    if (isGuest) {
      // Remove guest cookie
      document.cookie = 'lifequest_guest=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setUser(null);
      setIsGuest(false);
      window.location.href = '/';
      return;
    }

    // Otherwise, sign out from Supabase
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return { user, isGuest, loading, signOut };
}
