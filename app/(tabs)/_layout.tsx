import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../src/constants/theme';
import { AscendIcon, AscendIconName } from '../../src/components/icons/AscendIcon';
import { useQuestStore } from '../../src/store/questStore';
import { haptic } from '../../src/services/haptics';

function TabPill({
  iconName,
  focused,
  gradientColors,
  size = 21,
}: {
  iconName: AscendIconName;
  focused: boolean;
  gradientColors: string[];
  size?: number;
}) {
  if (focused) {
    return (
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activePill}
      >
        <AscendIcon name={iconName} size={size} color="#FFFFFF" strokeWidth={1.9} />
      </LinearGradient>
    );
  }
  return (
    <View style={styles.inactivePill}>
      <AscendIcon name={iconName} size={size} color="rgba(144,149,168,0.55)" strokeWidth={1.8} />
    </View>
  );
}

export default function TabsLayout() {
  const activeQuestCount = useQuestStore((s) => s.getActiveQuests().length);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(6,6,14,0.97)',
          borderTopWidth: 0,
          borderRadius: 26,
          marginHorizontal: 20,
          marginBottom: 22,
          height: 60,
          paddingBottom: 0,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.90,
          shadowRadius: 40,
          elevation: 28,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.07)',
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: 'rgba(144,149,168,0.50)',
        tabBarShowLabel: false,
        tabBarItemStyle: { paddingVertical: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="home"
              focused={focused}
              gradientColors={['#6366F1', '#4F46E5']}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quests"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Goals',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="goals"
              focused={focused}
              gradientColors={['#3B82F6', '#2563EB']}
            />
          ),
          tabBarBadge: activeQuestCount > 0 ? activeQuestCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.accent,
            fontFamily: 'Sora_700Bold',
            fontSize: 10,
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
        }}
      />
      <Tabs.Screen
        name="habits"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Habits',
          tabBarActiveTintColor: '#F97316',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="habits"
              focused={focused}
              gradientColors={['#F97316', '#EA580C']}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Progress',
          tabBarActiveTintColor: '#F59E0B',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="stats"
              focused={focused}
              gradientColors={['#F59E0B', '#D97706']}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="profile"
              focused={focused}
              gradientColors={['#6366F1', '#4F46E5']}
            />
          ),
        }}
      />
      {/* goals tab hidden from tab bar — accessible via header button in quests screen */}
      <Tabs.Screen
        name="goals"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activePill: {
    width: 44,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactivePill: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
