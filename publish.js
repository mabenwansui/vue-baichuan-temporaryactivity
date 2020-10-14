const fs = require('fs')
const os = require('os')
const path = require('path')
const { exec } = require('child_process')
const packageJson = require('./package.json')
const zipdir = require('zip-dir')
const request = require('request')
const chalk = require('chalk')
const zipFilePath = path.join(os.tmpdir() || './', 'asset.zip')
const zipFilePathEvent = path.join(os.tmpdir() || './', 'yangtuo-event.zip')
const logger = (text, color = 'green') => console.log(chalk[color](text))

function getUserInfo() {
  return new Promise((resolve, reject) => {
    exec('git config --global --list', (err, status) => {
      if (err) {
        logger('获取用户姓名与邮箱失败!!!', 'red')
        reject(err)
      } else {
        const match = status.match(/(^|\n)user.name=([^\n\r]+)[\s\S]*user.email=([^\n\r]+)/) // 全局git配置
        if (match) {
          resolve(match[2])
        } else {
          reject(new Error('请设置你的git账户与邮箱!!!'))
        }
      }
    })
  })
}

function packDist() { 
  return new Promise((resolve, reject)=> {
    zipdir('./dist', { saveTo: zipFilePath }, err => {
      if (err) {
        logger('打包文件失败！', 'red')
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function packEvent() {
  return new Promise((resolve, reject) => {
    zipdir('./',
      {
        saveTo: zipFilePathEvent,
        filter(fullPath) {
          if (/\.gitignore$/.test(fullPath) || /\.git$/.test(fullPath)) {
            return true
          }
          return ![
            /node_modules$/,
            /\/\.[^/]+$/,
            /package-lock\.json$/,
            /dist$/,
          ].some((v) => v.test(fullPath))
        },
      },
      (err) => {
        if (err) {
          logger('打包文件失败！', 'red')
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

function removePack() {
  fs.unlinkSync(zipFilePath)
  fs.unlinkSync(zipFilePathEvent)  
}

function send(data) {
  return new Promise((resolve, reject) => {
    const formData = {
      developZipFile: {
        value: fs.createReadStream(zipFilePathEvent),
        options: { contentType: 'application/octet-stream' },
      },
      publishZipFile: {
        value: fs.createReadStream(zipFilePath),
        options: {contentType: 'application/octet-stream',
        },
      },
      ...data,
    };
    try {
      request(
        {
          url: 'http://rivers.tongdao.cn/project/uploadzip.json',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          method: 'post',
          formData,
        },
        (err, httpResponse, body) => {
          if (err) {
            logger('请求异常', 'red');
            reject(err);
          } else {
            try {
              body = JSON.parse(body);
              if (body.flag === 1) {
                logger('同步到百川系统成功');
                console.log('时间：', new Date().toString());
                resolve();
              } else {
                logger('同步到百川系统失败!!!', 'red');
                logger(JSON.stringify(body), 'red');
              }
            } catch (e) {
              logger('同步到百川系统失败', 'red');
              reject(body);
            }
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

let sendData = {
  userName: '',
  projectId: packageJson.yangtuo.eventId,
}

;(async function(){  // 兼容低版本node
  await getUserInfo().then((userName)=> {
    sendData.userName = userName
  })
  await packDist()
  await packEvent()
  await send(sendData)
  await removePack()
})()

