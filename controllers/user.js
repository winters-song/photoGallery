'use strict';

var crypto = require('crypto'),
		monk = require('monk'),
		wrap = require('co-monk'),
		db = monk('localhost/photo_gallery'),
		Users = wrap(db.get('users'));

function encrypt(str){
	var hash = crypto.createHash("md5");
	hash.update(new Buffer(""+str, "binary"));
	return hash.digest('hex');
}


function *login(req, res, next) {

	var params = this.request.body;
	// console.log(params);

	if(params.username && params.password){

		try{
			var user = yield Users.findOne({
				name: params.username,
				password : encrypt(params.password)
			});

			if(user){
				// console.log(user);
				var str = JSON.stringify(user);
				this.cookies.set('user', str, { maxAge: 60*60*1000 });

				this.body = { success : true };
			}else{
				this.body = { success : false, error_code: 2 };	//username or password is wrong
			}

		}catch(e){
			console.log(e);
			this.body = { success : false, error_code: 1 };	//server error
		}

	}else{
		this.body = { success : false, error_code: 3 };	// username or password is blank
	}
}

// create admin account
function *initAdmin(req, res, next) {

	try{
		var result = yield Users.insert({ 
			name: 'admin', 
			password : encrypt('123123'),
			root: true,
			creatable: true,
			editable: true,
			removable: true
		});

		this.body = {success: true };
	}catch(e){
		console.log(e);
		this.body = {success: false, error_code: 1 };	//server error
	}

}

function *checkLogin(req, res, next){
	var str = this.cookies.get('user');
	if(str){
		var user = JSON.parse(str);
		user.password = undefined;
		user.success = true;

		this.body = user;
	}else{
		this.body = { success: false };
	}
}


module.exports = function(app, koaBody) {

	// Login
	app.post('/api/login', koaBody, login);

	app.get('/api/db', koaBody, initAdmin);

	app.get('/api/checkLogin', koaBody, checkLogin);

/*
	app.post('/api/users', function(req, res, next) {

  	User.find({
  		name: req.body.name
  	}, function(err, users) {
			if (err) {
				console.log("请求用户列表失败：" + err);
			}

			if(users.length){
				return res.send("用户名已被使用！");
			}

			var password = encrypt(req.body.password);

			var user = new User({
	  		name: req.body.name,
	  		password: password
	  	});

			user.save(function(err) {
				if (!err) {
					// console.log('创建账号 : ' + category.title);
					return res.send(user);

				} else {

					console.log("创建账号失败");
					console.log(err);
					return res.send("创建账号失败！");
				}
			});
			
		});

	});


	app.put('/api/password/:id', function(req, res, next) {

		return User.findById(req.params.id, function(err, user) {
		
		  user.password = encrypt(req.body.password);

  			return user.save(function(err) {
  				if (!err) {
  					// console.log('更新作品类型成功：' + category.title);
  					return res.send({ success : true });

  				} else {
  					console.log('更新密码失败');
  					console.log(err);
  					return res.send('更新密码失败');
  				}
  				
  			});
		});

	});

	// Retrieve
	app.get('/api/users', function(req, res, next) {

		// console.log('请求用户列表');
		User.find({}, function(err, users) {
			if (err) {

				console.log("请求用户列表失败：" + err);
				return res.send('请求用户列表失败');
			}

			return res.send(users);
		});
	});


	// Update
	app.put('/api/users/:id', function(req, res, next) {

		return User.findById(req.params.id, function(err, user) {
			
			user.creatable = req.body.creatable;
			user.editable = req.body.editable;
			user.deletable = req.body.deletable;

			return user.save(function(err) {
				if (!err) {
					// console.log('更新作品类型成功：' + category.title);
					return res.send(user);

				} else {
					console.log('更新作品类型失败');
					console.log(err);
					return res.send('更新作品类型失败');
				}
				
			});
		});
	});


	app.delete('/api/users/:id', function(req, res, next) {

	  return User.findById(req.params.id, function(err, user) {
	  
	    return user.remove(function(err) {
	      if (!err) {
	      	// return res.send('c123');
	        return res.send({success: true});

	      } else {

	      	console.log('删除账号失败：' + err);
	      	return res.send('删除账号失败');
	      	
	      }
	    });
	  });
	});
*/
}