import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
   server: {

    proxy: {
      "/api": {
        target: "https://mern-blog-embt.onrender.com/",
        secure: false,
        changeOrigin: true,
      },


   },
  },

  plugins: [react()],
  build: {
    outDir: 'dist', // Explicitly specify the output directory
    chunkSizeWarningLimit: 1000, // Increase to 1000 KB (1 MB)
 // Or whatever your desired output directory is
    assetsDir: 'assets', // Directory for assets (optional)
    sourcemap: true,
  },
});
