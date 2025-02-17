import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'window', // Esto asegura que `global` apunte a `window` en el navegador.
  },
  plugins: [react(),tailwindcss()],
})
