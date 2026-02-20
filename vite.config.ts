// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// // https://vitejs.dev/config/
// export default function defineConfig() {
//   return {
//     plugins: [react()],
//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, './src')
//       }
//     },
//     optimizeDeps: {
//       exclude: ['lucide-react'],
//     },
//   };
// }

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: "/",   // ✅ VERY IMPORTANT FOR VERCEL
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
