(function (root) {
  // Roll: positive is a bank to the right, negative to the left.
  // Pitch: positive is nose up, negative is nose down.
  // Angles and timings are illustrative, not exact measurements.
  var list = [
    {
      name: "The leans",
      summary: "A slow roll you don't notice, followed by a quick correction.",
      steps: [
        {
          title: "Straight and level",
          happening: "The aircraft flies straight and level.",
          feels: "Everything feels normal, and the instruments agree.",
          real: { roll: 0, pitch: 0 },
          felt: { roll: 0, pitch: 0 }
        },
        {
          title: "A slow, unnoticed roll",
          happening: "While you are busy, the aircraft slowly rolls into a bank. The roll is too gentle for the inner ear to notice (its fluid-filled loops only sense turning faster than roughly 2 degrees per second).",
          feels: "You still feel level.",
          real: { roll: 20, pitch: 0 },
          felt: { roll: 0, pitch: 0 }
        },
        {
          title: "A quick correction",
          happening: "You spot the bank on the instruments and roll the wings level quickly.",
          feels: "The quick roll is sensed by the inner ear, so being level now feels like a bank the other way.",
          real: { roll: 0, pitch: 0 },
          felt: { roll: -20, pitch: 0 }
        },
        {
          title: "Trust the instruments",
          happening: "The aircraft stays level.",
          feels: "The false feeling fades after a short time. Believe the instruments, not the sensation.",
          real: { roll: 0, pitch: 0 },
          felt: { roll: -8, pitch: 0 }
        }
      ]
    },
    {
      name: "Graveyard spiral",
      summary: "A long turn feels like level flight, so the aircraft spirals down.",
      steps: [
        {
          title: "Straight and level",
          happening: "The aircraft flies straight and level.",
          feels: "Everything feels normal.",
          real: { roll: 0, pitch: 0 },
          felt: { roll: 0, pitch: 0 }
        },
        {
          title: "Entering a turn",
          happening: "You roll into a steady, coordinated turn.",
          feels: "You sense the turn at first, because the fluid in your inner ear moves as the turn starts.",
          real: { roll: 25, pitch: 0 },
          felt: { roll: 25, pitch: 0 }
        },
        {
          title: "Settling into the turn",
          happening: "The turn continues for 20 seconds or more. The fluid in the inner ear catches up with the motion, and the nose begins to drift down.",
          feels: "The feeling of turning fades. It feels like straight and level flight.",
          real: { roll: 25, pitch: -4 },
          felt: { roll: 0, pitch: 0 }
        },
        {
          title: "The spiral tightens",
          happening: "The altimeter shows a descent and the airspeed rises. Feeling level, you pull back on the controls. With the wings banked, this only tightens the turn.",
          feels: "It still feels level, so you can't tell why the descent continues.",
          real: { roll: 45, pitch: -20 },
          felt: { roll: 0, pitch: 0 }
        },
        {
          title: "Recovery",
          happening: "Using the instruments, you level the wings first, then ease out of the dive.",
          feels: "Rolling out can feel like turning the other way. Ignore it and keep following the instruments.",
          real: { roll: 0, pitch: 0 },
          felt: { roll: -25, pitch: 0 }
        }
      ]
    },
    {
      name: "Somatogravic illusion",
      summary: "Fast acceleration feels like the nose pitching up.",
      steps: [
        {
          title: "Steady flight",
          happening: "The aircraft flies at a steady speed.",
          feels: "Everything feels normal.",
          real: { roll: 0, pitch: 0 },
          felt: { roll: 0, pitch: 0 }
        },
        {
          title: "Strong acceleration",
          happening: "On takeoff or a go-around at night or in cloud, the aircraft speeds up quickly. The inner ear's gravity sensors can't tell acceleration from tilting backwards.",
          feels: "It feels as if the nose is pitching up steeply, even though the aircraft is climbing only gently.",
          real: { roll: 0, pitch: 5 },
          felt: { roll: 0, pitch: 25 }
        },
        {
          title: "The wrong correction",
          happening: "Believing the nose is too high, you push forward on the controls. The nose goes down and the aircraft heads toward the ground.",
          feels: "The nose-up feeling continues while the acceleration continues.",
          real: { roll: 0, pitch: -10 },
          felt: { roll: 0, pitch: 15 }
        },
        {
          title: "Trust the instruments",
          happening: "You fly the climb attitude shown on the attitude indicator, whatever your body says.",
          feels: "The false feeling ends when the acceleration stops.",
          real: { roll: 0, pitch: 10 },
          felt: { roll: 0, pitch: 20 }
        }
      ]
    },
    {
      name: "Coriolis illusion",
      summary: "Tilting your head during a turn causes a sudden tumbling feeling.",
      steps: [
        {
          title: "A steady turn",
          happening: "You are in a steady turn, and your inner ear has settled.",
          feels: "It feels level.",
          real: { roll: 20, pitch: 0 },
          felt: { roll: 0, pitch: 0 }
        },
        {
          title: "Head tilted",
          happening: "While the turn continues, you tilt your head down or sideways, for example to look at a chart or reach a switch.",
          feels: "Suddenly you feel a strong sense of tumbling or spinning, with dizziness and possibly nausea.",
          real: { roll: 20, pitch: 0 },
          felt: { roll: 55, pitch: 30 }
        },
        {
          title: "Confusion",
          happening: "The strong sensation can lead to wrong control inputs, and the aircraft drifts into a steeper bank and a descent.",
          feels: "It feels as if the aircraft is rolling the other way.",
          real: { roll: 35, pitch: -10 },
          felt: { roll: -50, pitch: 35 }
        },
        {
          title: "Recovery",
          happening: "You keep your head still, look at the attitude indicator, and level the aircraft.",
          feels: "The sensation fades after a short while.",
          real: { roll: 0, pitch: 0 },
          felt: { roll: 20, pitch: 10 }
        }
      ]
    }
  ];

  function describe(attitude) {
    var roll = attitude.roll === 0 ? "wings level" :
      (attitude.roll > 0 ? "banked right " : "banked left ") + Math.abs(attitude.roll) + " degrees";
    var pitch = attitude.pitch === 0 ? "nose level" :
      (attitude.pitch > 0 ? "nose up " : "nose down ") + Math.abs(attitude.pitch) + " degrees";
    return roll + ", " + pitch;
  }

  var api = { list: list, describe: describe };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.Illusions = api;
  }
})(this);
