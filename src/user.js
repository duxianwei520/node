function User(id, name, age){
  this.id = id
  this.name = name
  this.age = age
  this.enter = () => {
    console.log('我是' + this.name)
  }
}

module.exports = User



// create table user(  
//   uid int not null primary key auto_increment,  
//   uname varChar(100) not null,  
//   pwd varChar(100) not null   
// )ENGINE=InnoDB DEFAULT CHARSET=utf8;
