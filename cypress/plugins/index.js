const path = require("path")
const webpack = require("@cypress/webpack-preprocessor")

const webpackOptions = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
}

module.exports = on => {
  const options = {
    webpackOptions,
    watchOptions: {},
  }

  on("file:preprocessor", webpack(options))
}
