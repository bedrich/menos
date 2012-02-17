var less = require("less");
var fs = require("fs");

fs.stat(process.argv[2], function(err, stats) {
	if (err) {
		console.error("\n\"" + process.argv[2] + "\" was not found.\n\n", err);
	} else {
		main(process.argv[2]);
	}
});

function main (filename) {
	var manifest;
	
	try {
		manifest = JSON.parse(fs.readFileSync(filename, "utf-8"));
	} catch (e) {
		console.error(e);
	}
	
	parseLess(manifest.lesspath, manifest.csspath, manifest.less, manifest.compress);
}

function parseLess (lessPath, cssPath, lessFiles, compress) {
	var parser = new (less.Parser)({
		paths: [lessPath]
	});
	var iFiles = lessFiles.length;
	var opts = { compress: compress ? true : false };
	var lessFile;
	var files;
	
	while (iFiles--) {
		files = lessFiles[iFiles].split(':');
		lessFile = fs.readFileSync(lessPath + files[0], "utf-8");
		
		parser.parse(lessFile, function (err, tree) {
		    if (err) { 
				return console.error(err);
			} else {
				fs.writeFileSync(cssPath + files[1], tree.toCSS(opts));
			}
		});
	}
}