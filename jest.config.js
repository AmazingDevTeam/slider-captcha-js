export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.[jt]sx?$": ["ts-jest"]
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  setupFiles: ["./jest.setup.js"]
};
