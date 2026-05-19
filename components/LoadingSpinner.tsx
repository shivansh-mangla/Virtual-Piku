import { ActivityIndicator, View } from "react-native";

export default function LoadingSpinner() {
  return (
    <View style={{ marginVertical: 20 }}>
      <ActivityIndicator size="large" />
    </View>
  );
}