const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "widget-min.js",
    library: "AngoorAI",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        // exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  mode: "production",
};
