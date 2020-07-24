var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();

app.set('view engine', 'ejs');

let db = new sqlite3.Database('./test2.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

app.get('/', function (req, res) {
	db.all('SELECT * FROM CATEGORY', [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.render("index", {
			data: rows
		});
	});
})

app.get('/all', function (req, res) {
	let bots = [];
	let chan = [];
	db.all('SELECT * FROM BOTS', [], (err1, result1) => {
		if (err1) {
			throw err1;
		}
		bots = result1;
		db.all('SELECT * FROM ANNOUNCEMENT', [], (err2, result2) => {
			if (err2) {
				throw err2;
			}
			chan = result2;
			res.render("all", {
				bots: bots,
				channels: chan
			});
		});
	});
})

app.get('/submit', function (req, res) {
	res.render('submit');
});

app.get('/category/:cat', function (req, res) {
	let bots = [];
	db.all(`SELECT *FROM BOTS WHERE CATEGORY='${req.params.cat}'`, [], (err, result) => {
		if (err) {
			throw err;
		}
		bots = result;
		if (bots.length < 1) {
			res.render("404");
		} else {
			res.render('category', {
				bots: bots
			});
		}
	});
});

var server = app.listen(8086, function () {
	var host = server.address().address
	var port = server.address().port
   
	console.log("Server listening at http://%s:%s", host, port)
})