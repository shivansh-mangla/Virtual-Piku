import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

export default function DetailsScreen() {
  const params = useLocalSearchParams();

  const data = JSON.parse(params.data);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {params.title}
      </Text>

      <Text style={styles.json}>
        {JSON.stringify(data, null, 2)}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  json: {
    fontSize: 16,
    lineHeight: 24,
  },
});