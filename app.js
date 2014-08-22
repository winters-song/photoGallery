'use strict';

var compress = require('koa-compress'),
		logger = require('koa-logger'),
		serve = require('koa-static'),
		koa = require('koa'),
		path = require('path'),
		router = require('koa-router'),
		koaBody = require('koa-body')({
			formidable : {
				uploadDir: "./public/files",
				keepExtensions: true
			},
			multipart:true
		});

var app = module.exports = koa();


// Logger
app.use(logger());

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

app.use(router(app));

// Route
require('./controllers/index')(app, koaBody);
require('./controllers/user')(app, koaBody);
require('./controllers/photo')(app, koaBody);

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}