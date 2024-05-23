const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = (_env, argv) => {
    const isDevelopment = argv.mode !== "production";

    const versionConfig = require("../versionconfig.json").version;
    const version = `${versionConfig.major}.${versionConfig.minor}.${versionConfig.patch}`;

    return {
        entry: "./src/index.jsx",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: `bundle-${version}.min.js`
        },
        mode: isDevelopment ? "development" : "production",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [require("tailwindcss"), require("autoprefixer")]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(ts|tsx)$/,
                    include: [path.resolve(__dirname, "src/shadcn")],
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            alias: {
                "@": path.resolve(__dirname, "src/shadcn")
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html"
            }),
            new webpack.DefinePlugin({
                "process.env.SERVICE_BASE_ADDRESS": JSON.stringify(process.env.SERVICE_BASE_ADDRESS)
            }),
            isDevelopment && new ReactRefreshWebpackPlugin()
        ].filter(Boolean),
        devServer: {
            static: [
                {
                    directory: path.join(__dirname, "dist")
                },
                {
                    directory: path.join(__dirname, "public")
                }
            ],
            hot: true,
            open: true,
            watchFiles: {
                paths: [path.join(__dirname, "./src/**/*"), path.join(__dirname, "./public/**/*")]
            }
        }
    };
};
