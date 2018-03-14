function loadData (callback) {
	d3.json("examples/fn_let_example.viz.json", callback);
}

function onDataLoad (error, data) {
	if (error) throw error;
	console.log("Data Loaded...");
	var visualisation = Visualisation("#visualise-it");
	visualisation.loadAndRender(data);
}

function main () {
	loadData(onDataLoad);
}
