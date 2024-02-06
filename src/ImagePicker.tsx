import React, { useState, useEffect } from "react";
import { ScrollView, Image } from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function ImagePicker() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);

  // console.log(photos);
  useEffect(() => {
    async function getPhotos() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const albums = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });
        // const album = await MediaLibrary.getAlbumAsync();
        const album = albums.filter((album) => album.title === "image-finder")[0]; // iOS only
        // dump albums to dump.json
        const media = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 20, // Adjust the number of photos you want to fetch
          mediaType: "photo",
        });
        setPhotos(media.assets);
      }
    }
    getPhotos();
  }, []);

  return (
    <ScrollView>
      {photos.map((photo) => (
        <Image key={photo.id} style={{ width: 300, height: 300 }} source={{ uri: photo.uri }} />
      ))}
    </ScrollView>
  );
}
