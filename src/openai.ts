import { Asset, getAssetInfoAsync } from "expo-media-library";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { EncodingType, downloadAsync, readAsStringAsync } from "expo-file-system";
import { OPENAI_API_KEY, SUPABASE_SERVICE_KEY, SUPABASE_URL } from "@env";
import { Database } from "types/database.types";

const OpenAIClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const SupabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface OpenAIImage {
  type: "image_url";
  image_url: {
    url: string;
  };
}

interface ImageI extends OpenAIImage {
  image_path: string;
}

// Function to encode asset to base64
const createImageObject = async (asset: Asset): Promise<ImageI> => {
  // convert asset to uri
  const file = await getAssetInfoAsync(asset);
  if (!file.localUri) {
    throw new Error("File URL not found")
  }
  const base64 = await readAsStringAsync(file.localUri, {
    encoding: EncodingType.Base64,
  });
  return {
    type: "image_url",
    image_url: {
      url: `data:image/jpeg;base64,${base64}`,
    },
    image_path: file.localUri
  };
};

// get images from Supabase
async function getAllImagePathsFromSupabase(): Promise<string[]> {
  const { data, error } = await SupabaseClient.from("images").select("image_path")
  if (!data || error) {
    console.error("Error fetching images from Supabase");
    return []
  }
  return data.map((item) => item.image_path);
}

// Example function to post data to OpenAI
export const getOpenAIDescriptions = async (assets: Asset[]) => {
  const userImages = await Promise.all(assets.map((asset) => createImageObject(asset)));
  const dbImages = await getAllImagePathsFromSupabase();

  // find new images
  const newImages = userImages.filter((image) => !dbImages.includes(image.image_path));

  // get objects for openai request
  const openAIImages: OpenAIImage[] = newImages.map((image) => ({
    type: image.type,
    image_url: image.image_url,
  }));
    
  const completions = await OpenAIClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You will be given an arbitrary number of images. For each image, give a description of the image. The description should be independent and treat each image individually. Start the description without numbering the images, for example: 'A cat is sitting on a table.' Instead of 'The first image is about a cat sitting on a table'. Delineate each description with a double line break.",
      },
      {
        role: "user",
        content: openAIImages,
      },
    ],
    model: "gpt-4-vision-preview",
    max_tokens: 300,
  });

  const descriptions = completions.choices[0].message.content?.split("\n\n") as string[];
  // create embeddings
  const embeddings = (
    await OpenAIClient.embeddings.create({
      input: descriptions,
      model: "text-embedding-3-small",
    })
  ).data;

  const embeddingVectors = embeddings.map((embedding) => embedding.embedding);

  const databaseTriplets = newImages.map((image, index) => ({
    image_path: image.image_path,
    embedding: embeddingVectors[index],
    description: descriptions[index],
  }));

  for (const { image_path, embedding, description } of databaseTriplets) {

    const { data, error, count } = await SupabaseClient.from("images").upsert({
      image_path,
      embedding: JSON.stringify(embedding),
      description
    });

    console.log(data, count)
    console.error(error);
  }
}



