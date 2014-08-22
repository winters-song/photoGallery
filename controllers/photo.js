'use strict';

var fs = require('fs'),
		path = require('path'),
		cofy = require('cofy'),
		gm = require('gm'),
		spawn = require('co-child-process'),
		monk = require('monk'),
		wrap = require('co-monk'),
		db = monk('localhost/photo_gallery'),
		Photos = wrap(db.get('photos'));

var imageTypes = /(gif|jpe?g|png)$/i;

cofy(gm.prototype);
cofy(gm.prototype.__proto__);

/**
 * generate thumbnails and return image's resolution
 * return:
 * { width: 1920, height: 1080 }
 */
function *handlePhoto(filePath, thumbPath){
	try{
		yield (gm(filePath).gravity("Center").co_thumb)(250, 188, thumbPath, 70);
		var resolution = yield (gm(filePath).co_size)();
		return resolution;
	}catch(e){
		console.log(e);
		return false;
	}
}

/**
 * Retrieve List
 */
function *getList(next) {

	var params = this.request.query;

	// Album Id (no aid means the photo is not in an album)
	var condition = {
		aid : params.aid || ''
	};

	var paging = {
		skip: params.start || 0,
		limit : params.limit || 5,
		sort: { 'upload_time': -1}
	}

	try{
		var list = yield Photos.find(condition, paging);
		this.body = list;

	}catch(e){
		console.log(e);
		this.body = [];
	}
}


/**
 * Upload Photo
 */
function *upload(next) {

	var params = this.request.body;

	var file = params.files.file;

	// validate format
	if(imageTypes.test(file.type)){
			
		var filename = path.basename(file.path);
		var filePath = path.join(__dirname, "../public/files/", filename);
	  var thumbPath = path.join(__dirname, "../public/files/thumb/", filename);

	  var resolution = yield handlePhoto(filePath, thumbPath);

	  if(resolution){

	  	try{
	  		// create a record
				var result = yield Photos.insert({ 
					aid: params.aid || '',
		  		tags: params.tags,
		  		description: params.description,
		  		upload_time: new Date().getTime(),
		  		update_time: new Date().getTime(),
		  		file: '/files/' + filename,
		  		file_path: filePath,
		  		thumb: '/files/thumb/' + filename,
		  		thumb_path: thumbPath,
		  		width: resolution.width,
		  		height: resolution.height
				});

				this.body = result;

			}catch(e){
				console.log(e);
				this.body = "ERROR";	//server error
			}

	  }else{
	  	this.body = "ERROR";
	  }

	} else {
		//remove temp file if the file's format is not allowed
		try{
			fs.unlinkSync(file.path);
		}catch(e){
			console.log(e);
		}
		
    this.body = "Invalid file format";  
	}
}


/**
 * Retrieve record by Id
 */
function *getById(next){

	var params = this.params;

	try{
		var photo = yield Photos.findById(params.id);
		console.log(photo);

		var prev = yield Photos.findOne({
			'upload_time': { $gt: photo.upload_time }
		},{
			sort: {'upload_time' : 1}
		});

		var next = yield Photos.findOne({
			'upload_time': { $lt: photo.upload_time }
		},{
			sort: {'upload_time' : -1}
		});

		if(prev){
			photo.prev = prev._id;
		}
		if(next){
			photo.next = next._id;
		}

		this.body = photo;

	}catch(e){
		console.log(e);
		this.body = 'ERROR';
	}
	
}


module.exports = function(app, koaBody) {

	//Query list
	app.get('/api/photos', koaBody, getList);
	//Upload Image
	app.post('/api/photo', koaBody, upload);
	// One photo and paging info
	app.get('/api/photos/:id', koaBody, getById);

}