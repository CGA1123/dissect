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
	var fontSize;
	var lineHeight;

	// public variable declarations

	// 'constructor'
	function constructor (targetDomElement) {
		height = "100%";
		width = "100%";
		fontSize = 14;
		lineHeight = 20;

		svg = d3.select(targetDomElement)
			.append("svg")
			.attr("height", height)
			.attr("width", width);

		highlight = svg.append("g");
		text = svg.append("text");
		edges = svg.append("g");

		return visualisationObject;
	}

	// public function definitions
	visualisationObject.loadAndRender = function (data) {
		explodedSource = processSource(data.source);
		regions = processRegions(data.regions);
		links = processLinks(data.links);
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
			.classed("highlight", true);

		regionsSelect.merge(enterRegion)
			.transition()
			.duration(500)
			.attr("fill", function (d) { return d.color;  })
			.attr("height", fontSize + 4)
			.attr("width", fontSize)
			.attr("x", function (d) { return d.x; })
			.attr("y", function (d) { return d.y; });

		regionsSelect.exit()
			.remove();

		// chars
		var chars = text.selectAll(".char")
			.data(explodedSource);

		var entered = chars.enter()
			.append("tspan")
			.classed("char", true);

		chars.merge(entered)
			.transition()
			.duration(500)
			.text(function (d) { return d.data; })
			.attr("y", function (d) { return (d.lineNumber * lineHeight) + fontSize; })
			.attr("x", function (d) { return (d.charPos * fontSize); });

		chars.exit()
			.remove();

		var linksSelect = edges.selectAll(".edge")
			.data(links);

		var enteredLinks = linksSelect.enter()
			.append("line")
			.classed("edge", true);

		linksSelect.merge(enteredLinks)
			.transition()
			.duration(500)
			.attr("x1", function (d) { return d.x1 + 5; })
			.attr("y1", function (d) { return d.y1; })
			.attr("x2", function (d) { return d.x2 + 5; })
			.attr("y2", function (d) { return d.y2; })
			.attr("stroke-width", 2)
			.attr("stroke", "pink");

		linksSelect.exit()
			.remove();
	}

	function processSource (explodedSource) {
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
			r.x = (i * fontSize) - 2;
			r.y = (fromLine * lineHeight);
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

	function sameRegion(a,b) {
		return (a.fromLine === b.fromLine) &&
			(a.toLine === b.toLine) &&
			(a.fromColumn === b.fromColumn) &&
			(a.toColumn === b.toColumn);
	}

	function posFromRegion(region) {
		return {
			x: ((region.fromColumn + ((region.toColumn - region.fromColumn) / 2)) * fontSize),
			y: (region.fromLine) * lineHeight
		}
	}

	function processLinks (links) {
		var bindings = links.reduce(function(result, element) {
			var pos = posFromRegion(element.bind.region);
			var accPos = posFromRegion(element.access.region);
			var acc = {
				x1: pos.x,
				y1: pos.y,
				x2: accPos.x,
				y2: accPos.y,

			}

			result.push(acc);

			return result;
		}, []);

		return bindings;
	}

	return constructor(targetDomElement);
}
