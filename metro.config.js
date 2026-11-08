const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      const target = moduleName.startsWith('@/')
        ? path.join(__dirname, 'src', moduleName.slice(2))
        : moduleName;
      return context.resolveRequest(context, target, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
