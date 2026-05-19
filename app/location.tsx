import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";
import { fetchData } from "../services/api";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F4A261", "#96CEB4", "#C77DFF", "#FFB347"];

type LocationData = {
  total_distance_km: number;
  time_by_place_hours: Record<string, number>;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)} Z`;
}

function PieChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const cx = 110;
  const cy = 110;
  const r = 95;

  let cumDeg = 0;
  const slices = Object.entries(data).map(([label, value], i) => {
    const sweep = (value / total) * 360;
    const path = slicePath(cx, cy, r, cumDeg, cumDeg + sweep);
    cumDeg += sweep;
    return {
      path,
      color: COLORS[i % COLORS.length],
      label,
      value,
      pct: ((value / total) * 100).toFixed(1),
    };
  });

  return (
    <View style={styles.chartWrapper}>
      <Svg width={220} height={220} viewBox="0 0 220 220">
        {slices.map((s, i) => (
          <Path key={i} d={s.path} fill={s.color} stroke="#F0F4F8" strokeWidth={2} />
        ))}
      </Svg>
      <View style={styles.legendList}>
        {slices.map((s, i) => (
          <View key={i} style={styles.legendRow}>
            <View style={[styles.legendSwatch, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>{s.label}</Text>
            <Text style={styles.legendPct}>{s.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}



export default function LocationScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params = useLocalSearchParams<{
    data?: string;
    title?: string;
  }>();

  // Parse JSON data
  const DATE_DATA: { date: string; link: string }[] = params.data
    ? JSON.parse(params.data).data ?? []
    : [];



  const selected = DATE_DATA[selectedIndex];

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const json: LocationData = await fetchData(selected.link);
      setData(json);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Location Report</Text>

      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(true)}>
        <Text style={styles.dropdownText}>{selected.date}</Text>
        <Text style={styles.dropdownArrow}>▾</Text>
      </TouchableOpacity>

      <Modal visible={dropdownOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setDropdownOpen(false)} activeOpacity={1}>
          <View style={styles.menu}>
            {DATE_DATA.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.option, i === selectedIndex && styles.optionSelected]}
                onPress={() => {
                  setSelectedIndex(i);
                  setDropdownOpen(false);
                  setData(null);
                  setError(null);
                }}
              >
                <Text style={[styles.optionText, i === selectedIndex && styles.optionTextSelected]}>
                  {item.date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={fetchReport}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Fetching..." : "Fetch Report"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#1B2A4A" style={{ marginVertical: 20 }} />}

      {error != null && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {data != null && (
        <View>
          <View style={styles.distanceCard}>
            <Text style={styles.distanceLabel}>Total Distance</Text>
            <Text style={styles.distanceValue}>{data.total_distance_km.toFixed(2)}</Text>
            <Text style={styles.distanceUnit}>km</Text>
          </View>

          <Text style={styles.sectionTitle}>Time by Place</Text>
          {Object.entries(data.time_by_place_hours).map(([place, hours], i) => (
            <View key={i} style={styles.placeRow}>
              <View style={[styles.placeChip, { backgroundColor: COLORS[i % COLORS.length] }]} />
              <Text style={styles.placeName}>{place}</Text>
              <Text style={styles.placeHours}>{hours.toFixed(2)} h</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Time Distribution</Text>
          <PieChart data={data.time_by_place_hours} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B2A4A",
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 15,
    color: "#1A1A2E",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 16,
    color: "#888",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  option: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  optionSelected: {
    backgroundColor: "#EBF5FB",
  },
  optionText: {
    fontSize: 15,
    color: "#1A1A2E",
  },
  optionTextSelected: {
    fontWeight: "700",
    color: "#2E86C1",
  },
  button: {
    backgroundColor: "#1B2A4A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#FDEDEC",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: "#C0392B",
    fontSize: 14,
  },
  distanceCard: {
    backgroundColor: "#1B2A4A",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  distanceLabel: {
    color: "#94B4D0",
    fontSize: 13,
    marginBottom: 6,
  },
  distanceValue: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 52,
  },
  distanceUnit: {
    color: "#94B4D0",
    fontSize: 16,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 12,
    marginTop: 4,
  },
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  placeChip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  placeName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  placeHours: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B2A4A",
  },
  chartWrapper: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  legendList: {
    width: "100%",
    marginTop: 16,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: "#444",
  },
  legendPct: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B2A4A",
  },
});
