import { StatusBar } from "expo-status-bar";
import { Text, TextInput, View } from "react-native";
import ImagePicker from "@/ImagePicker";
import ImageFinder from "@/ImageFinder";

import "./styles.css";
import ImageGetter from "@/ImageGetter";

export default function App() {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <ImageGetter />
      <ImageFinder />
      <StatusBar style="auto" />
    </View>
  );
}
