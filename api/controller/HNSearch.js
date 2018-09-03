var node = {"children": {}, "queries": {}};

/* transforms 
 2015-08-01 => ["2015", "08", "01"]
 2015-08-01 00:03:43 => ["2015", "08", "01", "00", "03", "43"]
*/
function dateTimeToArray(dateTime) {
	var [date, time] = dateTime.split(" ");
	var dateSplit = date.split("-");
	if (time) {
		return dateSplit.concat(time.split(":"));
	} else {
		return dateSplit;
	}
}

// populates data structure
/*   {
			"children":{
				"2015": {
					"children": {
						"01": {
							"children": {
				
							},
							"queries": {
								"query1": nbOccurrences,
								"query2": nbOccurrences,
								...
							}
						}
					}
					"queries": {
						"query1": nbOccurrences,
						"query2": nbOccurrences,
						...
					}
				}
			}
		}
*/

function populateTreeFromDate(dateTimeArray, query, currentNode) {
	if (dateTimeArray.length == 0) {
		return;
	}
	var t = dateTimeArray.shift();
	if (!currentNode["children"][t]) {
		currentNode["children"][t] = {"children": {}, "queries": {}};
	} 
	currentNode["children"][t]["queries"][query] = (currentNode["children"][t]["queries"][query] | 0) + 1;
	populateTreeFromDate(dateTimeArray, query, currentNode["children"][t]);
}

module.exports.loadHNQueries = function() {
  var fs = require('fs');
  var readline = require('readline');
  var startReadFile = new Date().getTime();
  var rd = readline.createInterface({
      input: fs.createReadStream('./data/hn_logs.tsv'),
      output: process.stdout,
      console: false
  });

  rd.on('close', line => {
  	var endReadFile = new Date().getTime();
		console.log("End readfile. " + (endReadFile - startReadFile) + " ms");
	});

	rd.on('line', line => {
		var [dateTime, query] = line.split("\t");
		populateTreeFromDate(dateTimeToArray(dateTime), query, node);
		
		/* alternate version
			dateTimeToArray(dateTime).reduce((leaf, t) => {
				leaf["children"][t] = leaf["children"][t] || {"children": {}, "queries": {}};
				leaf["children"][t]["queries"][query] = (leaf["children"][t]["queries"][query] | 0) + 1;
				return leaf["children"][t];
			}, node);
		*/
	});
};



module.exports.count = function(req, res) {
	var leaf = dateTimeToArray(req.params.range).reduce((currentNode, currentTimeRange, i, arr) => {
		if (currentTimeRange in currentNode["children"]) {
			return currentNode["children"][currentTimeRange];	
		} else {
			arr.splice(1);
			return null
		}
	}, node);
	if (leaf == null) {
		res.send("No data found");
	} else {
		res.json({"count": Object.keys(leaf["queries"]).length});	
	}
};

module.exports.popular = function(req, res) {
	var leaf = dateTimeToArray(req.params.range).reduce((currentNode, currentTimeRange, i, arr) => {
		if (currentTimeRange in currentNode["children"]) {
			return currentNode["children"][currentTimeRange];	
		} else {
			arr.splice(1);
			return null
		}
	}, node);

	if (leaf == null) {
		res.send("No data found");	
	} else {
		var sortedQueries = Object.entries(leaf["queries"]).sort((a, b) => b[1] - a[1]);
		var popularQueries = [];
		var size = req.query.size;
		for (var i = 0; i < size; i++) {
			popularQueries.push({"query": sortedQueries[i][0], "count": sortedQueries[i][1]});
		}
		res.json({"queries": popularQueries});	
	}
};
