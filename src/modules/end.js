const resHead = require('./head')

function end(res, data, result){
  resHead(res)
  let resTemplate = {
    data: {},
    msg: '',
    status: 1,
  }
  resTemplate.data = data
  resTemplate.status = result.status
  resTemplate.msg = result.msg
  resTemplate = JSON.stringify(resTemplate)
  res.write(resTemplate)
  res.end('') //不写则没有http协议尾
}

module.exports = end