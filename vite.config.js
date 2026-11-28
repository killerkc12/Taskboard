import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
