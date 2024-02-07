import React, { useState } from "react";
import { FlatList, View, TouchableOpacity, Image, Text, Modal, Dimensions } from "react-native";

// Assuming you have a type for your images
export type ImageItem = {
  id: number;
  image_path: string;
  similarity?: number;
};

interface ImageFinderProps {
  images: ImageItem[];
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ImageGallery({ images }: ImageFinderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Assuming an item width, adjust as necessary
  const itemWidth = screenWidth / 2 - 10; // For 2 columns, minus margin

  return (
    <View>
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
              {item.similarity && (
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
              )}
            </TouchableOpacity>
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
