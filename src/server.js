'use strict';
var _express = require('express');
var _connector = require('./connector');

let app = _express();
let connector = new _connector.default();



app.get('/run/:appId', async function(req, res) {
  try {
    console.log(req.params.appId);
    res.send(await connector.run(req.params.appId));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/locations/:filter', async function(req, res) {
    try {
        console.log(req.params.filter);
        res.send(await connector.locations(req.params.filter));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/status/:testId', async function(req, res) {
    try {
        console.log(req.params.testId);
        res.send(await connector.status(req.params.testId));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/results/:testId', async function(req, res) {
    try {
        console.log(req.params.testId);
        res.send(await connector.results(req.params.testId));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/finish', async function(req, res) {
    try {
        console.log(req.params.id);
        res.send(await connector.results(req.params.id));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(9000, function() {
  console.log('Server listening on port 9000');
});
