const HtmlCustomPlugin = require('./htmlCustomPlugin')

module.exports = {
  publicPath: '',
  devServer: {
    host: 'fet-proxy.liepin.com',
    watchContentBase: true,
    clientLogLevel: 'none',
    https: true
  },
  crossorigin: 'anonymous',
  configureWebpack: {
    plugins: [new HtmlCustomPlugin()]
  },
  chainWebpack: config => {    
    config
      .plugin('html')
      .tap((args) => {
        let [options] = args
        options = {
          ...options,
          ...{
            minify: false,
            inject: true,
          }
        }
        return args
      })
  }
}





