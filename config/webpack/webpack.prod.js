const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 5,
                    compress: true,
                    mangle: true,
                    format: { comments: false }
                },
                extractComments: false
            })
        ],
        splitChunks: false,
        runtimeChunk: false
    }
});
