(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var CHART = { width: 600, height: 330, left: 48, right: 15, top: 15, bottom: 56 };

  var wakeInput = document.getElementById("wake-time");
  var nowInput = document.getElementById("current-time");
  var sleptInput = document.getElementById("hours-slept");
  var resultBox = document.getElementById("result");
  var chartBox = document.getElementById("chart");

  function pad(number) {
    return (number < 10 ? "0" : "") + number;
  }

  function parseTime(text) {
    var parts = text.split(":");
    if (parts.length !== 2) return null;
    return Number(parts[0]) + Number(parts[1]) / 60;
  }

  function formatClock(hourValue) {
    var totalMinutes = Math.round(hourValue * 60) % (24 * 60);
    return pad(Math.floor(totalMinutes / 60)) + ":" + pad(totalMinutes % 60);
  }

  function describePressure(pressure) {
    if (pressure < 0.35) return "low";
    if (pressure < 0.6) return "moderate";
    return "high";
  }

  function describeBodyClock(bodyClock) {
    if (bodyClock < -0.5) return "near its daily low";
    if (bodyClock > 0.5) return "near its daily high";
    return "in a middle range";
  }

  function svgElement(name, attributes) {
    var element = document.createElementNS(SVG_NS, name);
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
    return element;
  }

  function drawChart(hoursSlept, wakeHour, hoursAwake, score) {
    var plotWidth = CHART.width - CHART.left - CHART.right;
    var plotHeight = CHART.height - CHART.top - CHART.bottom;
    function x(hours) { return CHART.left + (hours / 24) * plotWidth; }
    function y(value) { return CHART.top + (1 - value / 100) * plotHeight; }

    var svg = svgElement("svg", {
      "class": "chart",
      viewBox: "0 0 " + CHART.width + " " + CHART.height,
      role: "img",
      "aria-label": "Line chart of predicted alertness from 0 to 100 over the 24 hours after waking. The marker shows the current score of " + score + "."
    });

    [0, 50, 100].forEach(function (value) {
      svg.appendChild(svgElement("line", { "class": "chart-grid", x1: CHART.left, x2: CHART.width - CHART.right, y1: y(value), y2: y(value) }));
      var text = svgElement("text", { x: CHART.left - 6, y: y(value) + 4, "text-anchor": "end" });
      text.textContent = value;
      svg.appendChild(text);
    });

    for (var hours = 0; hours <= 24; hours += 4) {
      var tick = svgElement("text", { x: x(hours), y: CHART.height - 32, "text-anchor": "middle" });
      tick.textContent = formatClock(wakeHour + hours);
      svg.appendChild(tick);
    }
    var axisTitle = svgElement("text", { x: CHART.left + plotWidth / 2, y: CHART.height - 8, "text-anchor": "middle" });
    axisTitle.textContent = "Time of day (if you stay awake)";
    svg.appendChild(axisTitle);

    var path = FatigueModel.curve(hoursSlept, wakeHour, 0.25).map(function (point, index) {
      return (index === 0 ? "M" : "L") + x(point.hoursAwake).toFixed(1) + " " + y(point.score).toFixed(1);
    }).join(" ");
    svg.appendChild(svgElement("path", { "class": "chart-line", d: path }));
    svg.appendChild(svgElement("circle", { "class": "chart-marker", cx: x(hoursAwake), cy: y(score), r: 6 }));

    chartBox.innerHTML = "";
    chartBox.appendChild(svg);
  }

  function showMessage(text) {
    resultBox.textContent = text;
    chartBox.innerHTML = "";
  }

  function update() {
    var wakeHour = parseTime(wakeInput.value);
    var nowHour = parseTime(nowInput.value);
    var hoursSlept = sleptInput.value === "" ? NaN : Number(sleptInput.value);

    if (wakeHour === null || nowHour === null || isNaN(hoursSlept) || hoursSlept < 0 || hoursSlept > 16) {
      showMessage("Enter a wake-up time, the current time, and hours slept (0 to 16).");
      return;
    }

    var hoursAwake = FatigueModel.hoursSince(wakeHour, nowHour);
    var result = FatigueModel.alertness(hoursSlept, wakeHour, hoursAwake);

    resultBox.innerHTML = "";
    var score = document.createElement("p");
    score.className = "result-score";
    score.textContent = result.score + " / 100 — " + FatigueModel.label(result.score);
    var explanation = document.createElement("p");
    explanation.textContent =
      "You have been awake for " + hoursAwake.toFixed(1) + " hours after sleeping " + hoursSlept + " hours, " +
      "so your sleep pressure (the tiredness that builds up the longer you are awake) is " + describePressure(result.pressure) + ". " +
      "At " + formatClock(nowHour) + " your body clock (your natural daily rhythm of alertness) is " + describeBodyClock(result.bodyClock) + ".";
    resultBox.appendChild(score);
    resultBox.appendChild(explanation);

    drawChart(hoursSlept, wakeHour, hoursAwake, result.score);
  }

  var now = new Date();
  nowInput.value = pad(now.getHours()) + ":" + pad(now.getMinutes());
  [wakeInput, nowInput, sleptInput].forEach(function (input) {
    input.addEventListener("input", update);
  });
  update();
})();
