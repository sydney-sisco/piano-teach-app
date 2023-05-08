import createVirtualKeyboard from './modules/keyboard.js';
const keyboardContainer = document.getElementById("keyboard");
createVirtualKeyboard(keyboardContainer);

import initMidi from './modules/midi.js';
initMidi();

import initLogging from './modules/logging.js';
initLogging();

const { pianoEvents } = require('./modules/midi')

import Training from './modules/training.js';

let training;

document.getElementById('startTraining').addEventListener('click', () => {
  training = new Training(getCurrentScaleValue());
});

document.getElementById('stopTraining').addEventListener('click', () => {
  if (training) {
    training.stop();
  }
});


import initSounds from './modules/sounds.js';
// initSounds();


import scales from './modules/patterns.json';
const scalesJson = scales;

function createScaleDropdown() {
  const dropdown = document.createElement('select');
  dropdown.id = 'scaleDropdown';

  Object.keys(scalesJson).forEach(scale => {
    const option = document.createElement('option');
    option.value = scale;
    option.textContent = scale.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    dropdown.appendChild(option);
  });

  return dropdown;
}

// Create the dropdown selector in the DOM
const scaleDropdown = createScaleDropdown();
document.body.appendChild(scaleDropdown);

// Function to get current value of the dropdown
function getCurrentScaleValue() {
  return scaleDropdown.value;
}

