import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface Props {
  completions: { date: string; completedAt: string }[];
  color?: string;
  weeks?: number;
}

const MONTH_ABBREVS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CELL_SIZE = 12;
const CELL_GAP = 3;

export function StreakHeatmap({ completions, color = COLORS.accent, weeks = 12 }: Props) {
  // Build a map of date string → count
  const countByDate = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of completions) {
      map[c.date] = (map[c.date] ?? 0) + 1;
    }
    return map;
  }, [completions]);

  // Generate the last `weeks * 7` days, aligned to week columns (Sun=0 through Sat=6)
  // We'll start from the Monday of the week that was `weeks` ago
  const columns = React.useMemo(() => {
    const today = new Date();
    // Find the Sunday of the current week (start of this week)
    const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat

    // We want the grid to end at today's column.
    // Build `weeks` columns of 7 days each.
    // The last column ends at the coming Saturday (or today if we fill partial)
    // Actually: align so last column contains today.
    // Column index: day 0..6 within the column is Sun..Sat

    // Compute the date of "Sunday of current week"
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - dayOfWeek);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    // Go back `weeks - 1` full weeks from start of current week
    const gridStart = new Date(startOfCurrentWeek);
    gridStart.setDate(startOfCurrentWeek.getDate() - (weeks - 1) * 7);

    const cols: Array<{ key: string; days: Array<{ dateStr: string; count: number; isFuture: boolean }> }> = [];

    const todayStr = today.toISOString().split('T')[0];

    for (let w = 0; w < weeks; w++) {
      const days: Array<{ dateStr: string; count: number; isFuture: boolean }> = [];
      for (let d = 0; d < 7; d++) {
        const cur = new Date(gridStart);
        cur.setDate(gridStart.getDate() + w * 7 + d);
        const dateStr = cur.toISOString().split('T')[0];
        const isFuture = dateStr > todayStr;
        days.push({
          dateStr,
          count: countByDate[dateStr] ?? 0,
          isFuture,
        });
      }
      // month label: show abbreviated month when this column's Sunday starts a new month,
      // or it's the very first column
      const colFirstDate = new Date(gridStart);
      colFirstDate.setDate(gridStart.getDate() + w * 7);
      const colKey = `week-${w}`;

      cols.push({ key: colKey, days });
    }

    return cols;
  }, [weeks, countByDate]);

  // Compute month labels per column (show when month changes)
  const monthLabels = React.useMemo(() => {
    const labels: (string | null)[] = [];
    let prevMonth: number | null = null;
    for (const col of columns) {
      const firstDayDate = new Date(col.days[0].dateStr);
      const month = firstDayDate.getMonth();
      if (prevMonth === null || month !== prevMonth) {
        labels.push(MONTH_ABBREVS[month]);
        prevMonth = month;
      } else {
        labels.push(null);
      }
    }
    return labels;
  }, [columns]);

  function getCellColor(count: number, isFuture: boolean): string {
    if (isFuture) return 'rgba(255,255,255,0.02)';
    if (count === 0) return 'rgba(255,255,255,0.05)';
    if (count === 1) return color + '60';
    if (count === 2) return color + 'AA';
    return color;
  }

  return (
    <View style={styles.container}>
      {/* Month labels row */}
      <View style={styles.monthRow}>
        {columns.map((col, i) => (
          <View key={col.key} style={styles.monthLabelCell}>
            {monthLabels[i] ? (
              <Text style={styles.monthLabel}>{monthLabels[i]}</Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* Grid: row of columns */}
      <View style={styles.grid}>
        {columns.map((col) => (
          <View key={col.key} style={styles.column}>
            {col.days.map((day) => (
              <View
                key={day.dateStr}
                style={[
                  styles.cell,
                  { backgroundColor: getCellColor(day.count, day.isFuture) },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // no outer margin — parent handles padding
  },
  monthRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  monthLabelCell: {
    width: CELL_SIZE,
    marginRight: CELL_GAP,
    height: 12,
    justifyContent: 'flex-end',
  },
  monthLabel: {
    fontSize: 8,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  column: {
    flexDirection: 'column',
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
});
