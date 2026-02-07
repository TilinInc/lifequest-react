'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from 'A/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleOAuth = async (provider: 'google' | 'discord') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">âï¸</div>
          <h1 className="text-2xl font-bold">Welcome Back, Warrior</h1>
          <p className="text-text-secondary mt-1">Continue your quest</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-gold focus:outline-none transition-colors"
              placeholder="warrior@lifequest.app"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-gold focus:outline-none transition-colors"
              placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-accent-gold text-bg-primary font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Entering...' : 'Enter the Arena'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-text-muted text-sm">or continue with</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuth('google')}
            className="py-3 rounded-xl border border-border-subtle hover:bg-bg-hover transition-colors font-medium"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuth('discord')}
            className="py-3 rounded-xl border border-border-subtle hover:bg-bg-hover transition-colors font-medium"
          >
            Discord
          </button>
        </div>

        <p className="text-center text-text-secondary text-sm mt-6">
          New to LifeQuest?{' '}
          <Link href="/auth/signup" className="text-accent-gold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  (æ}
}
