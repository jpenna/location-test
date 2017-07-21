module.exports = {
  "moduleDirectories": [
    "node_modules",
    "/"
  ],
  "testMatch": [
    "**/tests/**/*.tests.js?(x)"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },
  browser: true,
  verbose: true
}
