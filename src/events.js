/*    
Events    
  events.EventEmitter    
    emitter.addListener(event, listener)==on //添加监听    
    emitter.on(event, listener)    
    emitter.once(event, listener)//一次性的监听器    
    emitter.removeListener(event, listener) //删除指定监听    
    emitter.removeAllListeners([event]) //删除所有监听    
    emitter.setMaxListeners(n) //默认情况下当一个事件的监听超过10个时，EventEmitter 将打印警告信息，0表无限制    
    emitter.listeners(event) //返回特定事件的事件监听器集合    
    emitter.emit(event, [arg1], [arg2], [...])  //用提供的参数按顺序执行每个事件监听器。    
*/    
/*   
emitter.on('someEvent', function(arg1, arg2) {   
    console.log('listener2', arg1, arg2);   
});   
emitter.emit('someEvent', 'arg1 参数', 'arg2 参数'); //抛出事件  
*/   
//-------------n16_event.js---------------------------------    
const http = require('http');   
const events = require("events");    
const UserBean = require('./modules/UserBean');  

http.createServer(function  (request,  response){   
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});   
  if(request.url !== "/favicon.ico"){   
    user = new UserBean();   
    user.eventEmit.once('zhuceSuc', function(uname, pwd){ 
      response.write('注册成功'); 
      console.log('传来uname:'+ uname); 
      console.log('传来pwd:'+ pwd); 
      user.login(request,response); 
      response.end(''); 
    });//注册监听   
    user.zhuce(request,  response); 
  }   
}).listen(8000);   
console.log('Server running at http://127.0.0.1:8000/'); 