const { merge } = require("webpack-merge");
const { join } = require("path");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  // cache: false,
  
  devServer: {
    server: "http",
    static: {
      directory: join(__dirname, "..", "..", "dist"),
    },
    hot: true,
    open: true,
    historyApiFallback: true,
    host: "0.0.0.0",
    allowedHosts: "all",
    port: 3007,
    headers: {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    }
  },
});