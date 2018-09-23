const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
let conf;
try {
  conf = require('./.config');
} catch (e) {
  conf = require('./.config.js.example');
}

module.exports = {
  webpack: function override(config, env) {
    config = injectBabelPlugin(['import', {libraryName: 'antd', libraryDirectory: 'es', style: 'css'}], config);
    config = rewireLess(config, env);
    return config;
  },
  devServer: function(configFunction) {
    process.env.PORT = conf.port;
    return function(proxy, host) {
      proxy = {
        '/api': {
          target: conf.api.host,
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      };
      return configFunction(process.env.PROXY_TARGET || proxy, host);
    }
  }
};