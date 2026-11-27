(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var SIZE = { width: 600, height: 330, left: 56, right: 32, top: 15, bottom: 56 };
  var MAX_FEET = 45000;
  var CONSCIOUSNESS_MIN_FEET = 20000;
  var CONSCIOUSNESS_MIN_SECONDS = 5;
  var CONSCIOUSNESS_MAX_SECONDS = 1800;

  var slider = document.getElementById("altitude");
  var feetOutput = document.getElementById("altitude-value");
  var resultBox = document.getElementById("result");
  var oxygenChartBox = document.getElementById("oxygen-chart");
  var consciousnessChartBox = document.getElementById("consciousness-chart");

  function formatFeet(feet) {
    return feet.toLocaleString("en-US") + " ft";
  }

  function svgElement(name, attributes) {
    var element = document.createElementNS(SVG_NS, name);
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
    return element;
  }

  function addText(svg, text, attributes) {
    var element = svgElement("text", attributes);
    element.textContent = text;
    svg.appendChild(element);
  }

  // config: box, label, xTitle, xMin, xMax, xTicks, yTicks [{ fraction, label }],
  // points [{ x, fraction }], marker { x, fraction } or null
  function drawChart(config) {
    var plotWidth = SIZE.width - SIZE.left - SIZE.right;
    var plotHeight = SIZE.height - SIZE.top - SIZE.bottom;
    function x(value) { return SIZE.left + ((value - config.xMin) / (config.xMax - config.xMin)) * plotWidth; }
    function y(fraction) { return SIZE.top + (1 - fraction) * plotHeight; }

    var svg = svgElement("svg", {
      "class": "chart",
      viewBox: "0 0 " + SIZE.width + " " + SIZE.height,
      role: "img",
      "aria-label": config.label
    });

    config.yTicks.forEach(function (tick) {
      svg.appendChild(svgElement("line", { "class": "chart-grid", x1: SIZE.left, x2: SIZE.width - SIZE.right, y1: y(tick.fraction), y2: y(tick.fraction) }));
      addText(svg, tick.label, { x: SIZE.left - 6, y: y(tick.fraction) + 5, "text-anchor": "end" });
    });
    config.xTicks.forEach(function (value) {
      addText(svg, value.toLocaleString("en-US"), { x: x(value), y: SIZE.height - 32, "text-anchor": "middle" });
    });
    addText(svg, config.xTitle, { x: SIZE.left + plotWidth / 2, y: SIZE.height - 8, "text-anchor": "middle" });

    var path = config.points.map(function (point, index) {
      return (index === 0 ? "M" : "L") + x(point.x).toFixed(1) + " " + y(point.fraction).toFixed(1);
    }).join(" ");
    svg.appendChild(svgElement("path", { "class": "chart-line", d: path }));

    if (config.marker) {
      svg.appendChild(svgElement("circle", { "class": "chart-marker", cx: x(config.marker.x), cy: y(config.marker.fraction), r: 6 }));
    }

    config.box.innerHTML = "";
    config.box.appendChild(svg);
  }

  function logFraction(seconds) {
    var low = Math.log(CONSCIOUSNESS_MIN_SECONDS);
    var high = Math.log(CONSCIOUSNESS_MAX_SECONDS);
    return (Math.log(seconds) - low) / (high - low);
  }

  function middleSeconds(range) {
    return Math.sqrt(range.shortest * range.longest);
  }

  function drawOxygenChart(feet) {
    var points = [];
    for (var altitude = 0; altitude <= MAX_FEET; altitude += 500) {
      points.push({ x: altitude, fraction: AltitudeModel.oxygenPercentOfSeaLevel(altitude) / 100 });
    }
    drawChart({
      box: oxygenChartBox,
      label: "Line chart of oxygen available as a percentage of sea level, falling from 100 percent at sea level to about 15 percent at 45,000 feet. The marker shows " + formatFeet(feet) + ".",
      xTitle: "Altitude (feet)",
      xMin: 0,
      xMax: MAX_FEET,
      xTicks: [0, 15000, 30000, 45000],
      yTicks: [{ fraction: 0, label: "0%" }, { fraction: 0.5, label: "50%" }, { fraction: 1, label: "100%" }],
      points: points,
      marker: { x: feet, fraction: AltitudeModel.oxygenPercentOfSeaLevel(feet) / 100 }
    });
  }

  function drawConsciousnessChart(feet) {
    var points = [];
    for (var altitude = CONSCIOUSNESS_MIN_FEET; altitude <= MAX_FEET; altitude += 500) {
      points.push({ x: altitude, fraction: logFraction(middleSeconds(AltitudeModel.usefulConsciousness(altitude))) });
    }
    var range = AltitudeModel.usefulConsciousness(feet);
    drawChart({
      box: consciousnessChartBox,
      label: "Line chart of time of useful consciousness, falling from about 30 minutes at 20,000 feet to about 10 seconds at 45,000 feet. " +
        (range ? "The marker shows " + formatFeet(feet) + "." : "The marker is hidden below 20,000 feet."),
      xTitle: "Altitude (feet)",
      xMin: CONSCIOUSNESS_MIN_FEET,
      xMax: MAX_FEET,
      xTicks: [20000, 30000, 40000],
      yTicks: [
        { fraction: logFraction(10), label: "10 s" },
        { fraction: logFraction(60), label: "1 min" },
        { fraction: logFraction(600), label: "10 min" },
        { fraction: logFraction(1800), label: "30 min" }
      ],
      points: points,
      marker: range ? { x: feet, fraction: logFraction(middleSeconds(range)) } : null
    });
  }

  function consciousnessText(feet) {
    var range = AltitudeModel.usefulConsciousness(feet);
    if (!range) {
      return "Not a short-term limit below 20,000 ft. Milder effects can still appear above 10,000 ft.";
    }
    if (feet === CONSCIOUSNESS_MIN_FEET) return "30 minutes or more";
    return "about " + AltitudeModel.formatDuration(range.shortest) + " to " + AltitudeModel.formatDuration(range.longest);
  }

  function addParagraph(parent, text) {
    var paragraph = document.createElement("p");
    paragraph.textContent = text;
    parent.appendChild(paragraph);
  }

  function update() {
    var feet = Number(slider.value);
    feetOutput.textContent = formatFeet(feet);
    slider.setAttribute("aria-valuetext", formatFeet(feet));

    var stage = AltitudeModel.stageAt(feet);
    var oxygen = AltitudeModel.oxygenPercentOfSeaLevel(feet);

    resultBox.innerHTML = "";
    var heading = document.createElement("h2");
    heading.textContent = formatFeet(feet) + " — " + stage.name;
    resultBox.appendChild(heading);

    var facts = document.createElement("ul");
    facts.className = "facts";
    [
      "Air pressure: " + AltitudeModel.pressureKpa(feet).toFixed(1) + " kPa (sea level is 101.3 kPa)",
      "Oxygen available: " + Math.round(oxygen) + "% of sea level",
      "Time of useful consciousness: " + consciousnessText(feet)
    ].forEach(function (text) {
      var item = document.createElement("li");
      item.textContent = text;
      facts.appendChild(item);
    });
    resultBox.appendChild(facts);

    addParagraph(resultBox, "What you may notice: " + stage.symptoms);
    addParagraph(resultBox, "The air is still about 21% oxygen at any height, but it is thinner, so each breath delivers only " +
      Math.round(oxygen) + "% of the oxygen it would at sea level. Time of useful consciousness is how long you can still act sensibly without extra oxygen.");

    drawOxygenChart(feet);
    drawConsciousnessChart(feet);
  }

  slider.addEventListener("input", update);
  update();
})();
