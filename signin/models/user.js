var bcrypt = require('bcryptjs');
var debug = require('debug')('signin:user');
var mongo = require('mongodb').MongoClient;
var mongourl = "mongodb://localhost:27017/signin";

var users;  

mongo.connect(mongourl,{useNewUrlParser: true})
.catch(function(error) {
  	debug("Connect to mongodb"+mongourl+" was failed with error: ",error);
})
.then(function(db) {
	var dbo = db.db('singin')
	users = dbo.collection('users');
  	console.log("create db success");
});

exports.findUser = function(username, password) {
	return users.findOne({username: username})
	.then(function(user) {
		return user ? bcrypt.compare(password, user.password)
		.then(function(res) {if(res) return user; else return Promise.reject('错误的用户名或者密码');}) 
		: Promise.reject('错误的用户名或者密码');
	});
}


 
exports.createUser = function(user) {
	return bcrypt.hash(user.password, 5).then(function(hash) {
		delete user.repeatpsassword;
		user.password = hash;
		return users.insert(user);
	});
}

exports.checkUser = function(user) {
	return new Promise(function(reslove, reject) {
	  var error = {}
	  users.findOne({ username: user.username }).then(function(user) {
		  if(user) {
			  error.username = '用户名已存在';
		  }
	  })
	  users.findOne({ sid: user.sid }).then(function(user){
		if (user) error.sid = '学号已被注册'
	  })
	  users.findOne({ phone: user.phone }).then(function(user){
		if (user) error.phone = '电话已被注册'
	  })
	  users.findOne({ email: user.email }).then(function(user){
		if (user) error.email = '邮箱已被注册'
	  }).then(function(){
		if (Object.keys(error).length) {
		  reject(error)
		} else {
		  reslove(user)
		}
	  })
  
	})
  
}
  