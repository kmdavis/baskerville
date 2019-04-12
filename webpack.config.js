const path = require("path");
const { name: fullName } = require("./package-lock.json");

const name = fullName.split("/")[1];
const library = name.split("-").map(n => `${n[0].toUpperCase()}${n.slice(1)}`).join("");

const common = {
    entry: "./src/index.js",
    output: {
        library,
        path: path.resolve(__dirname, "dist"),
        globalObject: "typeof self !== 'undefined' ? self : this",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
            },
        ],
    },
};

module.exports = [
    {
        ...common,
        output: {
            ...common.output,
            filename: `${name}.js`,
        },
        devtool: "eval-source-map",
        mode: "development",
    },
    {
        ...common,
        output: {
            ...common.output,
            filename: `${name}.min.js`,
        },
        mode: "production",
    }
];
