module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleFileExtensions: ['js', 'json', 'node'],
};
