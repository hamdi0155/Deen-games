import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../src/constants/theme';
import { AscendIcon, AscendIconName } from '../../src/components/icons/AscendIcon';
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
      <AscendIcon name={iconName} size={size} color="rgba(242,238,230,0.30)" strokeWidth={1.8} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(14,11,26,0.97)',
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
        tabBarInactiveTintColor: 'rgba(242,238,230,0.30)',
        tabBarShowLabel: false,
        tabBarItemStyle: { paddingVertical: 0 },
      }}
    >
      {/* TODAY — the home, 90% of usage */}
      <Tabs.Screen
        name="index"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="home"
              focused={focused}
              gradientColors={['#8B7CF6', '#6B5CE7']}
            />
          ),
        }}
      />

      {/* AVATAR — character + rewards */}
      <Tabs.Screen
        name="profile"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Avatar',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="profile"
              focused={focused}
              gradientColors={['#8B7CF6', '#6B5CE7']}
            />
          ),
        }}
      />

      {/* PROGRESS — anti-shame history */}
      <Tabs.Screen
        name="stats"
        listeners={{ tabPress: () => haptic.light() }}
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => (
            <TabPill
              iconName="stats"
              focused={focused}
              gradientColors={['#FFB23E', '#E8941A']}
            />
          ),
        }}
      />

      {/* Hidden from tab bar — accessible via Today screen */}
      <Tabs.Screen name="habits"  options={{ href: null }} />
      <Tabs.Screen name="quests"  options={{ href: null }} />
      <Tabs.Screen name="goals"   options={{ href: null }} />
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
