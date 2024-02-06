import "ts-node/register"; // Add this to import TypeScript files
import { ExpoConfig } from "expo/config";
import "dotenv/config";

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: "image-finder",
  slug: "image-finder",
  extra: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  },
};

export default config;
