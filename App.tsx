import { StatusBar } from "expo-status-bar";
import { Text, TextInput, View } from "react-native";
import ImagePicker from "@/ImagePicker";
import ImageFinder from "@/ImageFinder";

import "./styles.css";

const NUM_IMAGES = 6;

export default function App() {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <ImageFinder />
      <ImagePicker numImages={NUM_IMAGES} />
      <StatusBar style="auto" />
    </View>
  );
}
