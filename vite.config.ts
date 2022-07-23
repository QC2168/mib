import { rmSync } from 'fs'
import { join } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import pkg from './package.json'
import Unocss from 'unocss/vite'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import presetAttributify from '@unocss/preset-attributify'
import { presetScrollbar } from 'unocss-preset-scrollbar'
rmSync(join(__dirname, 'dist'), { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      'styles': join(__dirname, 'src/assets/styles'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            sourcemap: false,
            outDir: 'dist/electron/main',
          },
        },
      },
      preload: {
        input: {
          // You can configure multiple preload scripts here
          index: join(__dirname, 'electron/preload/index.ts'),
        },
        vite: {
          build: {
            // For debug
            sourcemap: 'inline',
            outDir: 'dist/electron/preload',
          }
        },
      },
      // Enables use of Node.js API in the Electron-Renderer
      renderer: {},
    }),
    Unocss({
      presets: [
        presetUno(),presetAttributify(),
        presetIcons({ /* options */ }),
        presetScrollbar({
          // config
        }),
      ],
    })
  ],
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
})
