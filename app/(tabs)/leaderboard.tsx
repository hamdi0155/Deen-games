import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { LeaderboardEntry } from '@/types';

const RANK_COLORS = ['#d4a843', '#94a3b8', '#a8832f'];

export default function LeaderboardScreen() {
  const { profile } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_xp, level')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (data) {
        setEntries(
          data.map((d, i) => ({
            rank: i + 1,
            userId: d.id,
            username: d.username,
            avatarUrl: d.avatar_url,
            totalXp: d.total_xp,
            level: d.level,
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-text">Leaderboard</Text>
        <Text className="text-muted">Top learners this week</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#d4a843" className="mt-10" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-8 pt-2">
          {entries.map((entry) => {
            const isMe = entry.userId === profile?.id;
            return (
              <View
                key={entry.userId}
                className={`flex-row items-center gap-4 py-3.5 px-4 rounded-2xl mb-2 border ${
                  isMe ? 'bg-gold/10 border-gold/30' : 'bg-card border-border'
                }`}
              >
                <Text
                  className="w-6 text-center font-bold text-base"
                  style={{ color: RANK_COLORS[entry.rank - 1] ?? '#6b7280' }}
                >
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                </Text>

                <View className="w-9 h-9 rounded-full bg-surface items-center justify-center">
                  <Text className="text-base">
                    {entry.username.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className={`font-semibold ${isMe ? 'text-gold' : 'text-text'}`}>
                    {entry.username} {isMe && '(you)'}
                  </Text>
                  <Text className="text-muted text-xs">Level {entry.level}</Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <Ionicons name="star" size={14} color="#d4a843" />
                  <Text className="text-gold font-bold">{entry.totalXp.toLocaleString()}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
