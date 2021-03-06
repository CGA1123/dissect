function onDataLoad (data) {
	console.log("Data Loaded...");
	visualisation.loadAndRender(data);
}


function fileSelectHandler () {
	var event = d3.event;
	var file = event.target.files[0]

	if (!file) return;

	var reader = new FileReader();

	reader.onloadend = function (event) {
		if (event.target.readyState === FileReader.DONE) {
			try {
				var data = JSON.parse(event.target.result).data;
				onDataLoad(data);
			} catch (e) {
				if (e instanceof SyntaxError) alert("JSON Parsing Failed!");
				console.log(e);
			}
		}
	};

	reader.readAsText(file);

}

function main () {
	visualisation = Visualisation("#visualise-it");
	d3.select("#file").on('change', fileSelectHandler, false);
}
