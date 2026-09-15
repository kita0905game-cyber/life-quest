import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      manifest: {
        name: 'LIFE QUEST',
        short_name: 'LIFE QUEST',
        description: '現実の行動で育つ、自分だけの箱庭RPG',
        theme_color: '#10241f',
        background_color: '#0b1715',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        scope: './',
        id: 'life-quest-v0-2'
      }
    })
  ],
  base: './'
});
