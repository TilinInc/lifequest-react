'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-bg-primary">
      {/* Hero */}
      <div className="text-center max-w-2xl animate-fade-in">
        <div className="text-6xl mb-4">⚔️</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="text-gradient">LifeQuest</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl mb-8">
          Turn your daily habits into an RPG adventure. Build skills, complete quests, and level up your real life.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-8 py-3 rounded-xl bg-accent-gold text-bg-primary font-bold text-lg hover:brightness-110 transition-all glow-gold"
          >
            Start Your Quest
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 rounded-xl border border-border-medium text-text-primary font-medium text-lg hover:bg-bg-hover transition-all"
          >
            Continue Journey
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mt-16 animate-slide-up">
        <FeatureCard icon="💪" title="7 Life Skills" desc="Strength, Endurance, Discipline, Intellect, Social, Mind, Durability" />
        <FeatureCard icon="🏆" title="65+ Achievements" desc="Unlock achievements as you progress through your journey" />
        <FeatureCard icon="👥" title="Social Platform" desc="Friends, communities, leaderboards, and challenges" />
      </div>

      {/* Stats */}
      <div className="flex gap-8 mt-12 text-center text-text-secondary text-sm">
        <div><span className="text-accent-gold font-bold text-xl block">99</span>Max Level per Skill</div>
        <div><span className="text-accent-gold font-bold text-xl block">693</span>Total Level Cap</div>
        <div><span className="text-accent-gold font-bold text-xl block">∞</span>Quests & Challenges</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="glass rounded-xl p-6 border border-border-subtle">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-text-secondary text-sm">{desc}</p>
    </div>
  );
}
