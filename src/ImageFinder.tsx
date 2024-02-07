import { useState } from "react";
import { TextInput, View } from "react-native";
import { getClosestQuery } from "@/openai";
import ImageGallery from "./ImageGallery";

const MATCH_COUNT = 5;
const SIMILARITY_THRESHOLD = 0;

interface SimilarImage {
  id: number;
  description: string;
  similarity: number;
  image_path: string;
}

export default function ImageFinder() {
  const [inputValue, setInputValue] = useState<string>("");
  const [images, setImages] = useState<SimilarImage[]>([]);

  const handleSubmit = async () => {
    console.log("Search for images with:", inputValue);
    const similarImages: SimilarImage[] = await getClosestQuery(
      inputValue,
      MATCH_COUNT,
      SIMILARITY_THRESHOLD
    );

    setImages(similarImages);
  };

  return (
    <View>
      <TextInput
        placeholder="Search for images"
        value={inputValue}
        style={{
          marginTop: 60,
          marginHorizontal: 20, // Adds horizontal margin for better spacing
          padding: 10, // Adds padding inside the TextInput
          borderWidth: 1, // Sets the border width
          borderColor: "#ccc", // Sets the border color
          borderRadius: 5, // Rounds the corners of the border
          fontSize: 16, // Adjusts the font size
          color: "black", // Sets the text color
        }}
        onChangeText={setInputValue}
        onSubmitEditing={handleSubmit}
        placeholderTextColor={"black"}
      />
      <ImageGallery images={images} />
    </View>
  );
}
