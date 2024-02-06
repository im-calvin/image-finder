import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import ImagePicker from "@/ImagePicker";

import "./styles.css";

export default function App() {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <ImagePicker />
      <StatusBar style="auto" />
    </View>
  );
}
