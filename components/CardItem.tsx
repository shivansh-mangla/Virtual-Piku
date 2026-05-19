import {
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet,
} from "react-native";

type Props = {
  item: any;
  onPress: () => void;
};

export default function CardItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + "22" }]}>
        <Image source={item.image} style={styles.image} />
      </View>
      <Text style={styles.text}>{item.title}</Text>
      <View style={[styles.dot, { backgroundColor: item.color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  image: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
