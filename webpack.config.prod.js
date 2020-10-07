const path = require("path"); // core Node.js
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // absolute path required
  },
  devtool: "none", // tells about source map files
  module: {
    rules: [
      {
        test: /\.ts$/, // tells Webpack to look for .ts files
        use: "ts-loader", // automatically takes the tsconfig.json into account
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // look for files with these extensions and bundle them
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
