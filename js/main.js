function loadData () {
	d3.json ("examples/fn_example.viz.json", function (error, data) {
		if (error) throw error;
		console.log(data);
		loadData.onloadend ();
	});
}

function onDataLoad () {
	console.log("Data Loaded...");
}

function main () {
	loadData.onloadend = onDataLoad;
	loadData ();
}
