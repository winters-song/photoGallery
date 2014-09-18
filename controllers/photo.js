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
		yield (gm(filePath).gravity("Center").co_thumb)(280, 280, thumbPath, 70);
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
		  		name: params.fields.name,
		  		tags: params.fields.tags,
		  		description: params.fields.description,
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
 * Update Photo
 */
function *update(next) {

	var id = this.params.id;
	var params = this.request.body;

	if(params.files){

		var file = params.files.file;

		// validate format
		if(imageTypes.test(file.type)){

			try{
					
				var filename = path.basename(file.path);
				var filePath = path.join(__dirname, "../public/files/", filename);
			  var thumbPath = path.join(__dirname, "../public/files/thumb/", filename);

			  var resolution = yield handlePhoto(filePath, thumbPath);

			  if(resolution){

			  	yield removePhoto(id);

			  	var cfg = {
			  		name: params.fields.name,
			  		tags: params.fields.tags,
			  		description: params.fields.description,
			  		update_time: new Date().getTime(),
			  		file: '/files/' + filename,
			  		file_path: filePath,
			  		thumb: '/files/thumb/' + filename,
			  		thumb_path: thumbPath,
			  		width: resolution.width,
			  		height: resolution.height
			  	}

		  		// create a record
					yield Photos.update({
						_id: id
					},{ 
						$set: cfg
					});

					this.body = cfg;

			  }else{
			  	this.body = "error";
			  }
				
			}catch(e){
				console.log(e);
				this.body = "error";
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
	}else {

		this.body = "Image didn't change"; 
	}
}

/**
 * Retrieve record by Id
 */
function *getById(next){

	var id = this.params.id;

	try{
		var photo = yield Photos.findById(id);
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


/**
 * Retrieve record by Id
 */
function *remove(next){

	var id = this.params.id;

	try{
		yield removePhoto(id);

		yield Photos.remove({ _id: id});

		this.body = {success: true};
		
	}catch(e){
		console.log(e);
		this.body = {success: false};
	}	
}

/**
 * Delete photo and it's thumbnail
 */
function *removePhoto(id){
	try{
		var photo = yield Photos.findById(id);
		if(photo){
			fs.unlinkSync(photo.file_path);
			fs.unlinkSync(photo.thumb_path);
		}
	}catch(e){
		console.log(e);
	}
}


module.exports = function(app, koaBody) {

	//Query list
	app.get('/api/photos', koaBody, getList);

	//Upload Photo
	app.post('/api/photo', koaBody, upload);

	// Retrieve Photo 
	app.get('/api/photo/:id', koaBody, getById);
	//Update Photo
	app.put('/api/photo/:id', koaBody, update);
	//Remove Photo
	app.del('/api/photo/:id', koaBody, remove);

}