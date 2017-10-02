const express = require("express");
const multer = require('multer');
const fs = require('fs');
const iconvlite = require('iconv-lite');
const lodash = require('lodash');
const bodyParser = require('body-parser');
const app = express();
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './client/src/snakes/');
	},
	filename: function (req, file, callback) {
		//console.log("file:", file);
		let newFileName = lodash.upperFirst(lodash.toLower(lodash.camelCase(file.originalname.endsWith(".js")
				? file.originalname.substring(0, file.originalname.lastIndexOf(".js"))
				: file.originalname))) + ".js";
		if (newFileName.toLowerCase() === "index.js") {
			newFileName = "noindex.js";
		}
		let filePath = './client/src/snakes/' + newFileName;
		if (fileExists(filePath)) {
			fs.renameSync(filePath, filePath + "_temp");
		}
		callback(null, newFileName);
	}
});

function fileExists(filename) {
	try {
		fs.accessSync(filename);
		return true;
	} catch (e) {
		return false;
	}
}

const upload = multer({storage: storage}).single('snake');
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});
app.use(express.static('public'));
app.use(express.static('snakes'));

// Add headers
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', req.headers.referer.slice(0, -1));
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.post('/api/upload', function (req, res) {
	upload(req, res, function (err) {
		let filePath = './client/src/snakes/' + req.file.filename;
		if (err) {
			res.status(400);
			if (fileExists(filePath + "_temp")) {
				fs.renameSync(filePath + "_temp", filePath + req.file.filename);
			}
			return res.end({message: "Error uploading file." + JSON.stringify(err)});
		}
		const uploaded = readFileSync_encoding('./client/src/snakes/' + req.file.filename, "utf-8");
		if (uploaded.indexOf("export default") === -1) {
			fs.unlinkSync('./client/src/snakes/' + req.file.filename);
			res.status(422);//Unprocessable Entity
			if (fileExists(filePath + "_temp")) {
				fs.renameSync(filePath + "_temp", filePath + req.file.filename);
			}
			return res.send({message: "You are not export your module!!!"});
		}
		if (fileExists(filePath + "_temp")) {
			fs.unlinkSync(filePath + "_temp");
		} else {
			updateSnakesIndex(req.file.filename, true);
		}
		res.send({message: "File is uploaded"});
	});
});

function readFileSync_encoding(filename, encoding) {
	var content = fs.readFileSync(filename);
	return iconvlite.decode(content, encoding);
}

app.post('/api/snakes', function (req, res) {
	fs.readdir("./client/src/snakes/", (err, files) => {
		if (err) {
			return res.end(JSON.stringify({message: "Error /api/snakes"}));
		}
		res.end(JSON.stringify({snakes: files.filter(file => file.toString() !== "index.js").toString()}));
	});
});
app.post('/api/delete', function (req, res) {
	fs.unlink('./client/src/snakes/' + req.body.name + ".js", function (err) {
		if (err) {
			return console.log(err);
		}
		updateSnakesIndex(req.body.name + ".js", false);
		res.end("OK");
	});
});
app.post('/api/save', function (req, res) {
	let date = new Date();
	date.setFullYear(1970);
	date.setMonth(0);
	date.setDate(1);
	let players = req.body.players.map(_ => _.substring(0, 2)).join(".");
	fs.writeFile('./public/games/game' + date.getTime() + "_" + players + '.json', JSON.stringify(req.body), (err) => {
		if (err) {
			return console.log(err);
		}
		console.log("The file was succesfully saved!");
		res.end("OK");
	});
});
app.post('/api/replays', function (req, res) {
	fs.readdir("./public/games/", (err, files) => {
		if (err) {
			return res.end(JSON.stringify({message: "Error /api/replays"}));
		}
		res.end(JSON.stringify({replays: files.toString()}));
	});
});
app.post('/api/replay', function (req, res) {
	const uploaded = readFileSync_encoding('./public/games/' + req.body.name + ".json", "utf-8");
	return res.send({replay: uploaded});
});
app.listen(3001, function () {
	console.log("Working on port 3001");
});

function updateSnakesIndex(newFileName, isAdd) {
	let newPlayerName = newFileName.substring(0, newFileName.lastIndexOf(".js"));
	fs.readdir("./client/src/snakes/", (err, files) => {
		let line = files.filter(file => file.toString() !== "index.js" && file.toString() !== newFileName).map(file => {
			let fileName = file.toString();
			let playerName = fileName.substring(0, fileName.lastIndexOf(".js"));
			return `export { default as ${playerName} } from "./${playerName}";`;
		});
		if (isAdd) {
			line = line.concat(`export { default as ${newPlayerName} } from "./${newPlayerName}";`);
		}
		fs.writeFile("./client/src/snakes/index.js", line.join("\n"), function (err) {
			if (err) {
				return console.log(err);
			}
		});
	});
}