import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  define: {
    global: 'window', 
  },
  plugins: [react(),tailwindcss()],
})
