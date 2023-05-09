import createVirtualKeyboard from './modules/keyboard.js';
const keyboardContainer = document.getElementById("keyboard");
createVirtualKeyboard(keyboardContainer);


import initMidi from './modules/midi.js';
initMidi();


import initLogging from './modules/logging.js';
initLogging();


import initTraining from './modules/training.js';
const {startTraining, stopTraining} = initTraining(document.getElementById('trainingContainer'));


import initSounds from './modules/sounds.js';
// initSounds();



import initTrainingProgram from './modules/training_program.js';
initTrainingProgram(document.getElementById('trainingProgramContainer'));
