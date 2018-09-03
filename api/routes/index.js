var express = require('express');
var router = express.Router();
var HNSearch = require('../controller/HNSearch');

router.get('/1/queries/count/:range', HNSearch.count);
router.get('/1/queries/popular/:range', HNSearch.popular);

module.exports = router;
