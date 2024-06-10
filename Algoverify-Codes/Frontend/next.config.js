const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: (config, { isServer }) => {
    config.plugins.push(new NodePolyfillPlugin());

    // Ensure node modules used in server-side code are handled correctly
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        // Add other modules as necessary
      };
    }

    return config;
  },
};