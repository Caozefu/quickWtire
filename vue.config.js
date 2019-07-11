module.exports = {
    // 用法和 webpack 本身的 output.publicPath 一致
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.100.114:8089',
                pathRewrite: {'^/api': ''}
            }
        }
    }
}
