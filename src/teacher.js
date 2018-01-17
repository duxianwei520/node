const User = require('./user')

function Teacher(id, name, age){
  User.apply(this, [id, name, age])
  this.teach = (res) => {
    res.write(this.name + '老师')
  }
}

module.exports = Teacher