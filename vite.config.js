import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api-ai': {
        target: 'https://api.cloudflare.com/client/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ai/, ''),
      },
    },
  },
});
