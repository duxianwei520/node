// import { connect } from 'tls';

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test',
  port: '3306'
})

// 建立连接
connection.connect(err => {
  if(err){
    console.log(`[query]${err}`)
  }
  console.log('建立连接')
})

//----插入
const userAddSql = 'insert into user (uname, pwd) values(?, ?)';
const param = ['dupi', '123456'];
connection.query(userAddSql,param,function(err,rs){
  if(err){
    console.log('insert err:', err.message);
    return;
  }
  console.log('insert success');
});

//执行查询  
const querySql = 'SELECT * from user where uid=?'
connection.query(querySql, [2], function(err, rs) {  
  if (err) {  
      console.log('[query] - :'+err);  
      return;  
  } 
  for(const i = 0; i < rs.length; i++){
      console.log('The solution is: ', rs[i].uname); 
  }
});  

// 连接关闭
connection.end(err => {
  if(err){
    console.log(`${err.toString()}`)
  }
  console.log('连接关闭')
})