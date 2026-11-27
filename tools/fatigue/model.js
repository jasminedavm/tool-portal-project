(function (root) {
  // Simplified two-process model of sleep regulation (Borbely; Daan, Beersma and Borbely, 1984).
  // Process S: sleep pressure. It builds while awake and falls during sleep.
  // Process C: the body clock. It makes us more alert in the day than at night.
  var PRESSURE_CEILING = 1;
  var BUILD_UP_HOURS = 18.2;
  var DECAY_HOURS = 4.2;
  var PRESSURE_AT_BEDTIME = 0.67;
  var BODY_CLOCK_PEAK_HOUR = 16;

  function clamp(value, low, high) {
    return Math.min(high, Math.max(low, value));
  }

  function pressureAtWakeUp(hoursSlept) {
    return PRESSURE_AT_BEDTIME * Math.exp(-hoursSlept / DECAY_HOURS);
  }

  function pressureAfterAwake(hoursSlept, hoursAwake) {
    var start = pressureAtWakeUp(hoursSlept);
    return PRESSURE_CEILING - (PRESSURE_CEILING - start) * Math.exp(-hoursAwake / BUILD_UP_HOURS);
  }

  function bodyClockAt(clockHour) {
    return Math.cos((2 * Math.PI * (clockHour - BODY_CLOCK_PEAK_HOUR)) / 24);
  }

  function hoursSince(wakeHour, nowHour) {
    var difference = nowHour - wakeHour;
    return difference < 0 ? difference + 24 : difference;
  }

  function alertness(hoursSlept, wakeHour, hoursAwake) {
    var pressure = pressureAfterAwake(hoursSlept, hoursAwake);
    var bodyClock = bodyClockAt((wakeHour + hoursAwake) % 24);
    var score = clamp(Math.round((0.85 - 0.6 * pressure + 0.15 * bodyClock) * 100), 0, 100);
    return { score: score, pressure: pressure, bodyClock: bodyClock };
  }

  function label(score) {
    if (score >= 60) return "Alert";
    if (score >= 40) return "Reduced alertness";
    return "Impaired alertness";
  }

  function curve(hoursSlept, wakeHour, stepHours) {
    var points = [];
    for (var hours = 0; hours <= 24; hours += stepHours) {
      points.push({ hoursAwake: hours, score: alertness(hoursSlept, wakeHour, hours).score });
    }
    return points;
  }

  var api = {
    alertness: alertness,
    label: label,
    curve: curve,
    hoursSince: hoursSince
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.FatigueModel = api;
  }
})(this);
