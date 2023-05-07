import createVirtualKeyboard from './modules/keyboard.js';
const keyboardContainer = document.getElementById("keyboard");
createVirtualKeyboard(keyboardContainer);

import initMidi from './modules/midi.js';
initMidi();

import initLogging from './modules/logging.js';
initLogging();
