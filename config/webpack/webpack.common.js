const { join, resolve } = require("path");
const { DefinePlugin } = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = dotenv.config({ path: join(__dirname, "..", "..", ".env") }).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: {
    index: join(__dirname, "..", "..", "src", "app", "App.jsx"),
  },
  output: {
    hashFunction: "xxhash64",
    path: resolve(__dirname, "..", "..", "dist"),
    filename: "[name].js",
    publicPath: "/",
    chunkFilename: "[name].js",
    library: "widget_speech2text",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.?(js|jsx)$/,
        include: resolve(__dirname, "..", "..", "src"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
                ["@babel/preset-env", {
                    targets: { ie: "11" },     // ES5
                    bugfixes: true,
                    useBuiltIns: false,
                    modules: false
                }],
                "@babel/preset-react"
            ],
            plugins: [
                "@babel/plugin-transform-parameters",
                "@babel/plugin-transform-class-properties",
                "@babel/plugin-transform-private-methods",
                "@babel/plugin-transform-optional-chaining",
                "@babel/plugin-transform-nullish-coalescing-operator",
                "@babel/plugin-transform-object-rest-spread"
            ]
          },
        },
      },
      {
        test: /\.css$/i,
        use: 'raw-loader',
      },
      {
          test: /\.module\.scss$/,
          use: [
              "style-loader",
              {
                  loader: "css-loader",
                  options: {
                      modules: {
                          localIdentName: "[name]__[local]___[hash:base64:5]",
                      },
                  },
              },
              "sass-loader",
          ],
      },
      {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: [
              "style-loader",
              "css-loader",
              "sass-loader",
          ],
      },
    ],
  },
  resolve: {
    modules: [
      "node_modules",
      resolve(__dirname, "..", "..", "src"),
      resolve(__dirname, "..", "..", "node_modules"),
    ],
    extensions: [".js", ".jsx"],
  },
  resolveLoader: {
    modules: ["node_modules", resolve(__dirname, "..", "..", "node_modules")],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "..", "..", "public", "index.html"),
      filename: "index.html",
      inject: "body",
    }),
    new DefinePlugin(envKeys),
  ],
};
