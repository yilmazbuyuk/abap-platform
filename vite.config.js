import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ABAP Transpiler'ın tarayıcıda çalışabilmesi için gerekli ayarlar
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // Node.js ortam değişkenlerini boş geç
  },
  resolve: {
    alias: {
      // Tarayıcıda 'fs' ve 'path' modüllerini boşaltıyoruz
      fs: "memfs",
      path: "path-browserify",
    },
  },
});
