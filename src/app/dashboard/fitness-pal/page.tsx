'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { getLevel, getTotalLevel, getTitle } from '@/lib/game-logic/levelSystem';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';

// ── Types ──────────────────────────────────────────────────────
interface RivalSkill {
  name: string;
  xp: number;
}

interface Rival {
  id: string;
  name: string;
  avatar: string;
  skills: RivalSkill[];
  matchedAt: string;
  lastActive: string;
}

interface ChatMessage {
  id: string;
  sender: 'you' | 'rival';
  text: string;
  timestamp: string;
}

interface Notification {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
}

// ── Rival Name Generator ──────────────────────────────────────
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage',
  'Phoenix', 'Kai', 'Dakota', 'Reese', 'Cameron', 'Hayden', 'Skyler',
  'Blake', 'Drew', 'Emery', 'Finley', 'Harper', 'Jamie', 'Kendall',
];
const AVATARS = ['🥊', '🏋️', '🧗', '🏃', '🚴', '💪', '🤸', '🏊', '⚡', '🔥', '🎯', '🦾'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateRival(userTotalLevel: number): Rival {
  const seed = Date.now();
  const rng = seededRandom(seed);
  const name = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
  const avatar = AVATARS[Math.floor(rng() * AVATARS.length)];

  // Generate rival skills at a similar level to the user (±20%)
  const skillNames = SKILL_DEFS.map(s => s.name);
  const baseXpPerSkill = Math.max(50, (userTotalLevel * 85) / 7);
  const skills: RivalSkill[] = skillNames.map(sName => ({
    name: sName,
    xp: Math.floor(baseXpPerSkill * (0.6 + rng() * 0.8)),
  }));

  return {
    id: seed.toString(36),
    name,
    avatar,
    skills,
    matchedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
}

// Simulate rival progress each day
function simulateRivalProgress(rival: Rival): Rival {
  const now = new Date();
  const lastActive = new Date(rival.lastActive);
  const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 1) return rival;

  const rng = seededRandom(parseInt(rival.id, 36) + now.getDate());
  const updatedSkills = rival.skills.map(skill => {
    const dailyXp = Math.floor(rng() * 40 + 10) * daysDiff;
    return { ...skill, xp: skill.xp + dailyXp };
  });

  return {
    ...rival,
    skills: updatedSkills,
    lastActive: now.toISOString(),
  };
}

// Rival auto-reply messages
const RIVAL_REPLIES = [
  "Let's go! I'm not slowing down 💪",
  "You better keep up with me!",
  "Just finished my workout. Your turn!",
  "I see you leveling up... respect 🔥",
  "No days off! Are you keeping up?",
  "Challenge accepted! Let's see who hits the next level first.",
  "GG on that streak! I'm coming for you though.",
  "Early morning grind pays off ⚡",
  "Don't get too comfortable at the top 😤",
  "Nice progress! But I'm not done yet.",
];


// ── Main Component ────────────────────────────────────────────
export default function FitnessPalPage() {
  const skills = useGameStore(s => s.skills);
  const totalLevel = getTotalLevel(skills);
  const userTitle = getTitle(totalLevel);

  const [rival, setRival] = useState<Rival | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'progress' | 'chat' | 'notifications'>('progress');
  const [isMatching, setIsMatching] = useState(false);
  const [showUnmatchConfirm, setShowUnmatchConfirm] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lifequest_fitness_pal');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.rival) {
          const updated = simulateRivalProgress(data.rival);
          setRival(updated);
          // Check if rival leveled up
          if (data.rival) {
            const oldTotal = data.rival.skills.reduce((sum: number, s: RivalSkill) => sum + getLevel(s.xp), 0);
            const newTotal = updated.skills.reduce((sum: number, s: RivalSkill) => sum + getLevel(s.xp), 0);
            if (newTotal > oldTotal) {
              const note: Notification = {
                id: Date.now().toString(),
                text: `${updated.name} leveled up! They're now Total Level ${newTotal} ${updated.avatar}`,
                timestamp: new Date().toISOString(),
                read: false,
              };
              setNotifications(prev => [note, ...(data.notifications || [])]);
            } else {
              setNotifications(data.notifications || []);
            }
          }
        }
        if (data.messages) setMessages(data.messages);
        if (data.notifications && !data.rival?.skills) setNotifications(data.notifications);
      }
    } catch {}
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (rival || messages.length > 0) {
      localStorage.setItem('lifequest_fitness_pal', JSON.stringify({
        rival,
        messages,
        notifications,
      }));
    }
  }, [rival, messages, notifications]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFindRival = useCallback(() => {
    setIsMatching(true);
    // Simulate a matching delay
    setTimeout(() => {
      const newRival = generateRival(totalLevel);
      setRival(newRival);
      setIsMatching(false);
      setMessages([{
        id: '1',
        sender: 'rival',
        text: `Hey! I'm ${newRival.name}. Ready to push each other to the next level? Let's go! ${newRival.avatar}`,
        timestamp: new Date().toISOString(),
      }]);
      setNotifications([{
        id: '1',
        text: `You've been matched with ${newRival.name}! Start your rivalry!`,
        timestamp: new Date().toISOString(),
        read: false,
      }]);
    }, 2000);
  }, [totalLevel]);

  const handleUnmatch = () => {
    setRival(null);
    setMessages([]);
    setNotifications([]);
    setShowUnmatchConfirm(false);
    localStorage.removeItem('lifequest_fitness_pal');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !rival) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'you',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Simulate rival reply after 1-3 seconds
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'rival',
        text: RIVAL_REPLIES[Math.floor(Math.random() * RIVAL_REPLIES.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, reply]);
    }, delay);
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ── Rival Stats ──
  const rivalTotalLevel = rival ? rival.skills.reduce((sum, s) => sum + getLevel(s.xp), 0) : 0;
  const rivalTitle = rival ? getTitle(rivalTotalLevel) : '';


  // ── No Rival Yet ──
  if (!rival) {
    return (
      <div className="min-h-screen bg-bg-primary pb-24 px-4 pt-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Fitness Pal</h1>
          <p className="text-text-muted mb-8">Get matched with a rival to push each other further.</p>

          <div className="bg-bg-secondary rounded-2xl border border-border-subtle p-8 text-center">
            <div className="text-6xl mb-4">🥊</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Find Your Rival</h2>
            <p className="text-text-muted text-sm mb-6">
              Get automatically paired with someone at your level. Compete, motivate, and chat with your fitness pal.
            </p>
            <button
              onClick={handleFindRival}
              disabled={isMatching}
              className="w-full py-3 rounded-xl font-bold text-base transition-all bg-accent-gold text-bg-primary hover:brightness-110 disabled:opacity-50"
            >
              {isMatching ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚡</span> Searching for rival...
                </span>
              ) : (
                '💪 Find My Rival'
              )}
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-bg-secondary rounded-xl border border-border-subtle p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Track Progress</p>
                  <p className="text-xs text-text-muted">See how your skills compare side by side</p>
                </div>
              </div>
            </div>
            <div className="bg-bg-secondary rounded-xl border border-border-subtle p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Get Notifications</p>
                  <p className="text-xs text-text-muted">Know when your rival levels up — stay motivated</p>
                </div>
              </div>
            </div>
            <div className="bg-bg-secondary rounded-xl border border-border-subtle p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Chat & Compete</p>
                  <p className="text-xs text-text-muted">Talk trash or hype each other up</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Matched State ──
  return (
    <div className="min-h-screen bg-bg-primary pb-24 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-primary">Fitness Pal</h1>
          <button
            onClick={() => setShowUnmatchConfirm(true)}
            className="text-xs text-text-muted hover:text-accent-red transition-colors"
          >
            Unmatch
          </button>
        </div>

        {/* Unmatch confirmation */}
        {showUnmatchConfirm && (
          <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-text-primary mb-3">End your rivalry with {rival.name}? This can't be undone.</p>
            <div className="flex gap-2">
              <button onClick={handleUnmatch} className="flex-1 py-2 rounded-lg bg-accent-red text-white text-sm font-semibold">
                Yes, Unmatch
              </button>
              <button onClick={() => setShowUnmatchConfirm(false)} className="flex-1 py-2 rounded-lg bg-bg-tertiary text-text-primary text-sm font-semibold">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* VS Card */}
        <div className="bg-bg-secondary rounded-2xl border border-border-subtle p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-3xl mb-1">🧑</div>
              <p className="text-sm font-bold text-text-primary">You</p>
              <p className="text-xs text-accent-gold font-semibold">Lv {totalLevel}</p>
              <p className="text-[10px] text-text-muted">{userTitle}</p>
            </div>
            <div className="text-2xl font-black text-accent-gold px-4">VS</div>
            <div className="text-center flex-1">
              <div className="text-3xl mb-1">{rival.avatar}</div>
              <p className="text-sm font-bold text-text-primary">{rival.name}</p>
              <p className="text-xs text-accent-gold font-semibold">Lv {rivalTotalLevel}</p>
              <p className="text-[10px] text-text-muted">{rivalTitle}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Matched {new Date(rival.matchedAt).toLocaleDateString()}</span>
              <span className={totalLevel >= rivalTotalLevel ? 'text-green-400' : 'text-accent-red'}>
                {totalLevel >= rivalTotalLevel ? '🟢 You\'re ahead!' : '🔴 Rival leads!'}
              </span>
            </div>
          </div>
        </div>


        {/* Tab Bar */}
        <div className="flex bg-bg-secondary rounded-xl border border-border-subtle p-1 mb-4">
          {(['progress', 'chat', 'notifications'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab === 'notifications') markAllRead(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === tab
                  ? 'bg-accent-gold/20 text-accent-gold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab === 'progress' && '📊 '}
              {tab === 'chat' && '💬 '}
              {tab === 'notifications' && '🔔 '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'notifications' && unreadNotifs > 0 && (
                <span className="absolute -top-1 right-1 bg-accent-red text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Progress Tab ── */}
        {activeTab === 'progress' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Skill Comparison</h3>
            {skills.map((skill, i) => {
              const yourLv = getLevel(skill.xp);
              const skillDef = SKILL_DEFS.find(sd => sd.id === skill.id);
              const skillName = skillDef?.name || skill.id;
              const rivalSkill = rival.skills.find(rs => rs.name === skillName);
              const rivalLv = rivalSkill ? getLevel(rivalSkill.xp) : 0;
              const maxLv = Math.max(yourLv, rivalLv, 1);
              const you_pct = (yourLv / maxLv) * 100;
              const rival_pct = (rivalLv / maxLv) * 100;
              const winning = yourLv >= rivalLv;

              return (
                <div key={skill.id} className="bg-bg-secondary rounded-xl border border-border-subtle p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-text-primary">{skillName}</span>
                    <span className={`text-xs font-bold ${winning ? 'text-green-400' : 'text-accent-red'}`}>
                      {winning ? '+' : ''}{yourLv - rivalLv}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted w-8">You</span>
                      <div className="flex-1 bg-bg-primary rounded-full h-2.5 overflow-hidden">
                        <div className="h-full bg-accent-gold rounded-full transition-all" style={{ width: `${you_pct}%` }} />
                      </div>
                      <span className="text-xs text-accent-gold font-semibold w-8 text-right">Lv {yourLv}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted w-8">{rival.name.slice(0, 4)}</span>
                      <div className="flex-1 bg-bg-primary rounded-full h-2.5 overflow-hidden">
                        <div className="h-full bg-accent-red/70 rounded-full transition-all" style={{ width: `${rival_pct}%` }} />
                      </div>
                      <span className="text-xs text-accent-red font-semibold w-8 text-right">Lv {rivalLv}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* ── Chat Tab ── */}
        {activeTab === 'chat' && (
          <div className="flex flex-col" style={{ height: 'calc(100vh - 340px)' }}>
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
              {messages.length === 0 && (
                <div className="text-center py-8 text-text-muted text-sm">
                  No messages yet. Say hi to your rival!
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'you'
                      ? 'bg-accent-gold/20 text-text-primary rounded-br-md'
                      : 'bg-bg-secondary border border-border-subtle text-text-primary rounded-bl-md'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-[10px] text-text-muted mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder={`Message ${rival.name}...`}
                className="flex-1 bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-3 rounded-xl bg-accent-gold text-bg-primary font-semibold text-sm hover:brightness-110 disabled:opacity-50 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications Tab ── */}
        {activeTab === 'notifications' && (
          <div className="space-y-2">
            {notifications.length === 0 && (
              <div className="text-center py-8 text-text-muted text-sm">
                No notifications yet. When your rival levels up, you'll see it here!
              </div>
            )}
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`bg-bg-secondary rounded-xl border p-4 ${
                  notif.read ? 'border-border-subtle' : 'border-accent-gold/40 bg-accent-gold/5'
                }`}
              >
                <p className="text-sm text-text-primary">{notif.text}</p>
                <p className="text-[10px] text-text-muted mt-1">
                  {new Date(notif.timestamp).toLocaleDateString()} at{' '}
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
