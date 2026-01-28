import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@bunstack-playground/shared': path.resolve(
        __dirname,
        '../../packages/shared/src'
      ),
      "@/web": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@config": path.resolve(__dirname, "src/config"),
      "@features": path.resolve(__dirname, "src/features"),
      "@screens": path.resolve(__dirname, "src/screens"),
      "@shared": path.resolve(__dirname, "src/shared"),
    }
  }
});
