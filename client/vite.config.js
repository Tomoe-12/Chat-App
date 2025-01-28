// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       // eslint-disable-next-line no-undef
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   base: "/", // Ensure correct base path
//   server: {
//     port: 5173,
//   },
//   build: {
//     outDir: "dist", // Make sure Vercel deploys from the correct folder
//   }
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Make sure this path is correct
    },
  },
});
