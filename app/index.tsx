import { View, FlatList, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import CardItem from "../components/CardItem";
import LoadingSpinner from "../components/LoadingSpinner";
import AnnouncementCard from "../components/AnnouncementCard";

import { cards } from "../constants/cards";
import { Announcement } from "../constants/announcements";
import { fetchData } from "../services/api";
import { homeStyles } from "../styles/homeStyles";

function AnnouncementsSection({ items }: { items: Announcement[] }) {
  if (items.length === 0) return null;
  return (
    <View style={homeStyles.announcementsSection}>
      <Text style={homeStyles.sectionTitle}>Announcements</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.announcementsScroll}
      >
        {items.map((item) => (
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchData("/announcementData/announcement.json")
      .then((res) => setAnnouncements(res.data ?? []))
      .catch(() => {});
  }, []);

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
      <Header title="Virtual Piku" />

      {loading && <LoadingSpinner />}

      <FlatList
        data={cards}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<AnnouncementsSection items={announcements} />}
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
