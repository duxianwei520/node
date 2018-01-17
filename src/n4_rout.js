var http = require('http');
var url = require('url');
var router = require('./modules/router1');
http.createServer(function (request, response)    {
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  if(request.url !== "/favicon.ico"){
    var  pathname = url.parse(request.url).pathname;
    console.log(pathname);
    pathname = pathname.replace(/\//, '');//替换掉前面的/
    console.log(pathname);
    router[pathname](request,response);
    response.end('');
  }
}).listen(8000);
console.log('Server running at http://127.0.0.1:8000/');  