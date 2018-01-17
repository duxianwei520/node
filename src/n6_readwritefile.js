const http = require('http');  
const optfile = require('./modules/optfile1');
http.createServer(function  (request,  response)  {
    response.writeHead(200,  {'Content-Type':  'text/html;  charset=utf-8'});
    if(request.url!=="/favicon.ico"){  //清除第2此访问
        console.log('访问');
        response.write('hello,world');
        //optfile.readfile("G:\\www\\nodejs\\one\\models\\aa.txt");
        optfile.readfileSync("./1.txt"); // 读文件
        // optfile.writeFileSync("./1.txt", '121 121'); // 写文件
        response.end('hell,世界');//不写则没有http协议尾
    }
}).listen(8000); 
console.log('Server  running  at  http://127.0.0.1:8000/');  