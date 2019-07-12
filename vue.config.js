module.exports = {
    // 用法和 webpack 本身的 output.publicPath 一致
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8089',
                pathRewrite: {'^/api': ''}
            }
        }
    }
}
