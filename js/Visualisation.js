function Visualisation (targetDomElement) {
	// private variable declarations
	var visualisationObject = {};
	var explodedSource;
	var regions;
	var links;
	var rawData;

	var height;
	var width;
	var svg;
	var lineHeight = 14;
	var charWidth = 14;

	// public variable declarations

	// 'constructor'
	function constructor (targetDomElement) {
		height = 350;
		width = 1000;
		svg = d3.select(targetDomElement)
			.append("svg")
			.attr("height", height)
			.attr("width", width)
			.append("text")
			.attr("y", 25);

		return visualisationObject;
	}

	// public function definitions
	visualisationObject.loadAndRender = function (data) {
		console.log("loadAndRender");
		console.log(data);
		explodedSource = tagSource(data.source);
		regions = data.regions
		links = data.links;
		rawData = data;

		render();
	};

	// private function definitions
	function render () {
		// lines
		var hideMe = "/";

		// chars
		var select = svg.selectAll(".char")
			.data(explodedSource);

		var entered = select.enter()
			.append("tspan")
			.classed("char", true)
			.classed("hide", function (d) { return d.data === " "; })
			.text(function (d) { return d.data === " " ? hideMe : d.data; })
			.attr("y", function (d) { return (d.lineNumber * 20) + 25; })
			.attr("x", function (d) { return (d.charPos * 14); });

	}

	function tagSource (explodedSource) {
		var boom = explodedSource.map(function (line, lineNumber) {
			var l = line.map(function (char, charPos) {
				var charObj = {};

				charObj.lineNumber = lineNumber;
				charObj.charPos = charPos;
				charObj.data = char;

				return charObj;
			});

			return l;
		});

		return boom.reduce(function(accumulator, currentValue) {
			return accumulator.concat(currentValue);
  		}, []);
	}

	return constructor(targetDomElement);
}
