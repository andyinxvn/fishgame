const compress_images = require("compress-images");
var path = require('path');
var fs = require('fs');
const isImage = require('is-image');
var src = 'build/jsb-link';
var dest = 'rvip-remote-asset/build';

var i = 2;
var zip = false;
while ( i < process.argv.length) {
	var arg = process.argv[i];

	switch (arg) {
	case '--zip' :
	case '-z' :
		zip = process.argv[i+1] == true;
		i += 2;
		break;
	default :
		i++;
		break;
	}
}

console.log("zip:"+zip)
let Images = []; 
let Inoge = {'be7c7909-5515-42eb-bcb2-a93d1435303a.png':1};
function copyFileSync(source, target) {
    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    var a = source.split(path.sep);
	var isImageFile = isImage(a.join("/")); 
	var _file = a.join("/");
	var file_name = a[a.length-1];
 
    a.shift();
    a.shift();
	
    var f = a.join("/");
	a.pop();
	var ff = a.join("/");
	if(isImageFile){
		
		if(zip == false || Inoge.hasOwnProperty(file_name)){
			console.log(file_name);
			fs.writeFileSync(targetFile, fs.readFileSync(source));
		}else{
			Images.push({copy:[targetFile,source],compress_images:[_file,dest+'/'+ff+"/"]});
		}
	}else{
		fs.writeFileSync(targetFile, fs.readFileSync(source));
	}
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
var mkdirSync = function (path) {
	try {
		fs.mkdirSync(path);
	} catch (e) {
		if (e.code != 'EEXIST') throw e;
	}
}
var removeDir = function (dirPath) {

	if (!fs.existsSync(dirPath)) {
		return;
	}
	var list = fs.readdirSync(dirPath);
	for (var i = 0; i < list.length; i++) {
		var filename = path.join(dirPath, list[i]);
		var stat = fs.statSync(filename);

		if (filename == "." || filename == "..") {
			// do nothing for current and parent dir
		} else if (stat.isDirectory()) {
			removeDir(filename);
		} else {
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dirPath);
};


removeDir(dest+"/src");
removeDir(dest+"/res");

copyFolderRecursiveSync(path.join(src, 'src'), dest);
copyFolderRecursiveSync(path.join(src, 'res'), dest);
let oke = true;
function action(i){
	let index = i;
	compress_images(
		Images[index].compress_images[0],
		Images[index].compress_images[1],
		{ compress_force: false, statistic: true, autoupdate: true },
		false,
		{ jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
		{ png: { engine: "pngquant", command: ["--quality=15-30", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{
		  gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
		},
		function (err, completed,statistic) {
			if(err == null && completed){
				 console.log("-------A"+index+"AA------");
				 console.log(statistic);
				 if( statistic.percent < 0){
					 console.log(Images[index].copy[0]);
					 fs.unlinkSync(Images[index].copy[0]);
					 fs.writeFileSync(Images[index].copy[0], fs.readFileSync(Images[index].copy[1]));
				 }
				  console.log("-------B"+index+"B------");
			}else{
				 console.log("-------A"+index+"AA------");
				fs.writeFileSync(Images[index].copy[0], fs.readFileSync(Images[index].copy[1]));
			}
		}
	  );
}
 
for(let i=0;i<Images.length;i++){
	console.log(i); 
	action(i);	
}