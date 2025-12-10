const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,

  // Configure Webpack
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    devServer: {
      port: 5173,
      open: true,
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/api'
          }
        }
      }
    }
  },

  // CSS Loader configuration
  css: {
    loaderOptions: {
      css: {
        // Additional CSS loader options if needed
      }
    }
  },

  // Chain Webpack configuration
  chainWebpack: config => {
    // Configure SVG loading
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('file-loader');

    // Configure other image types
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)$/i)
      .use('file-loader')
      .loader('file-loader');

    // Configure Vue loader
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        return {
          ...options,
          reactivityTransform: true
        };
      });
  },

  // Plugin options
  pluginOptions: {
    // Add any plugin options here
  }
});