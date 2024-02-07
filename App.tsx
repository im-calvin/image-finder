import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import ImagePicker from "@/ImagePicker";

import "./styles.css";
import { getClosestQuery } from "@/openai";

const MATCH_COUNT = 5;
const SIMILARITY_THRESHOLD = 0.5;

export default function App() {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = async () => {
    console.log("Search for images with:", inputValue);
    const similarImages = await getClosestQuery(inputValue, MATCH_COUNT, SIMILARITY_THRESHOLD);
    console.log(similarImages);
  };
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <TextInput
        placeholder="Search for images"
        className="input text-lg text-black placeholder-black pt-24"
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSubmit}
      />
      <ImagePicker />
      <StatusBar style="auto" />
    </View>
  );
}
