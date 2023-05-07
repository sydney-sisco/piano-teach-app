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
  training = new Training();
});

document.getElementById('stopTraining').addEventListener('click', () => {
  if (training) {
    training.stop();
  }
});
