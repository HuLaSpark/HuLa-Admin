import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression' //vite开启gzip压缩
import vueDevTools from 'vite-plugin-vue-devtools'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDefine } from './build/config/define'
import { getRootPath, getSrcPath } from './build/config/getPath'
import { atStartup } from './build/config/console'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  // 获取当前环境的配置,如何设置第三个参数则加载所有变量，而不是以"VITE_"前缀的变量
  const config = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        // 配置路径别名@
        '@': getSrcPath(),
        // 配置路径别名~(根路径)
        '~': getRootPath(),
        /*加入路径别名,解决控制台i18n报警*/
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    define: viteDefine,
    plugins: [
      atStartup(config, mode),
      /**
       * !实验性功能
       * 开启defineModel
       * 开启defineProps解构语法
       * */
      vue({ script: { propsDestructure: true, defineModel: true } }),
      visualizer({
        open: true, //注意这里要设置为true，否则无效
        filename: 'analyse.html', //分析图生成的文件名
        gzipSize: true, // 收集 gzip 大小并将其显示
        brotliSize: true // 收集 brotli 大小并将其显示
      }), // 打包分析
      vueDevTools(), // 开发工具
      vueJsx(), // 开启jsx功能
      AutoImport({
        imports: ['vue', { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'] }],
        dts: 'src/typings/auto-imports.d.ts'
      }),
      /*自动导入组件，但是不会自动导入jsx和tsx*/
      Components({
        dirs: ['src/components', 'src/views/composables'], // 设置需要扫描的目录
        extensions: ['vue'], // 文件类型
        resolvers: [NaiveUiResolver()], // ui库解析器，也可以自定义，需要安装相关UI库
        dts: 'src/typings/components.d.ts' // 输出文件，里面都是一些import的组件键值对
      }),
      /*开启gzip模式*/
      viteCompression({
        verbose: true, // 默认即可
        disable: false, //是否禁用压缩(不禁用)
        deleteOriginFile: true, //删除源文件
        threshold: 2000, // 设置只有超过 2k 的文件才执行压缩
        algorithm: 'gzip', // 指定使用gzip压缩
        ext: '.gz' // 指定压缩后的文件扩展名为".gz"
      }),
      /* 压缩代码 */
      terser({
        format: {
          comments: false // 移除所有注释
        },
        compress: {
          drop_console: true, // 移除 console.log
          drop_debugger: true // 移除 debugger
        }
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    build: {
      cssCodeSplit: true, // 启用 CSS 代码拆分
      minify: 'terser', // 指定使用哪种混淆器
      // chunk 大小警告的限制(kb)
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },
    // 配置前端服务地址和端口
    server: {
      //配置跨域
      proxy:
        config.VITE_HTTP_PROXY === 'Y'
          ? {
              // api 统一代理到 gateway
              '/api': {
                target: config.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
              },
              // oauth 模块代理
              '/proxy-oauth': {
                target: config.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy-oauth/, '/oauth')
              },
              // base 模块代理
              '/proxy-base': {
                target: config.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy-base/, '/base')
              },
              // system 模块代理
              '/proxy-system': {
                target: config.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy-system/, '/system')
              },
              // ai 模块代理
              '/proxy-ai': {
                target: config.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy-ai/, '/ai')
              },
              // im 模块代理
              '/proxy-im': {
                target: config.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy-im/, '/im')
              },
              // gateway 模块代理
              '/proxy-gateway': {
                target: config.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy-gateway/, '/gateway')
              }
            }
          : undefined,
      cors: true, // 配置 CORS
      hmr: true, // 热更新
      host: '0.0.0.0',
      open: true, //在服务器启动时自动在浏览器中打开应用程序。当此值为字符串时，会被用作 URL 的路径名。
      port: 7130
    }
  }
})

