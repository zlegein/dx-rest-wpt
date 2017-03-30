'use strict';
var _express = require('express');
var _connector = require('./connector');

let app = _express();
let connector = new _connector.default();



app.get('/run/:commit', async function(req, res) {
  try {
    res.send(await connector.run(req.query.appId, req.params.commit));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/locations/:filter', async function(req, res) {
    try {
        res.send(await connector.locations(req.params.filter));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/status/:testId', async function(req, res) {
    try {
        res.send(await connector.status(req.params.testId));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/results/:testId/:commit', async function(req, res) {
    try {
        res.send(await connector.results(req.params.testId, req.params.commit));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/results/:commit', async function(req, res) {
    try {
        res.send(await connector.results(req.query.id, req.params.commit));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/tag/:testId/:commit', async function(req, res) {
    try {
        res.send(await connector.tag(req.params.testId, req.params.commit));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(9000, function() {
  console.log('Server listening on port 9000');
});
