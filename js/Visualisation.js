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
	var text;
	var highlight;
	var lineHeight = 14;
	var charWidth = 14;

	// public variable declarations

	// 'constructor'
	function constructor (targetDomElement) {
		height = "100%";
		width = "100%";

		svg = d3.select(targetDomElement)
			.append("svg")
			.attr("height", height)
			.attr("width", width);

		highlight = svg.append("g");
		text = svg.append("text");

		return visualisationObject;
	}

	// public function definitions
	visualisationObject.loadAndRender = function (data) {
		explodedSource = tagSource(data.source);
		regions = processRegions(data.regions);
		links = data.links;
		rawData = data;

		render();
	};

	// private function definitions
	function render () {
		// regions
		var regionsSelect = highlight.selectAll(".highlight")
			.data(regions);

		var enterRegion = regionsSelect.enter()
			.append("rect")
			.classed("highlight", true)
			.attr("fill", function (d) { return d.color;  })
			.attr("height", 18)
			.attr("width", 14)
			.attr("x", function (d) { return d.x; })
			.attr("y", function (d) { return d.y; });

		// chars
		var chars = text.selectAll(".char")
			.data(explodedSource);

		var entered = chars.enter()
			.append("tspan")
			.classed("char", true)
			.text(function (d) { return d.data; })
			.attr("y", function (d) { return (d.lineNumber * 20) + 14; })
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

	function expandRegion (region) {
		var fromLine = region.region.fromLine;
		var toLine = region.region.toLine;
		var fromChar = region.region.fromColumn;
		var toChar = region.region.toColumn;
		var regions = [];
		// TODO: what about region that span multiple lines?
		// -> is that even possible?
		// -> Assume regions are only 1 line for the moment...
		for (var i = fromChar; i <= toChar; i++) {
			var r = {};
			r.x = (i * 14) - 2;
			r.y = (fromLine * 20);
			r.color = region.color;
			r.type = region.type;

			regions.push(r);
		}

		return regions;
	}

	function processRegions (regions) {
		var newRegions = regions.map(function (region) {
			return expandRegion(region);
		});

		return newRegions.reduce(function (accumulator, currentValue) {
			return accumulator.concat(currentValue);
		}, []);
	}

	return constructor(targetDomElement);
}
