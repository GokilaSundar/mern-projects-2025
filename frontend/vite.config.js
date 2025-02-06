import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import { defineConfig } from "vite";

config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // eslint-disable-next-line no-undef
      "/api": process.env.API_BASE_URL,
      // eslint-disable-next-line no-undef
      "/socket.io": process.env.API_BASE_URL,
    },
  },
});
