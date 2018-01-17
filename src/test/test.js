

2. 编写一个简单的自定义事件处理器
// 1. 具备 on 方法绑定事件
// 2. 具备 off 方法解绑事件
// 3. 注意对 * 的处理
// 4. 尽量考虑在生产环境中可直接使用，而不仅仅是完成题目要求

 function EventEmitter () {
    // TODO
 }


 var emitter = new EventEmitter();

 emitter.on('foo', function(e){
   console.log('listening foo event', e);
 });

 emitter.trigger('foo', {name : 'John'});
 emitter.off('foo');
 emitter.trigger('foo', {name : 'John'});
 
 function handler(args) {
   console.log('listening bar event');
 }
 
 emitter.on('bar', handler);
 emitter.on('bar', function() {
   console.log('other listening bar event');
 });
 emitter.trigger('bar', 'something');
 emitter.off('bar', handler);
 
 emitter.on('*', function(e){
   console.log('listening all events');
 });
 
 emitter.off('*');



 function trans(arg){
  let str = arg.toString()
  const re=/(?=(?!(\b))(\d{3})+$)/g
  str = str.replace(re, "$&,")
  return str
 }
 trans(125545.366)