module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    // NOTE: react-native-reanimated/plugin MUST be last in plugins array
    'react-native-reanimated/plugin',
  ],
};
