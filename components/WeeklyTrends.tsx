import { View, Text, StyleSheet } from "react-native";
import { LOCATION_COLORS } from "../constants/locationColors";
import type { Analytics } from "../types/location";

export default function WeeklyTrends({ analytics }: { analytics: Analytics }) {
  const places = Object.entries(analytics);

  return (
    <View>
      <Text style={styles.heading}>Weekly Trends</Text>
      {places.map(([place, entries], placeIdx) => {
        const maxTime = Math.max(...entries.map((e) => e.time));
        const color = LOCATION_COLORS[placeIdx % LOCATION_COLORS.length];

        return (
          <View key={place} style={styles.placeSection}>
            <View style={styles.placeHeader}>
              <View style={[styles.placeChip, { backgroundColor: color }]} />
              <Text style={styles.placeName}>{place}</Text>
            </View>

            {entries.map((entry, i) => {
              const barPct = maxTime > 0 ? entry.time / maxTime : 0;
              return (
                <View key={i} style={styles.barRow}>
                  <Text style={styles.dateLabel}>{entry.date}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${(barPct * 100).toFixed(1)}%` as any, backgroundColor: color },
                      ]}
                    />
                  </View>
                  <Text style={styles.timeLabel}>{entry.time.toFixed(1)}h</Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B2A4A",
    marginBottom: 16,
  },
  placeSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  placeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  placeChip: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  placeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    textTransform: "capitalize",
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateLabel: {
    width: 76,
    fontSize: 12,
    color: "#666",
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "#F0F4F8",
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  timeLabel: {
    width: 34,
    fontSize: 12,
    fontWeight: "600",
    color: "#1B2A4A",
    textAlign: "right",
  },
});
