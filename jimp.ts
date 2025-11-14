import { createJimp } from "@jimp/core";
import { defaultFormats, defaultPlugins } from "jimp";
import webp from "@jimp/wasm-webp";
import avif from "@jimp/wasm-avif";

// A custom jimp that supports webp
export const Jimp = createJimp({
  formats: [...defaultFormats, webp, avif],
  plugins: defaultPlugins,
});
