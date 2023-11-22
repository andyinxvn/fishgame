var md5Lib = require('md5');
var fs     = require('fs');
var path   = require('path');
var crypto = require('crypto');
 
var manifest = {
	packageUrl: 'https://x29.club/web/go86-remote-asset/',
	remoteManifestUrl: 'https://x29.club/web/go86-remote-asset/project.manifest',
	remoteVersionUrl: 'https://x29.club/web/go86-remote-asset/version.manifest',
	version: '1.0.0',
	assets: {},
	searchPaths: []
};
let oke = false;
const zl = require("zip-lib");
// node version_generator.js -v 1.17.2.30 -u http://168.63.253.67/rvip-update/rvip-remote-asset/ -s rvip-remote-asset/ -d assets/

var dest = './rvip-remote-asset/build/zip';
//var src  = './build/jsb-default/';
var src  = './rvip-remote-asset/build';

// Parse arguments
var i = 2;
while ( i < process.argv.length) {
	var arg = process.argv[i];

	switch (arg) {
	case '--url' :
	case '-u' :
		var url = process.argv[i+1];
		manifest.packageUrl = url;
		manifest.remoteManifestUrl = url + 'project.manifest';
		manifest.remoteVersionUrl = url + 'version.manifest';
		i += 2;
		break;
	case '--version' :
	case '-v' :
		manifest.version = process.argv[i+1];
		i += 2;
		break;
	case '--src' :
	case '-s' :
		src = process.argv[i+1];
		i += 2;
		break;
	case '--dest' :
	case '-d' :
		dest = process.argv[i+1];
		i += 2;
		break;
	default :
		i++;
		break;
	}
}


function copyFileSync(source, target) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    var a = source.split(path.sep);
    a.shift();
    a.shift();
    var f = a.join("/");

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
function readDir (dir, obj) {
	var stat = fs.statSync(dir);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(dir, subpaths[i]);
		
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			 
			readDir(subpath, obj);
		}
		else if (stat.isFile()) {
			// Size in Bytes
			size = stat['size'];
			md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
			compressed = path.extname(subpath).toLowerCase() === '.zip';
		 
			relative = path.relative(dest, subpath);
			relative = relative.replace(/\\/g, '/');
			
			
			if(relative.length > 0){
				if (compressed) {
					obj[relative] = {
						'size' : size,
						'md5' : md5
					};
					obj[relative].compressed = true;
				}else if(path.extname(subpath).toLowerCase() === '.jsc'){
					obj[relative] = {
						'size' : size,
						'md5' : md5
					};
				}
			}
			
		}
	}
}
let count = 0;
function readDirZip (dir, obj,name) {
 
	var stat = fs.statSync(dir);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;

	var zip = null;
	var lists = {};
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(dir, subpaths[i]);
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			
			//var zip = new zl.Zip();
			//zip.addFolder(subpath, subpaths[i]);
			let key = subpaths[i][0];
			if(!lists.hasOwnProperty(key)){
				lists[key] = [];
			}
			lists[key].push([subpath,subpaths[i]]);	
			//count++;			
			// zip.archive(path.join(dest,name+"/"+subpaths[i]+'.zip')).then(function () {
			// 	count--;	
			// }, function (err) {
			// 	console.log(err);
			// });	
		}
		else if (stat.isFile()) {
			// Size in Bytes
			size = stat['size'];
			md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
			compressed = path.extname(subpath).toLowerCase() === '.zip';
			if(!compressed){
				obj[md5Lib(dir)].items.push(subpath);
			}
		}
	}
	console.log(lists);
	for(let i in lists){
		var zip = new zl.Zip();
		for(let j=0; j<lists[i].length;j++){
			zip.addFolder(lists[i][j][0], lists[i][j][1]);
		}
		count++;
		zip.archive(path.join(dest,name+"/"+i+'.zip')).then(function () {
			count--;	
		}, function (err) {
			console.log(err);
		});	
	}
}
 
var mkdirSync = function (path) {
	try {
		fs.mkdirSync(path);
	} catch(e) {
		if ( e.code != 'EEXIST' ) throw e;
	}
}
var zipObject = {};

if (!fs.existsSync(path.join(src, 'zip'))) {
     mkdirSync(path.join(src, 'zip'));
}
if (!fs.existsSync(path.join(src, 'zip/res'))) {
     mkdirSync(path.join(src, 'zip/res'));
}
if (!fs.existsSync(path.join(src, 'zip/res/import'))) {
     mkdirSync(path.join(src, 'zip/res/import'));
}
if (!fs.existsSync(path.join(src, 'zip/res/raw-assets'))) {
     mkdirSync(path.join(src, 'zip/res/raw-assets'));
}

readDirZip(path.join(src,'res/import'),zipObject,'res/import');

readDirZip(path.join(src,'res/raw-assets'),zipObject,'res/raw-assets');
copyFolderRecursiveSync(path.join(src, 'src'),dest);

const zip = new zl.Zip();
console.log(dest+"/project.manifest");
zip.addFile(dest+"/project.manifest", "project.manifest");
count++;
zip.archive(dest+"/project.manifest.zip").then(function () {
    console.log("done");
	count--;
}, function (err) {
    console.log(err);
});
let t = setInterval(function(){
	console.log(count);
	if(count == 0){
		clearInterval(t);
		
		
		readDir(path.join(dest, ''), manifest.assets);
		var destManifest = path.join(src, 'project.manifest');
		var destVersion  = path.join(src, 'version.manifest');

		mkdirSync(dest);


		fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
			if (err) throw err;
			console.log('Manifest successfully generated');
		});

		delete manifest.assets;
		delete manifest.searchPaths;
		fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
			if (err) throw err;
			console.log('Version successfully generated');
		});
	}
},500)

