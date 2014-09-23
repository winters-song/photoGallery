'use strict';

var sendfile = require('koa-sendfile');

// Login
function *routeLogin(){
	if(this.cookies.get('user')){
		this.redirect('/');
	}else{
		var stats = yield* sendfile.call(this, './public/login.html');
		if (!this.status) {
			this.throw(404);
		}
	}
}

// SPA - Single Page App routing logic

function *logout(){
	this.cookies.set('user', null);
	this.body = { success: true };
}


module.exports = function(app, koaBody) {

	app.get('/login', koaBody, routeLogin);

	app.get('/home', koaBody, function *(){
		var stats = yield* sendfile.call(this, './public/index.html');
		if (!this.status) {
			this.throw(404);
		}
	});

	app.get('/photos', koaBody, function *(){
		var stats = yield* sendfile.call(this, './public/photos.html');
		if (!this.status) {
			this.throw(404);
		}
	});

	app.get('/photo', koaBody, function *(){
		var stats = yield* sendfile.call(this, './public/photo.html');
		if (!this.status) {
			this.throw(404);
		}
	});
	
	app.get('/api/logout', koaBody, logout);
}
