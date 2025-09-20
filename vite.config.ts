import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // 根据环境和命令自动设置 base 路径
  const isProduction = command === 'build';
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';

  return {
    // 动态 base 配置
    base: isProduction && isGitHubPages ? '/low-code-platform/' : '/',

    plugins: [
      react({
        // 启用 JSX 运行时
        jsxRuntime: 'automatic',
        // 启用 Babel 插件
        babel: {
          plugins: [
            // 可以在这里添加 Babel 插件
          ],
        },
      }),
    ],

    // 路径别名配置
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(
          new URL('./src/components', import.meta.url)
        ),
        '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
        '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    },

    // 开发服务器配置
    server: {
      port: 3000,
      open: true, // 自动打开浏览器
      host: true, // 允许外部访问
      cors: true,
      // 代理配置（如果需要）
      proxy: {
        // '/api': {
        //   target: 'http://localhost:8080',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, ''),
        // },
      },
    },

    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // 生产环境关闭 sourcemap
      minify: 'terser', // 使用 terser 压缩
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console
          drop_debugger: true, // 移除 debugger
        },
      },
      rollupOptions: {
        output: {
          // 分包策略
          manualChunks: {
            // React 相关
            'react-vendor': ['react', 'react-dom'],
            // Ant Design
            'antd-vendor': ['antd', '@ant-design/icons'],
            // 拖拽相关
            'dnd-vendor': [
              '@dnd-kit/core',
              '@dnd-kit/sortable',
              '@dnd-kit/utilities',
            ],
            // 其他工具库
            'utils-vendor': ['uuid'],
          },
          // 资源文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // 构建大小警告阈值
      chunkSizeWarningLimit: 1000,
    },

    // 预览服务器配置
    preview: {
      port: 4173,
      open: true,
      host: true,
    },

    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          // 全局变量导入
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
      // CSS 模块化配置
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },

    // 优化配置
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'antd',
        '@ant-design/icons',
        '@dnd-kit/core',
        '@dnd-kit/sortable',
        '@dnd-kit/utilities',
        'uuid',
      ],
      exclude: [],
    },

    // 环境变量配置
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    // 日志级别
    logLevel: 'info',

    // 清空屏幕
    clearScreen: false,
  };
});
