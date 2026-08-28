import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * After viteSingleFile inlines everything, downgrade the inline
 * module script to a classic script so the single dist/index.html
 * runs even under strict file:// module rules (looking at you, Edge).
 */
const inlineClassicScript = {
  name: "inline-classic-script",
  enforce: "post",
  transformIndexHtml(html) {
    return html
      .replace(/<script type="module" crossorigin>/g, "<script>")
      .replace(/<script type="module">/g, "<script>");
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), inlineClassicScript],
  // relative asset URLs so the build works from any folder / file://
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
