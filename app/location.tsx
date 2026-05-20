import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchData } from "../services/api";
import { LOCATION_COLORS } from "../constants/locationColors";
import { styles } from "../styles/locationStyles";
import PieChart from "../components/PieChart";
import WeeklyTrends from "../components/WeeklyTrends";
import type { LocationData, Analytics } from "../types/location";

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

  const parsed = params.data ? JSON.parse(params.data) : {};
  const DATE_DATA: { date: string; link: string }[] = parsed.data ?? [];
  const analytics: Analytics | null = parsed.analytics ?? null;

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
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
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
            </ScrollView>
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

      {data == null && !loading && analytics != null && (
        <WeeklyTrends analytics={analytics} />
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
              <View style={[styles.placeChip, { backgroundColor: LOCATION_COLORS[i % LOCATION_COLORS.length] }]} />
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
