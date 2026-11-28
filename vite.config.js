import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Installable app + offline app shell. Updates wait for the user to choose Reload.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['apple-touch-icon.png', 'favicon-64.png', 'icon.svg'],
      manifest: {
        name: 'TaskBoard',
        short_name: 'TaskBoard',
        description: 'A simple, fast task board: lists, tasks, due dates, synced across devices.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#1f2024',
        background_color: '#1f2024',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        globIgnores: ['og.png'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /\/[^/?]+\.[a-z0-9]+$/i],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  build: {
    // Keep CRA's output folder so the existing Vercel project settings keep working.
    outDir: 'build',
    // The firebase chunk is one library (~540 kB, ~130 kB gzipped); don't warn about it.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // Firebase is most of the bundle and changes rarely: own file, cached across deploys.
        codeSplitting: {
          groups: [
            { name: 'firebase', test: /node_modules[\\/]@?firebase/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
});
