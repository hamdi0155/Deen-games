import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color }: { name: IoniconName; color: string }) {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Ranks',
          tabBarIcon: ({ color }) => <TabIcon name="trophy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
