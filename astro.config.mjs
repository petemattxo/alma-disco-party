// @ts-check
import react from "@astrojs/react"

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, fontProviders } from "astro/config"

const compilerConfig = {
  target: "19",
}

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Archivo Black",
      cssVariable: "--font-archivo-black",
      weights: [400],
      styles: ["normal"],
    },
    {
      provider: fontProviders.local(),
      name: "Genty Demo",
      cssVariable: "--font-genty-demo",
      weights: [400],
      styles: ["normal"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/GentyDemo-Regular.woff2"],
            weight: 400,
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Cooper Black Local",
      cssVariable: "--font-cooper-black-local",
      weights: [400],
      styles: ["normal"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/COOPBL.woff2"],
            weight: 400,
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "SignPainter House Script",
      cssVariable: "--font-signpainter-house-script",
      weights: [400],
      styles: ["normal"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/SignPainterHouseScript.woff2"],
            weight: 400,
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Yellowtail",
      cssVariable: "--font-yellowtail",
      weights: [400],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Inter Tight",
      cssVariable: "--font-inter-tight",
      weights: [700, 800],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 700, 800],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Poppins",
      cssVariable: "--font-poppins",
      weights: [400],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      weights: [800],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Limelight",
      cssVariable: "--font-limelight",
      weights: [400],
      styles: ["normal"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", compilerConfig]],
      },
    }),
  ],
})
