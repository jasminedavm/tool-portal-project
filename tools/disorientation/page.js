(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var PIXELS_PER_DEGREE = 2.5;

  var picker = document.getElementById("picker");
  var stage = document.getElementById("stage");
  var explanation = document.getElementById("explanation");
  var previousButton = document.getElementById("previous");
  var nextButton = document.getElementById("next");

  var illusionIndex = 0;
  var stepIndex = 0;
  var realIndicator;
  var feltIndicator;

  function svgElement(name, attributes) {
    var element = document.createElementNS(SVG_NS, name);
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
    return element;
  }

  function createIndicator(id, caption) {
    var figure = document.createElement("figure");
    figure.className = "indicator";

    var svg = svgElement("svg", { viewBox: "0 0 200 200", role: "img" });
    var clip = svgElement("clipPath", { id: "clip-" + id });
    clip.appendChild(svgElement("circle", { cx: 100, cy: 100, r: 92 }));
    svg.appendChild(clip);

    var clipped = svgElement("g", { "clip-path": "url(#clip-" + id + ")" });
    var horizon = svgElement("g", { "class": "horizon" });
    horizon.appendChild(svgElement("rect", { "class": "sky", x: -300, y: -300, width: 800, height: 400 }));
    horizon.appendChild(svgElement("rect", { "class": "ground", x: -300, y: 100, width: 800, height: 400 }));
    horizon.appendChild(svgElement("line", { "class": "horizon-line", x1: -300, x2: 500, y1: 100, y2: 100 }));
    [-20, -10, 10, 20].forEach(function (degrees) {
      var y = 100 + degrees * PIXELS_PER_DEGREE;
      var half = Math.abs(degrees) === 10 ? 20 : 30;
      horizon.appendChild(svgElement("line", { "class": "ladder", x1: 100 - half, x2: 100 + half, y1: y, y2: y }));
    });
    clipped.appendChild(horizon);
    svg.appendChild(clipped);

    svg.appendChild(svgElement("circle", { "class": "dial", cx: 100, cy: 100, r: 92 }));
    var planePath = "M45 100 H85 M115 100 H155 M100 100 V100";
    svg.appendChild(svgElement("path", { "class": "plane-outline", d: planePath }));
    svg.appendChild(svgElement("path", { "class": "plane", d: planePath }));

    var label = document.createElement("figcaption");
    label.textContent = caption;
    var reading = document.createElement("span");
    reading.className = "reading";
    label.appendChild(reading);

    figure.appendChild(svg);
    figure.appendChild(label);
    stage.appendChild(figure);
    return { svg: svg, horizon: horizon, reading: reading, caption: caption };
  }

  function showAttitude(indicator, attitude) {
    indicator.horizon.style.transform =
      "rotate(" + -attitude.roll + "deg) translateY(" + attitude.pitch * PIXELS_PER_DEGREE + "px)";
    var text = Illusions.describe(attitude);
    indicator.reading.textContent = text;
    indicator.svg.setAttribute("aria-label", indicator.caption + ": " + text);
  }

  function addParagraph(label, text) {
    var paragraph = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = label + " ";
    paragraph.appendChild(strong);
    paragraph.appendChild(document.createTextNode(text));
    explanation.appendChild(paragraph);
  }

  function render() {
    var illusion = Illusions.list[illusionIndex];
    var step = illusion.steps[stepIndex];

    showAttitude(realIndicator, step.real);
    showAttitude(feltIndicator, step.felt);

    explanation.innerHTML = "";
    var count = document.createElement("p");
    count.className = "step-count";
    count.textContent = illusion.name + " — step " + (stepIndex + 1) + " of " + illusion.steps.length;
    var heading = document.createElement("h2");
    heading.textContent = step.title;
    explanation.appendChild(count);
    explanation.appendChild(heading);
    addParagraph("What the aircraft is doing:", step.happening);
    addParagraph("What the pilot feels:", step.feels);

    previousButton.disabled = stepIndex === 0;
    nextButton.disabled = stepIndex === illusion.steps.length - 1;

    Array.prototype.forEach.call(picker.querySelectorAll("button"), function (button, index) {
      button.setAttribute("aria-pressed", index === illusionIndex ? "true" : "false");
    });
  }

  function chooseIllusion(index) {
    illusionIndex = index;
    stepIndex = 0;
    render();
  }

  Illusions.list.forEach(function (illusion, index) {
    var item = document.createElement("li");
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = illusion.name;
    var summary = document.createElement("span");
    summary.className = "summary";
    summary.textContent = illusion.summary;
    button.appendChild(summary);
    button.addEventListener("click", function () { chooseIllusion(index); });
    item.appendChild(button);
    picker.appendChild(item);
  });

  realIndicator = createIndicator("real", "Instrument (reality)");
  feltIndicator = createIndicator("felt", "Pilot's sensation");

  previousButton.addEventListener("click", function () {
    if (stepIndex > 0) { stepIndex -= 1; render(); }
  });
  nextButton.addEventListener("click", function () {
    if (stepIndex < Illusions.list[illusionIndex].steps.length - 1) { stepIndex += 1; render(); }
  });

  render();
})();
