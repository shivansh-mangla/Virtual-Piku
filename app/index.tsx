import { View, FlatList, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import Header from "../components/Header";
import CardItem from "../components/CardItem";
import LoadingSpinner from "../components/LoadingSpinner";
import AnnouncementCard from "../components/AnnouncementCard";

import { cards } from "../constants/cards";
import { announcements } from "../constants/announcements";
import { fetchData } from "../services/api";
import { homeStyles } from "../styles/homeStyles";

function AnnouncementsSection() {
  return (
    <View style={homeStyles.announcementsSection}>
      <Text style={homeStyles.sectionTitle}>Announcements</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.announcementsScroll}
      >
        {announcements.map((item) => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </ScrollView>
      <Text style={homeStyles.sectionTitle}>Quick Access</Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCardPress = async (item: any) => {
    try {
      setLoading(true);

      const data = await fetchData(item.url);
      console.log(data);

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
      <Header title="Virtual Piku" />

      {loading && <LoadingSpinner />}

      <FlatList
        data={cards}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<AnnouncementsSection />}
        renderItem={({ item }) => (
          <CardItem
            item={item}
            onPress={() => handleCardPress(item)}
          />
        )}
        contentContainerStyle={homeStyles.listContent}
      />
    </View>
  );
}
