import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import "./styles.css";

export default function App() {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text>Open up App.js to start working on your app!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
