import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Only use HTTPS in development when certificates exist
    https: process.env.NODE_ENV !== 'production' && fs.existsSync(path.resolve(__dirname, "certs/key.pem"))
      ? {
        key: fs.readFileSync(path.resolve(__dirname, "certs/key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "certs/cert.pem")),
      }
      : undefined,
    proxy: {
      "/api": {
        target: "https://server:9090",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
