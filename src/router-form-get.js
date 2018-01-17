const url = require('url')
const querystring = require('querystring')
const optFile = require('./modules/optFile')

module.exports = {
  login: (req, res) => {
    const rdata = url.parse(req.url, true).query
    console.log(rdata)
    if(rdata['email'] != undefined){
      console.log(rdata['email'])
      console.log(rdata['pwd'])
    }
    optFile.readfileSync('./login-get.html', res, recall)
    function recall(data){
      let dataStr = data.toString()
      const arr = ['email', 'pwd']
      res.write(dataStr)
      res.end('') //不写则没有http协议尾
    }
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