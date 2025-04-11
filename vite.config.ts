import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  define: {
    __WS_URL__: JSON.stringify(process.env.WS_URL),
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://danjitalk.duckdns.org',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  preview: {
    host: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  esbuild: {
    legalComments: 'none'
  }
});
