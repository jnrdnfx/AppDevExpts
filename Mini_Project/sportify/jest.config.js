module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(react-native'
      + '|@react-native'
      + '|@react-navigation'
      + '|react-native-vector-icons'
      + '|expo(nent)?'
      + '|@expo'
      + '|expo-modules-core'
      + '|firebase'
      + '|@firebase'
      + ')/)',
  ],
};
