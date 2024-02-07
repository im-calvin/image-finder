import { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
import { getClosestQuery } from "@/openai";
import { getAssetInfoAsync } from "expo-media-library";

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

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const itemWidth = screenWidth / 2 - 10; // Assuming a 10 pixels total margin for spacing

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
      <FlatList
        data={images}
        numColumns={2}
        extraData={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width: itemWidth, margin: 5, position: "relative" }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.image_path);
                setModalVisible(true);
              }}>
              <Image width={itemWidth} height={itemWidth} source={{ uri: item.image_path }} />
              <View
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: 2,
                  borderRadius: 5,
                }}>
                <Text style={{ color: "white", fontSize: 12 }}>{item.similarity.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>

            {/* <Text>{item.description}</Text> */}
            {/* <Text>Similarity: {item.similarity}</Text> */}
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            {selectedImage && (
              <Image
                style={{ width: screenWidth, height: screenHeight }} // Adjust as needed
                source={{ uri: selectedImage }}
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
