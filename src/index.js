const http = require('http')
const url = require('url')
// const func = require('./func')
// const User = require('./user')
// const Teacher = require('./Teacher')

const router = require('./router')
// const router = require('./router-form-get')
// const router = require('./router-form-post')

http.createServer((req, res) => {
  if(req.url !== '/favicon.ico'){
    let pathname = url.parse(req.url).pathname    
    pathname = pathname.replace(/\//,'').replace(/\.json/,'');//替换掉前面的/
    // console.log(pathname)
    try{
      router[pathname](req, res)
    } 
    catch(err) {
      console.log(err)
      console.log(typeof err)
      res.write('404')
      res.end('')
    }
  }
}).listen(8000, () => console.log('server is listern 8000'))
