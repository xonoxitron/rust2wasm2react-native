/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const metroDefault = require('metro-config/src/defaults/defaults');

module.exports = {
  resolver: {
    assetExts: metroDefault.assetExts.concat(['wasm']),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
