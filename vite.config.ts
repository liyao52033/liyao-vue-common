import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from "path";
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'


//  const pathSrc = path.resolve(__dirname, 'src')

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve("./src")
        },
    },
    plugins: [
      vue(),
      AutoImport({
          // Auto import functions from Vue, e.g. ref, reactive, toRef...
          // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
          imports: ["vue", "@vueuse/core"],

          // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          resolvers: [
              ElementPlusResolver(),

              // Auto import icon components
              // 自动导入图标组件
              IconsResolver({
                  prefix: 'Icon',
              }),
          ],
          vueTemplate: true,
          dts: false
        //  dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),

      Components({
          resolvers: [
              // Auto register icon components
              // 自动注册图标组件
              IconsResolver({
                  enabledCollections: ['ep'],
              }),
              // Auto register Element Plus components
              // 自动导入 Element Plus 组件
              ElementPlusResolver(),
          ],

          dts: false
         // dts: path.resolve(pathSrc, 'components.d.ts'),
      }),

      Icons({
          autoInstall: true,
      }),
  ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/components/base/index.ts'),
            name: 'liyaoComponents',
            fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
            external: ['vue', 'element-plus'],
            output: {
                exports: "named", // ✅ 允许 default 和 named 混合导出，防止警告
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    optimizeDeps: {
        include: ['vue', "element-plus",  "path-to-regexp",  "@vueuse/core",],
    },
})
