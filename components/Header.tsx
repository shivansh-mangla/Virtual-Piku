import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1B2A4A",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: "#94B4D0",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
