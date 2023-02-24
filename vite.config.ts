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

const { join } = require('path');

rmSync(join(__dirname, 'dist-electron'), { recursive: true, force: true }); // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      styles: join(__dirname, 'src/assets/styles'),
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
      entry: 'electron/main.ts',
      vite: {
        build: {
          sourcemap: true,
        },
      },
    },
    {
      entry: 'electron/preload.ts',
      onstart(options) {
        options.reload();
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
