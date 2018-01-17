const url = require('url')
const querystring = require('querystring')
const optFile = require('./modules/optFile')

module.exports = {
  login: (req, res) => {
    let post = '' // 定义了一个post变量，用于暂存请求体的信息
    let re
    req.on('data', chunk => { //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
      post += chunk
    })
    req.on('end', () => {
      post = querystring.parse(post)
      console.log('email:'+post['email']+'\n');        
      console.log('pwd:'+post['pwd']+'\n');
      const arr = ['email', 'pwd']
      function recall(data){
        // console.log(data)
        let dataStr = data.toString()
        // 正则替换变量 类似于jsp或者PHP一样的套模板
        /* for(var i = 0; i < arr.length; i++){
            re = new RegExp('{'+arr[i]+'}','g'); // /\{name\}/g
            dataStr = dataStr.replace(re, post[arr[i]]);
        } */
        res.write(dataStr)
        res.end('') //不写则没有http协议尾
      }
      // file.readfile('./login.html', recall)
      optFile.readfileSync('./login-post.html', res, recall)
    })
  },
  register: (req, res) => {
    function recall(data){
      res.write(data)
      res.end('')
    }
    optFile.readfile('./register.html', res, recall)
  },
  readImg: (req, res) => {
    optFile.readImg('./1.gif', res)
  },
}