import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 基础路径，默认为 '/'，保持默认即可
  base: '/',
  server: {
    port: 5173,
    host: true, // 允许局域网访问（可选）
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
