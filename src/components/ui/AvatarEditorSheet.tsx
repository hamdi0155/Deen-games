import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../icons/AscendIcon';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { MemojiConfig, parseMemojiConfig } from './CustomAvatar';
import { MemojiBuilder } from './MemojiBuilder';

interface Props {
  visible: boolean;
  avatarId: string;
  onClose: () => void;
  onSave: (jsonConfig: string) => void;
}

export function AvatarEditorSheet({ visible, avatarId, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<MemojiConfig>(() => parseMemojiConfig(avatarId));

  const slideY = useSharedValue(600);
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  React.useEffect(() => {
    if (visible) {
      setDraft(parseMemojiConfig(avatarId));
      slideY.value = withSpring(0, { damping: 22, stiffness: 160 });
    } else {
      slideY.value = withTiming(600, { duration: 260 });
    }
  }, [visible]);

  const handleClose = () => {
    slideY.value = withTiming(600, { duration: 260 });
    setTimeout(onClose, 270);
  };

  const handleSave = () => {
    onSave(JSON.stringify(draft));
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Customise Avatar</Text>
            <Text style={styles.subtitle}>Design your Memoji character</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={8}>
            <AscendIcon name="close" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Builder */}
        <MemojiBuilder config={draft} onChange={setDraft} previewSize={140} />

        {/* Save button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={styles.saveBtn}>
            <LinearGradient
              colors={['#C9A84C', '#A87830']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveBtnGrad}
            >
              <Text style={styles.saveBtnText}>Save Avatar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgModal,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -8 },
    elevation: 30,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  closeBtn: { padding: SPACING.xs },
  divider: {
    height: 1,
    backgroundColor: COLORS.bgCardBorder,
    marginHorizontal: SPACING.lg,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: COLORS.bgCardBorder,
  },
  saveBtn: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  saveBtnGrad: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: FONTS.families.displayBold,
    color: '#0A0A0A',
    letterSpacing: 0.3,
  },
});
