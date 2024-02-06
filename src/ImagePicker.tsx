import React, { useState, useEffect, Fragment } from "react";
import { ScrollView, Image, Text } from "react-native";
import { requestPermissionsAsync, getAlbumsAsync, getAssetsAsync, Asset } from "expo-media-library";
import { getOpenAIDescriptions } from "@/openai";

export default function ImagePicker() {
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);

  console.log(descriptions);
  useEffect(() => {
    async function getPhotos() {
      const { status } = await requestPermissionsAsync();
      if (status === "granted") {
        const albums = await getAlbumsAsync({ includeSmartAlbums: true });
        const album = albums.filter((album) => album.title === "image-finder")[0]; // iOS only
        const media = await getAssetsAsync({
          album: album.id,
          first: 2, // Adjust the number of photos you want to fetch
          mediaType: "photo",
        });
        setPhotos(media.assets);
        const openAIDescriptions = await getOpenAIDescriptions(media.assets);
        
        setDescriptions(openAIDescriptions.message.content?.split("\n\n") || []);
      }
    }
    getPhotos();
  }, []);

  return (
    <ScrollView>
      {photos.map((photo, index) => (
        <Fragment key={photo.id}>
          <Image key={photo.id} style={{ width: 300, height: 300 }} source={{ uri: photo.uri }} />
          <Text>{descriptions[index]}</Text>
        </Fragment>
      ))}
    </ScrollView>
  );
}
