import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
export default defineConfig({
  root: here('.'),
  plugins: [react()],
  resolve: { alias: { 'firebase/firestore': here('./fake-firestore.js'), 'firebase/auth': here('./fake-auth.js'), 'firebase/app': here('./fake-app.js') } },
  build: { outDir: here('./dist'), emptyOutDir: true },
});
