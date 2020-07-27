var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();

app.set('view engine', 'ejs');
app.use(express.static("public"));

let db = new sqlite3.Database('./bnc.db', (err) => {
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
    res.render('index', {
      data: rows
    });
  });
})

app.get('/all', function (req, res) {
  let bots = [];
  let chan = [];
  const text = 'Displayed below are all the bots and channels available on both the website and bot.';
  db.all('SELECT * FROM BOTS', [], (err1, result1) => {
    if (err1) {
      throw err1;
    }
    bots = result1;
    console.log('Bots obtained.');
    db.all('SELECT * FROM ANNOUNCEMENT', [], (err2, result2) => {
      if (err2) {
        throw err2;
      }
      chan = result2;
      console.log('Channels obtained.');
      res.render('all', {
        toptxt: text,
        bots: bots,
        channels: chan
      });
    });
  });
})

app.get('/category/:cat*', function (req, res) {
  let cat = req.params.cat;
  if (req.params.cat == 'Halls') {
    cat = 'Halls/Residential Colleges';
  }
  let bots = [];
  let chan = [];
  const text = `Listed below are the bots and channels available in ${cat}.`;
  db.all(`SELECT * FROM BOTS WHERE CATEGORY='${cat}'`, [], (err, result1) => {
    if (err) {
      throw err;
    }
  bots = result1;
    console.log('Bots obtained.');
    db.all(`SELECT * FROM ANNOUNCEMENT WHERE CATEGORY='${cat}'`, [], (err2, result2) => {
      if (err2) {
        throw err2;
      }
      chan = result2;
      console.log('Channels obtained.');
      if (bots.length + chan.length < 1) {
        res.render('404');
      } else {
        res.render('all', {
          toptxt: text,
          bots: bots,
          channels: chan
        });
      }
    });
  });
});

app.get('/submit', function (req, res) {
  res.render('submit');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('*', function (req, res) {
  res.render('404');
});

var server = app.listen(process.env.PORT || 8086, function () {
  var host = server.address().address;
  var port = server.address().port;
   
  console.log('Server listening at http://%s:%s', host, port);
})
