const OptPool = require('./modules/optPool')

const optPool = new OptPool()
const pool = optPool.getPool()
// console.log(pool)
//执行SQL语句 
pool.getConnection(function(err, conn) {
  const userAddSql = 'insert into user (uname, pwd) values(?, ?)'
  const param = ['aaa', 'aaa']
  conn.query(userAddSql, param, (error, rs) => {
    if(error){
      console.log('insert err: ' + error.message)
      return
    }
    console.log('insert success'); 
    //conn.release(); //放回连接池
  })

  //查询 
  conn.query('SELECT * from user', function(err, rs) { 
    if (err) { 
      console.log('[query] - :' + err); 
      return; 
    }
    for(var i = 0;i < rs.length; i++){
      console.log(rs[i].uname); 
    }
    conn.release(); //放回连接池
  })
})