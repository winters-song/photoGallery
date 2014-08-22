'use strict';

var sendfile = require('koa-sendfile');

// Login
function *routeLogin(req, res, next){
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
function *routeHome(req, res, next){
	var stats = yield* sendfile.call(this, './public/index.html');
	if (!this.status) {
		this.throw(404);
	}
}

function *logout(req, res, next){
	this.cookies.set('user', null);
	this.body = { success: true };
}


module.exports = function(app, koaBody) {

	app.get('/login', koaBody, routeLogin);

	app.get('/home', koaBody, routeHome);
	app.get('/photos', koaBody, routeHome);
	app.get('/photos/*', koaBody, routeHome);
	app.get('/albums', koaBody, routeHome);
	app.get('/albums/*', koaBody, routeHome);
	app.get('/album/:aid', koaBody, routeHome);
	app.get('/album/:aid/:id', koaBody, routeHome);
	app.get('/users', koaBody, routeHome);
	app.get('/photo/:id', koaBody, routeHome);
	app.get('/photo/:id/*', koaBody, routeHome);
	
	app.get('/api/logout', koaBody, logout);
}
