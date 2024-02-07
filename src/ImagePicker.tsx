import React, { useState, useEffect, Fragment } from "react";
import { ScrollView, Image, Text, View, FlatList, Dimensions } from "react-native";
import { requestPermissionsAsync, getAlbumsAsync, getAssetsAsync, Asset } from "expo-media-library";
import { getOpenAIDescriptions } from "@/openai";

interface ImagePickerProps {
  numImages: number;
}

const ALBUM_TITLE = "image-finder";

export default function ImagePicker({ numImages }: ImagePickerProps) {
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / 2 - 10; // Assuming a 10 pixels total margin for spacing

  useEffect(() => {
    async function getPhotos() {
      const { status } = await requestPermissionsAsync();
      if (status === "granted") {
        const albums = await getAlbumsAsync({ includeSmartAlbums: true });
        const album = albums.filter((album) => album.title === ALBUM_TITLE)[0]; // iOS only
        const media = await getAssetsAsync({
          album: album.id,
          first: numImages, // Adjust the number of photos you want to fetch
          mediaType: "photo",
        });
        setPhotos(media.assets);
        const openAIDescriptions = await getOpenAIDescriptions(media.assets);
        setDescriptions(openAIDescriptions);
      }
    }
    getPhotos();
  }, []);

  return (
    <FlatList
      data={photos}
      numColumns={2}
      keyExtractor={(item) => item.id}
      extraData={photos}
      renderItem={({ item, index }) => (
        <View style={{ width: itemWidth, margin: 5 }}>
          <Image width={itemWidth} height={itemWidth} source={{ uri: item.uri }} />
          <Text className="truncate">{descriptions[index]}</Text>
        </View>
      )}
    />
  );
}
