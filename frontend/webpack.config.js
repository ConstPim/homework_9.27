import path from "node:path";
import {fileURLToPath} from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: "./src/app.js",
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "static/fonts", to: "fonts"},
                {from: "static/images", to: "images"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        targets: "defaults",
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                }
            }
        ]
    }
};