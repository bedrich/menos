var less = require("less");
var fs = require("fs");
var manifestFile;

try {
	fs.stat(process.argv[2], function(err, stats) {
		if (err) {
			throw "Manifest files does not exist.";
		} else {
			main(process.argv[2]);
		}
	});
} catch (e) {
	console.log(e);
}

function main (filename) {
	var manifestString = fs.readFileSync(filename, "utf-8");
	var manifestJson = manifestToJson(manifestString);
	
	parseLess(manifestJson);
}

function parseLess (pref) {
	var parser = new (less.Parser);
	var path = pref.global.path;
	var lessFiles = pref.less;
	var lessFile;
	
	for (var filename in lessFiles) {
		lessFile = fs.readFileSync(path + filename, "utf-8");
		cssFile = path + lessFiles[filename];
		
		parser.parse(lessFile, function (err, tree) {
		    if (err) { 
				return console.error(err);
			}
			
			fs.writeFileSync(cssFile, tree.toCSS());
		});
	}
}

function manifestToJson (str) {
	var strArr = str.split('\n');
	var prefs = {};
	var currentPref;
	var trimmed;
	
	for (var i = 0, len = strArr.length; i < len; i++) {
		trimmed = strArr[i].trim();
		
		if (trimmed != '') {
			strArr[i] = trimmed;
		
			if (trimmed.charAt(0) === '[') {
				currentPref = trimmed.substring(1, trimmed.length-1);
				prefs[currentPref] = {};
			} else if (currentPref) {
				var key = trimmed.split('=')[0].trim();
				var val = trimmed.split('=')[1].trim();
			
				prefs[currentPref][key] = val;
			}
		}
	}
	
	return prefs;
}