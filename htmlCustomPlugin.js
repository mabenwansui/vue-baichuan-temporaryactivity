const path = require('path')
const packageJson = require(path.join(__dirname, './package.json'))
const { event_type, event_online, event_biz } = packageJson.yangtuo.extField

const injectScript = `
<script src="js/tlog.min.js"></script>
<script src="js/vds-lp.js"></script>
`

const injectTlog = `
<script>
  window.tlg = window.tlg || {}; 
  tlg.dataInfo = tlg.dataInfo || {}; 
  tlg.dataInfo.event_biz = "${event_biz}"
  tlg.dataInfo.event_type = "${event_type}"
  tlg.dataInfo.event_online = "${event_online}"
</script>
`

function inject(html) {
  html = html.replace('</title>', `</title>${injectTlog}`)
  return html.replace('</body>', `${injectScript}</body>`)
}

class HtmlCustomPlugin {
  apply(compiler) {
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData) {
        htmlPluginData.html = inject(htmlPluginData.html)
        return htmlPluginData
      })
    })
  }
}
module.exports = HtmlCustomPlugin
















// const HtmlWebpackPlugin = require('html-webpack-plugin');
// class MyPlugin {
//   apply (compiler) {
//     compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
//       console.log('The compiler is starting a new compilation...')
//       let maben = HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync
//       // Static Plugin interface |compilation |HOOK NAME | register listener 
//       HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('MyPlugin', (data, cb) => {
//           console.log('========')
//           console.log(data)
//           console.log('========')
//           // Manipulate the content
//           data.html += 'The Magic Footer'
//           // Tell webpack to move on
//           cb(null, data)
//         }
//       )
//     })
//   }
// } 
// module.exports = MyPlugin