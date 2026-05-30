import { create } from 'zustand';

interface Notification {
  message: string;
  subtext?: string;
  color: string;
  icon?: string;
}

interface NotificationStore {
  current: Notification | null;
  show: (notification: Notification) => void;
  dismiss: () => void;
}

/**
 * Lightweight global notification banner store.
 * Drives the <NotificationBanner> rendered in the root layout.
 *
 * Usage from anywhere:
 *   useNotificationStore.getState().show({
 *     message: 'Quest Generated!',
 *     subtext: 'Your path has been forged.',
 *     color: '#5B6CF5',
 *     icon: '⚔️',
 *   });
 */
export const useNotificationStore = create<NotificationStore>()((set) => ({
  current: null,

  show: (notification) => {
    set({ current: notification });
  },

  dismiss: () => {
    set({ current: null });
  },
}));
