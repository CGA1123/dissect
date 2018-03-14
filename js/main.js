function onDataLoad (data) {
	console.log("Data Loaded...");
	var visualisation = Visualisation("#visualise-it");
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
				var data = JSON.parse(event.target.result);
				onDataLoad(data);
			} catch (e) {
				alert("JSON Parsing Failed!");
				console.log(e);
			}
		}
	};

	reader.readAsText(file);

}

function main () {
	d3.select("#file").on('change', fileSelectHandler, false);
}
