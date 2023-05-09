import createVirtualKeyboard from './modules/keyboard.js';
const keyboardContainer = document.getElementById("keyboard");
createVirtualKeyboard(keyboardContainer);


import initMidi from './modules/midi.js';
initMidi();


import initSounds from './modules/sounds.js';
// initSounds();


import initLogging from './modules/logging.js';
initLogging();


import initTraining from './modules/training.js';
import initTrainingProgram from './modules/training_program.js';

const { xxx, stopTraining} = initTraining(document.getElementById('trainingContainer'));
console.log('startTrainingFunction:', xxx);
initTrainingProgram(document.getElementById('trainingProgramContainer'), xxx, stopTraining);
