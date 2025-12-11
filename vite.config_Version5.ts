import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // loadEnv(...) reads .env files; use VITE_ prefix for client-safe vars
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // For GitHub Pages, set base to your repo name. Change/remove if you host elsewhere.
    base: '/Stickman-Roulette/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // IMPORTANT: Do not expose secret API keys directly into the client bundle.
    // Use import.meta.env.VITE_GEMINI_API_KEY in client code and set VITE_GEMINI_API_KEY via CI secrets,
    // or move API calls to a server-side component.
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});