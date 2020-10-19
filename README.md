# vue 百川临时活动



## 项目配置

### 第1步 通过百川临时活动新建项目

拷贝 项目ID以及媒体码

### 第2步 修改package.json
```
 "yangtuo": {
    "eventId": "n584bc6171eecfd3",   // 项目ID
    "extField": {
      "projectName": "vue-test",
      "domain": "wow.liepin.com",
      "event_type": [   // 活动类型（可多选）  促销(1)  促活跃(2)  拉新(3)   其他(4)
        "4"
      ],
      "event_online": "1",   // 线上/线下  (1/2)
      "event_biz": "5",      // 活动对象    B(1)   C(2)   H(3)   校聘(4)    其它(5)
      "mscid": "FaI_SOwh"    // 媒体码
    }
  },
```
yangtuo字段都应该填写，对应百川活动创建表单

`注：projectName非常重要，publish时会直接将工程上传到此项目下，所以不要乱写，如果上传错误，可通过提交历史找回`


## 项目安装
```
npm install
```

### 开发
```
npm run serve
```

### 生成生产文件
```
npm run build
```

### 发布到百川临时活动
```
npm run publish
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



