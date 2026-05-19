import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from "react-native";

type Props = {
  item: any;
  onPress: () => void;
};

export default function CardItem({
  item,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={item.image}
        style={styles.image}
      />

      <Text style={styles.text}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },

  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },

  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});