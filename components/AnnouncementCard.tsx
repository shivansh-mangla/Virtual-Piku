import { View, Text, StyleSheet } from "react-native";
import { Announcement } from "../constants/announcements";

type Props = { item: Announcement };

const typeConfig = {
  info:    { bg: "#EBF5FB", accent: "#2E86C1", label: "Info" },
  warning: { bg: "#FEF9E7", accent: "#D4AC0D", label: "Notice" },
  success: { bg: "#EAFAF1", accent: "#1E8449", label: "Update" },
};

export default function AnnouncementCard({ item }: Props) {
  const config = typeConfig[item.type];

  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderLeftColor: config.accent }]}>
      <View style={[styles.badge, { backgroundColor: config.accent }]}>
        <Text style={styles.badgeText}>{config.label}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginRight: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1A1A2E",
  },
  message: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    fontSize: 11,
    color: "#999",
  },
});
