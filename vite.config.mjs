
import path from 'path';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert'
import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from "vite-plugin-eslint";
import Components from 'unplugin-vue-components/vite'
import obfuscator from "vite-mahlzeit-obfuscator";
import viteCompression from 'vite-plugin-compression';
import vueDevTools from 'vite-plugin-vue-devtools'
import Inspector from 'vite-plugin-vue-inspector'

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www');

export default async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      vueDevTools(),
      Inspector({
        enabled: true,
      }),
      mkcert(),
      vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.includes('swiper-') } } }),
      Components({
        dirs: [
          SRC_DIR + "/components"
        ],
      }),
      eslintPlugin({ cache: false, fix: true, formatter: "friendly" }),

      obfuscator({
        options: {
          compact: true,
          simplify: true,
          stringArrayShuffle: true,
        },
      }),
      viteCompression(),
    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: {
      host: true,
      https: true,
      fs: {
        cachedChecks: false
      }
    },

  });
}
