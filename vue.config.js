const fs = require('fs')
const path = require('path')
const HtmlCustomPlugin = require('./htmlCustomPlugin')
const HtmlWebpackPlugin = require('@vue/cli-service/node_modules/html-webpack-plugin')

const getHtmls = src => fs.readdirSync(src).filter(v=> /\.html?$/.test(v)).filter(v=> v!=='index.html')

module.exports = {
  publicPath: '',
  devServer: {
    host: 'fet-proxy.liepin.com',
    watchContentBase: true,
    clientLogLevel: 'none',
    https: true
  },
  crossorigin: 'anonymous',
  configureWebpack(config) {
    let htmlOptions
    config.plugins.forEach(v=> {      
      if (v instanceof HtmlWebpackPlugin) {
        htmlOptions = {...v.options}
      }
    })
    if(htmlOptions) {
      let files = getHtmls('./public')
      files.forEach(v=> {
        htmlOptions.template = path.join(__dirname, 'public', v)
        htmlOptions.filename = v
        config.plugins.push(new HtmlWebpackPlugin(htmlOptions))
      })
    }
    config.plugins.push(new HtmlCustomPlugin())
  }
}