import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../src/constants/theme';

function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color?: string }) {
  const activeColor = color ?? COLORS.accent;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      <Text style={{ fontSize: focused ? 22 : 19, opacity: focused ? 1 : 0.4 }}>{icon}</Text>
      {focused && (
        <LinearGradient
          colors={[activeColor, activeColor + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 20, height: 2, borderRadius: 1 }}
        />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(6,6,12,0.94)',
          borderTopWidth: 0,
          borderRadius: 28,
          marginHorizontal: 16,
          marginBottom: 20,
          height: 64,
          paddingBottom: 0,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.8,
          shadowRadius: 28,
          elevation: 24,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.07)',
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: FONTS.families.displayLight,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
        tabBarItemStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ focused }) => <TabIcon icon="⚔️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'New Quest',
          tabBarIcon: ({ focused }) => <TabIcon icon="✨" focused={focused} color="#A78BFA" />,
          tabBarActiveTintColor: '#A78BFA',
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ focused }) => <TabIcon icon="🔥" focused={focused} color="#F97316" />,
          tabBarActiveTintColor: '#F97316',
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Codex',
          tabBarIcon: ({ focused }) => <TabIcon icon="📖" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
