import React, { useState, useEffect } from "react";
import { Button, View, Text, ScrollView } from "react-native";
import {
  requestPermissionsAsync,
  getAlbumsAsync,
  getAssetsAsync,
  Album,
  Asset,
  getAssetInfoAsync,
} from "expo-media-library";
import { getOpenAIDescriptions } from "@/openai";
import ImageGallery, { ImageItem } from "@/ImageGallery";

interface AlbumButtonProps {
  albumId: string;
  albumTitle: string;
}

const NUM_IMAGES = 10;

export default function ImageGetter() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<ImageItem[]>([]);

  const AlbumButton: React.FC<AlbumButtonProps> = ({ albumId, albumTitle }) => {
    const handlePress = async () => {
      const media = await getAssetsAsync({
        album: albumId,
        first: NUM_IMAGES, // Adjust based on your needs
        mediaType: "photo",
      });
      await getOpenAIDescriptions(media.assets);
      const imageItems: ImageItem[] = await Promise.all(
        media.assets.map(async (asset): Promise<ImageItem> => {
          const file = await getAssetInfoAsync(asset);
          if (!file.localUri) {
            throw new Error("File URL not found");
          }
          return {
            id: Number(asset.id),
            image_path: file.localUri,
          };
        })
      );
      setPhotos(imageItems);
    };

    return <Button title={albumTitle} onPress={handlePress} />;
  };

  useEffect(() => {
    // request permissions on component mount
    const requestPermissionsAndLoadAlbums = async () => {
      const { status } = await requestPermissionsAsync();
      if (status === "granted") {
        const albums = await getAlbumsAsync({ includeSmartAlbums: true });
        setAlbums(albums);
      }
    };
    requestPermissionsAndLoadAlbums();
  }, []);

  return (
    <View>
      <ScrollView>
        {albums.map((album) => (
          <AlbumButton key={album.id} albumId={album.id} albumTitle={album.title} />
        ))}
      </ScrollView>
      <ImageGallery images={photos} />
    </View>
  );
}
