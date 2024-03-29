import { rmSync } from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import Unocss from 'unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';
import presetAttributify from '@unocss/preset-attributify';
import transformerDirective from '@unocss/transformer-directives';
import esmodule from 'vite-plugin-esmodule';
import pkg from './package.json';

const { join, resolve } = require('path');

rmSync(join(__dirname, 'dist-electron'), { recursive: true, force: true }); // v14.14.0

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      styles: resolve(__dirname, 'src/assets/styles'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less'],
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    react(),
    electron([{
      entry: ['electron/main.ts', 'electron/preload.ts', 'electron/worker/backup.ts', 'electron/utils/recommendConfigs/index.ts'],
      vite: {
        mode: process.env.NODE_ENV,
        build: {
          minify: isProd,
          watch: isDev ? {} : null,
        },
      },
    },
    ]),

    Unocss({
      presets: [
        presetUno({ dark: 'class' }),
        presetAttributify(),
        presetIcons({
          /* options */
        }),
      ],
      transformers: [transformerDirective()],
    }),
    esmodule(['fs-extra']),
  ],
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
});
