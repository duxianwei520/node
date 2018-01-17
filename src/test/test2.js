
var BigInt = function (str) {
  // your code here
  this.s = str
};

BigInt.prototype.plus = function (bigint) {
  // your code here
  // console.log(this, bigint)
  var res='', c=0;
  a = this.s.split('');
  b = bigint.s.split('');
  while (a.length || b.length || c){
      c += ~~a.pop() + ~~b.pop();
      res = c % 10 + res;
      c = c>9;
  }
  console.log(res.replace(/^0+/,''))
  return res.replace(/^0+/,'');
};

BigInt.prototype.toString = function () {
// your code here
};

var bigint1 = new BigInt('1234232453525454546445458814343421545454545454');
var bigint2 = new BigInt('1234232453525454546445459914343421536654545450');

console.log(bigint1.plus(bigint2));