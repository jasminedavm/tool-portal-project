(function (root) {
  var SEA_LEVEL_KPA = 101.325;
  var FEET_TO_METRES = 0.3048;
  var TROPOSPHERE_TOP_METRES = 11000;
  var TROPOSPHERE_TOP_KPA = 22.632;
  var STRATOSPHERE_SCALE_METRES = 6341.6;

  // Commonly published time of useful consciousness (e.g. FAA Aeronautical Information Manual).
  // Values are in seconds: the shortest and longest time in the published range.
  var CONSCIOUSNESS_TABLE = [
    { feet: 20000, shortest: 1800, longest: 1800 },
    { feet: 22000, shortest: 300, longest: 600 },
    { feet: 25000, shortest: 180, longest: 300 },
    { feet: 28000, shortest: 150, longest: 180 },
    { feet: 30000, shortest: 60, longest: 120 },
    { feet: 35000, shortest: 30, longest: 60 },
    { feet: 40000, shortest: 15, longest: 20 },
    { feet: 45000, shortest: 9, longest: 15 }
  ];

  var STAGES = [
    { fromFeet: 0, name: "Indifferent stage",
      symptoms: "Usually no noticeable symptoms. Night vision can start to get slightly worse from about 5,000 ft." },
    { fromFeet: 10000, name: "Compensatory stage",
      symptoms: "The body compensates: heart rate and breathing speed up. Judgement and short-term memory can be slightly affected, and you may feel drowsy or get a headache." },
    { fromFeet: 15000, name: "Disturbance stage",
      symptoms: "Judgement, memory, and coordination get noticeably worse. Vision can dim, lips and fingernails may turn blue, and some people feel euphoric or irritable without noticing." },
    { fromFeet: 20000, name: "Critical stage",
      symptoms: "Confusion and loss of consciousness can come on within minutes or even seconds, often with little warning." }
  ];

  function pressureKpa(feet) {
    var metres = feet * FEET_TO_METRES;
    if (metres <= TROPOSPHERE_TOP_METRES) {
      return SEA_LEVEL_KPA * Math.pow(1 - 2.25577e-5 * metres, 5.25588);
    }
    return TROPOSPHERE_TOP_KPA * Math.exp(-(metres - TROPOSPHERE_TOP_METRES) / STRATOSPHERE_SCALE_METRES);
  }

  function oxygenPercentOfSeaLevel(feet) {
    return (pressureKpa(feet) / SEA_LEVEL_KPA) * 100;
  }

  function stageAt(feet) {
    var found = STAGES[0];
    STAGES.forEach(function (stage) {
      if (feet >= stage.fromFeet) found = stage;
    });
    return found;
  }

  function interpolateLog(low, high, fraction) {
    return Math.exp(Math.log(low) + (Math.log(high) - Math.log(low)) * fraction);
  }

  function usefulConsciousness(feet) {
    if (feet < 20000) return null;
    for (var i = 1; i < CONSCIOUSNESS_TABLE.length; i++) {
      var lower = CONSCIOUSNESS_TABLE[i - 1];
      var upper = CONSCIOUSNESS_TABLE[i];
      if (feet <= upper.feet) {
        var fraction = (feet - lower.feet) / (upper.feet - lower.feet);
        return {
          shortest: interpolateLog(lower.shortest, upper.shortest, fraction),
          longest: interpolateLog(lower.longest, upper.longest, fraction)
        };
      }
    }
    var last = CONSCIOUSNESS_TABLE[CONSCIOUSNESS_TABLE.length - 1];
    return { shortest: last.shortest, longest: last.longest };
  }

  function plural(count, word) {
    return count + " " + word + (count === 1 ? "" : "s");
  }

  function formatDuration(seconds) {
    var wholeSeconds = Math.round(seconds);
    if (wholeSeconds < 60) return plural(wholeSeconds, "second");
    var minutes = wholeSeconds / 60;
    return plural(minutes < 10 ? Math.round(minutes * 2) / 2 : Math.round(minutes), "minute");
  }

  var api = {
    pressureKpa: pressureKpa,
    oxygenPercentOfSeaLevel: oxygenPercentOfSeaLevel,
    stageAt: stageAt,
    usefulConsciousness: usefulConsciousness,
    formatDuration: formatDuration
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AltitudeModel = api;
  }
})(this);
