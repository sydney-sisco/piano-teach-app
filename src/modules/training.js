const { pianoEvents } = require('./midi')
const Note = require('./Note');
import scales from './scales.json';

function jsonPatternToNotes(scale) {
  return scale.map(({ name, octave }) => new Note(name, octave));
}

export default function initTraining(container) {
  console.log('Training module loaded');

  let patternName;
  let notePattern;
  let targetIndex;

  const xxx = async (pattern) => {
    if (patternName) {
      console.log('Training already in progress:', patternName);
      return;
    }

    console.log('Training started:', pattern);
    patternName = pattern;
    notePattern = jsonPatternToNotes(scales[pattern]);
    targetIndex = 0;

    pianoEvents.emit('displaySingleNote', notePattern[targetIndex])

    pianoEvents.on('keyPress', checkNoteProgression);

    return new Promise(resolve => {
      pianoEvents.once('trainingCompleted', () => {
        resolve();
      });
    });
  };

  const stopTraining = () => {
    if (!patternName) {
      console.log('No training in progress');
      return;
    }
    console.log('Training stopped:', patternName);
    patternName = null;
    notePattern = null;
    targetIndex = 0;

    pianoEvents.off('keyPress', checkNoteProgression);
  };

  const checkNoteProgression = (playedNote) => {
    pianoEvents.emit('expectedNote', notePattern[targetIndex]);

    const targetNote = notePattern[targetIndex];
    if (playedNote.isEqual(targetNote)) {
      pianoEvents.emit('keyCorrect', playedNote, targetIndex);
      targetIndex += 1;
      if (targetIndex >= notePattern.length) {
        console.log(`Congratulations! You completed ${patternName}.`);
        playSuccessAudio();
        pianoEvents.emit('trainingCompleted');
        targetIndex = 0;
        pianoEvents.emit('displaySingleNote', notePattern[targetIndex]);
      } else {
        pianoEvents.emit('displaySingleNote', notePattern[targetIndex]);
      }
    } else {
      pianoEvents.emit('keyMiss', playedNote, targetIndex);
      targetIndex = 0;
      pianoEvents.emit('displaySingleNote', notePattern[targetIndex]);
      playIncorrectNote();
    }
  }

  dropdown = createScaleDropdown(container);
  createButtons(container, dropdown, xxx, stopTraining);

  return {
    xxx,
    stopTraining,
  }
}

function createScaleDropdown(container) {
  const dropdown = document.createElement('select');
  dropdown.id = 'scaleDropdown';

  Object.keys(scales).forEach(scale => {
    const option = document.createElement('option');
    option.value = scale;
    option.textContent = scale.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    dropdown.appendChild(option);
  });

  container.appendChild(dropdown);
  return dropdown;
}

function createButtons(container, dropdown, xxx, stopTraining) {
  const startButton = document.createElement('button');
  // startButton.id = 'startTraining';
  startButton.textContent = 'Start Training';

  startButton.addEventListener('click', () => xxx(dropdown.value));

  const stopButton = document.createElement('button');
  stopButton.id = 'stopTraining';
  stopButton.textContent = 'End Training';

  stopButton.addEventListener('click', stopTraining);

  container.appendChild(startButton);
  container.appendChild(stopButton);
}

function playIncorrectNote() {
  const audio = document.getElementById('incorrectNoteAudio');
  audio.play().catch((error) => {
    console.error('Error playing audio:', error);
  });
}

function playSuccessAudio() {
  const audio = document.getElementById('successAudio');
  audio.play().catch((error) => {
    console.error('Error playing audio:', error);
  });
}
