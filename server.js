var express = require('express');
var apiRouter = require('./api/routes/index');
var app = express();
var port = process.env.PORT || 3000;

var HNSearch = require('./api/controller/HNSearch');

app.listen(port);
app.set('json spaces', 2)
app.use("/", apiRouter);
HNSearch.loadHNQueries();

console.log('RESTful API server started on: ' + port);

