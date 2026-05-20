import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { LOCATION_COLORS } from "../constants/locationColors";

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

export default function PieChart({ data }: { data: Record<string, number> }) {
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
      color: LOCATION_COLORS[i % LOCATION_COLORS.length],
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

const styles = StyleSheet.create({
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
