module.exports = {
    pages: {
        popup: {
            template: 'public/browser-extension.html',
            entry: './src/popup/main.js',
            title: 'Popup'
        },
        options: {
            template: 'public/browser-extension.html',
            entry: './src/options/main.js',
            title: 'Options'
        }
    },
    pluginOptions: {
        browserExtension: {
            componentOptions: {}
        }
    },
    configureWebpack: {
        devtool: 'cheap-module-source-map'
    }
};
