const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'script.js'
    },
    module: {
        rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
        },
        ],
    },
    resolve: {
        extensions: [
            '.ts', '.js',
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'docs')
        }
    },
};