import {defineConfig,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite' //自动导入
import Components from 'unplugin-vue-components/vite' //组件注册
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression' //vite开启gzip压缩
import path from 'path';//使用path需要按照@types/node依赖

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>{
    // 获取当前环境的配置
    const config = loadEnv(mode, './')
    return {
        // 起个别名，在引用资源时，可以用‘@/资源路径’直接访问
        resolve: {
            alias: {
                // 配置路径别名@
                "@": path.resolve(__dirname, "src"),
                /*加入路径别名,解决控制台i18n报警*/
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
            },
        },
        plugins: [
            vue(),
            AutoImport({
                imports: [
                    'vue',
                    {'naive-ui': []}
                ]
            }),
            Components({
                resolvers: [NaiveUiResolver()]
            }),
            /*开启gzip模式*/
            viteCompression({
                verbose: true, // 默认即可
                disable: false, //是否禁用压缩(不禁用)
                deleteOriginFile: true, //删除源文件
                threshold: 10240, //压缩前最小文件大小
                algorithm: 'gzip', //压缩算法
                ext: '.gz', //文件类型
            })
        ],
        // 配置前端服务地址和端口
        server: {
            //配置跨域
            proxy: {
                "/api": { // “/api” 以及前置字符串会被替换为真正域名
                    target: config.VITE_BASE_URL, // 请求域名
                    secure: false, // 请求是否为https
                    changeOrigin: true, // 是否跨域
                    rewrite: (path) => path.replace(/^\/api/, "")
                }
            },
            host: '0.0.0.0',
            open: true, //在服务器启动时自动在浏览器中打开应用程序。当此值为字符串时，会被用作 URL 的路径名。
            port: 7130,
            // 是否开启 https
            https: false,
        },
    }
})
