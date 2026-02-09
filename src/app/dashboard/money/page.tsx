'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { getMoneyLevel, getMoneyTitle, getMoneyProgress, formatMoney } from '@/lib/game-logic/levelSystem';
import ProgressBar from '@/components/Shared/ProgressBar';
import Link from 'next/link';

export default function MoneyPage() {
  const moneyLog = useGameStore(s => s.moneyLog);
  const logNetWorth = useGameStore(s => s.logNetWorth);
  const showToast = useUIStore(s => s.showToast);
  const showLevelUpModal = useUIStore(s => s.showLevelUpModal);

  const [netWorthInput, setNetWorthInput] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentNetWorth = moneyLog.currentNetWorth;
  const currentLevel = getMoneyLevel(currentNetWorth);
  const currentTitle = getMoneyTitle(currentNetWorth);
  const progress = getMoneyProgress(currentNetWorth);

  const handleLogNetWorth = () => {
    const netWorth = parseFloat(netWorthInput);

    if (isNaN(netWorth) || netWorth < 0) {
      showToast('Please enter a valid net worth amount', 'error');
      return;
    }

    setIsSubmitting(true);

    const result = logNetWorth(netWorth, note || undefined);
    showToast('Net Worth logged: ' + formatMoney(netWorth), 'success');

    if (result.leveledUp) {
      showLevelUpModal('money', result.newLevel);
    }

    setNetWorthInput('');
    setNote('');
    setIsSubmitting(false);
  };

  const sortedEntries = [...moneyLog.entries].reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="text-4xl mb-2">$</div>
        <h1 className="text-2xl font-bold">Money</h1>
        <p className="text-text-secondary text-sm">Track your financial growth</p>
      </div>

      {/* Current Status */}
      <div className="glass rounded-xl p-6 border border-border-subtle">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-accent-gold">{formatMoney(currentNetWorth)}</div>
          <div className="text-sm text-text-muted mt-1">Current Net Worth</div>
        </div>

        <div className="text-center mb-4">
          <div className="text-xl font-black" style={{ color: '#22C55E' }}>
            {currentTitle}
          </div>
          <div className="text-xs text-text-muted">Level {currentLevel}</div>
        </div>

        <ProgressBar progress={progress} color="#22C55E" />
      </div>

      {/* Log Net Worth */}
      <div className="glass rounded-xl p-4 border border-border-subtle">
        <div className="mb-3">
          <label className="text-sm font-medium block mb-2">Net Worth Amount</label>
          <input
            type="number"
            value={netWorthInput}
            onChange={(e) => setNetWorthInput(e.target.value)}
            placeholder="Enter amount (e.g., 50000)"
            className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-border-subtle focus:border-accent-gold focus:outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium block mb-2">Optional Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g., Bonus received, After tax refund"
            className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-border-subtle focus:border-accent-gold focus:outline-none"
            disabled={isSubmitting}
          />
        </div>

        <button
          onClick={handleLogNetWorth}
          disabled={isSubmitting || !netWorthInput.trim()}
          className="w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium transition-colors"
        >
          {isSubmitting ? 'Logging...' : 'Log Net Worth'}
        </button>
      </div>

      {/* History */}
      {sortedEntries.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3">History</h2>
          <div className="space-y-2">
            {sortedEntries.map((entry) => {
              const entryDate = new Date(entry.timestamp);
              const dateStr = entryDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-border-subtle"
                >
                  <div>
                    <div className="font-medium">{formatMoney(entry.netWorth)}</div>
                    <div className="text-xs text-text-muted">{dateStr}</div>
                    {entry.note && <div className="text-xs text-text-secondary mt-1">{entry.note}</div>}
                  </div>
                  <div style={{ color: '#22C55E' }} className="text-sm font-bold">
                    Lv.{getMoneyLevel(entry.netWorth)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link href="/dashboard" className="block w-full text-center px-4 py-3 rounded-lg bg-bg-secondary border border-border-subtle hover:border-border-medium transition-all text-text-secondary font-medium">
        Back to Dashboard
      </Link>
    </div>
  );
}
