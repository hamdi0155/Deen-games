import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../src/constants/theme';
import { useQuestStore } from '../../src/store/questStore';
import { haptic } from '../../src/services/haptics';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabPill({
  iconName,
  focused,
  gradientColors,
  size = 20,
}: {
  iconName: IoniconName;
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
        <Ionicons name={iconName} size={size} color="#FFFFFF" />
      </LinearGradient>
    );
  }
  return (
    <View style={styles.inactivePill}>
      <Ionicons name={iconName} size={size} color="rgba(144,149,168,0.50)" />
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
          backgroundColor: 'rgba(6,6,12,0.96)',
          borderTopWidth: 0,
          borderRadius: 28,
          marginHorizontal: 16,
          marginBottom: 20,
          height: 68,
          paddingBottom: 0,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.85,
          shadowRadius: 32,
          elevation: 24,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: 'rgba(144,149,168,0.50)',
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: FONTS.families.displayLight,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: 1,
        },
        tabBarItemStyle: { paddingTop: 8, paddingBottom: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName={focused ? 'home' : 'home-outline'}
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
          title: 'Quests',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName={focused ? 'shield' : 'shield-outline'}
              focused={focused}
              gradientColors={['#3B82F6', '#2563EB']}
            />
          ),
          tabBarBadge: activeQuestCount > 0 ? activeQuestCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.accent,
            fontSize: 9,
            minWidth: 16,
            height: 16,
            lineHeight: 16,
          },
        }}
      />
      <Tabs.Screen
        name="goals"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'New Quest',
          tabBarActiveTintColor: '#A78BFA',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName={focused ? 'sparkles' : 'sparkles-outline'}
              focused={focused}
              gradientColors={['#A78BFA', '#7C3AED']}
            />
          ),
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
              iconName={focused ? 'pulse' : 'pulse-outline'}
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
          title: 'Stats',
          tabBarActiveTintColor: '#F59E0B',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName={focused ? 'trophy' : 'trophy-outline'}
              focused={focused}
              gradientColors={['#F59E0B', '#D97706']}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Codex',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName={focused ? 'person' : 'person-outline'}
              focused={focused}
              gradientColors={['#6366F1', '#4F46E5']}
            />
          ),
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
