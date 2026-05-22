import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'charts':        ['recharts'],
          'supabase':      ['@supabase/supabase-js'],
          'data-tests':    [
            './src/data/reading.js',
            './src/data/listening.js',
            './src/data/writing.js',
            './src/data/speaking.js',
            './src/data/timetable.js',
          ],
        },
      },
    },
  },
})
