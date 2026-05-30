import { Platform } from 'react-native';

// Graceful fallback for web/unsupported platforms
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch (_) {}

export const haptic = {
  // Light — for tab switches, toggles, navigation
  light: () => {
    if (Platform.OS === 'web' || !Haptics) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  // Medium — for completing a task, checking off a habit
  medium: () => {
    if (Platform.OS === 'web' || !Haptics) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
  // Heavy — for level up, quest completion
  heavy: () => {
    if (Platform.OS === 'web' || !Haptics) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  },
  // Success — for achieving milestones
  success: () => {
    if (Platform.OS === 'web' || !Haptics) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  // Warning — for errors, destructive actions
  warning: () => {
    if (Platform.OS === 'web' || !Haptics) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
  // Error — for failed actions
  error: () => {
    if (Platform.OS === 'web' || !Haptics) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  },
  // Selection — for picker/dropdown changes
  select: () => {
    if (Platform.OS === 'web' || !Haptics) return;
    Haptics.selectionAsync().catch(() => {});
  },
};
