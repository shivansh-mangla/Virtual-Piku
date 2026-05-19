import {
  View,
  FlatList,
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import Header from "../components/Header";
import CardItem from "../components/CardItem";
import LoadingSpinner from "../components/LoadingSpinner";

import { cards } from "../constants/cards";
import { fetchData } from "../services/api";
import { homeStyles } from "../styles/homeStyles";

export default function HomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleCardPress = async (item: any) => {
    try {
      setLoading(true);

      const data = await fetchData(item.url);

      router.push({
        pathname: item.route,
        params: {
          data: JSON.stringify(data),
          title: item.title,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={homeStyles.container}>
      <Header title="Welcome to Virtual Piku" />

      {loading && <LoadingSpinner />}

      <FlatList
        data={cards}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem
            item={item}
            onPress={() => handleCardPress(item)}
          />
        )}
      />
    </View>
  );
}