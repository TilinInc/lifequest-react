// ============================================
// LIFEQUEST — UI State Store (Zustand)
// ============================================

import { create } from 'zustand';
import { TabId, Toast, ToastType, SkillId } from '@/lib/types';

interface UIStore {
  // Navigation
  currentTab: TabId;
  setCurrentTab: (tab: TabId) => void;

  // Skills
  selectedSkill: SkillId | null;
  setSelectedSkill: (skillId: SkillId | null) => void;

  // Modals
  showLogSheet: boolean;
  showLevelUp: { skillId: string; newLevel: number } | null;
  showAriseModal: boolean;
  profileSection: 'main' | 'pictures' | 'weight' | 'badges';

  openLogSheet: () => void;
  closeLogSheet: () => void;
  showLevelUpModal: (skillId: string, newLevel: number) => void;
  closeLevelUp: () => void;
  setAriseModal: (show: boolean) => void;
  setProfileSection: (section: 'main' | 'pictures' | 'weight' | 'badges') => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;

  // Online status
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;

  // Edit mode (todos)
  editMode: boolean;
  toggleEditMode: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  currentTab: 'dashboard',
  setCurrentTab: (tab) => set({ currentTab: tab, selectedSkill: null }),

  selectedSkill: null,
  setSelectedSkill: (skillId) => set({ selectedSkill: skillId }),

  showLogSheet: false,
  showLevelUp: null,
  showAriseModal: false,
  profileSection: 'main',

  openLogSheet: () => set({ showLogSheet: true }),
  closeLogSheet: () => set({ showLogSheet: false }),
  showLevelUpModal: (skillId, newLevel) => set({ showLevelUp: { skillId, newLevel } }),
  closeLevelUp: () => set({ showLevelUp: null }),
  setAriseModal: (show) => set({ showAriseModal: show }),
  setProfileSection: (section) => set({ profileSection: section }),

  toasts: [],
  showToast: (message, type = 'system') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const toast: Toast = { id, message, type, timestamp: Date.now() };
    set(s => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 2500);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  isOffline: false,
  setIsOffline: (offline) => set({ isOffline: offline }),

  editMode: false,
  toggleEditMode: () => set(s => ({ editMode: !s.editMode })),
}));
