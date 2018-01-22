
const url = require('url')
// const querystring = require('querystring')
// const optFile = require('./modules/optFile')
const resEnd = require('./modules/end')
const OptPool = require('./modules/optPool')

const optPool = new OptPool()
const pool = optPool.getPool()

module.exports = {
  login: (req, res) => {
    let post = ''
    req.on('data', chunk => { // 获取post收到的数据
      post += chunk
    })
    req.on('end', () => {
      post = JSON.parse(post)
      /* 使用promise start */
      
      // promise 链接数据库
      const getConnectionPro = (resolve, reject) => {
        pool.getConnection((err, conn) => {
          resolve(conn)
        })
      }
      // promise 查询数据库
      const queryPro = (conn) => (resolve, reject) => {
        const sql = 'SELECT * from user where uname=? and pwd=?'
        const param = [post.username, post.password]
        conn.query(sql, param, (err, rs) => {
          resolve({ conn: conn, rs: rs })
        })
      }
      // 执行promise队列
      new Promise(getConnectionPro)
        .then(conn => new Promise(queryPro(conn)))
        .then(arg => {
          const rs = arg.rs, conn = arg.conn
          if(rs.length){ // 匹配结果
            resEnd(res, { token: post.username }, { status: 1, msg: '用户名密码匹配，登录成功' })
          } else {
            resEnd(res, {}, { status: 0, msg: '用户名或密码不正确' })
          }
          conn.release(); //放回连接池
        })
        .catch(e => {
          console.log(e)
        })
      /* 使用promise end */

      //执行SQL语句
      /* pool.getConnection((err, conn) => {
        //查询数据库
        const sql = 'SELECT * from user where uname=? and pwd=?'
        conn.query(sql, [post.username, post.password], (err, rs) => { 
          if (err) { 
            console.log('[query] - :' + err)
            return
          }
          if(rs.length){ // 匹配结果
            
            resEnd(res, {token: post.username}, {status: 1, msg: '用户名密码匹配，登录成功'})
          } else {
            resEnd(res, {}, {status: 0, msg: '用户名或密码不正确'})
          }
          conn.release(); //放回连接池
        })
      }) */
    })
  },
  register: (req, res) => {
    let post = ''
    req.on('data', chunk => { // 获取post收到的数据
      post += chunk
    })
    req.on('end', () => {
      post = JSON.parse(post)
      //执行SQL语句 
      pool.getConnection((err, conn) => {
        //查询数据库
        const sql = 'SELECT * from user where uname=?'
        conn.query(sql, [post.username], (err, rs) => { 
          if (err) { 
            console.log('[query] - :' + err)
            return
          }
          if(rs.length){ // 匹配结果
            resEnd(res, {}, {status: 0, msg: '用户名已存在'})
          } else {
            const insert = 'insert into user (uname, pwd) values(?, ?)'
            const param = [post.username, post.password];
            conn.query(insert, param, (err, rs) => {
              if (err) {
                console.log('[insert] - :' + err)
                return
              }
              resEnd(res, {}, {status: 1, msg: '注册成功'})
            })
          }
          conn.release(); //放回连接池
        })
      })
    })
  },
}