import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),
  react()],
    define: {
    'global': 'globalThis'
  },  // now in browser global will work as globalThis means window object and in node it will work as global object

   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },  
  },
})
