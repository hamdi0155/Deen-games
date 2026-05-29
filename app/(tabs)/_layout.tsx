import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { COLORS } from '../../src/constants/theme';

function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color?: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 22 : 19, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
      {focused && (
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: color ?? COLORS.accent,
            marginTop: 3,
          }}
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
          backgroundColor: 'rgba(8,8,14,0.92)',
          borderTopWidth: 0,
          borderRadius: 28,
          marginHorizontal: 16,
          marginBottom: 20,
          height: 64,
          paddingBottom: 0,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.7,
          shadowRadius: 24,
          elevation: 20,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.07)',
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
        tabBarItemStyle: { paddingTop: 8 },
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
    </Tabs>
  );
}
