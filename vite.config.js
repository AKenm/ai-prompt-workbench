import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'auto-shutdown',
      configureServer(server) {
        server.middlewares.use('/__shutdown', (req, res) => {
          res.end('ok');
          console.log('页面已关闭，dev server 自动终止');
          process.exit(0);
        });
      },
    },
  ],
});
