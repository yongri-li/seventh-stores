const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    watch: false,
    entry: {
        "global": "./scripts/app.js",
        "product-form": "./scripts/components/product-form.js",
        "lightning-menu": "./scripts/components/lightning-menu.js",
        "cart": "./scripts/components/cart.js",
        "discount-codes": "./scripts/components/discount-codes.js",
        "quick-add": "./scripts/components/quick-add.js",
        "slider": "./scripts/components/slider.js"
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].min.js',
        umdNamedDefine: false
    },
    optimization: {
        minimize: true,
        concatenateModules: false,
        providedExports: false,
        usedExports: false,
        sideEffects: true
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};