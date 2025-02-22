function jsonPatternToNotes(scale) {
  return scale.map(({ name, octave }) => new Note(name, octave));
}

const initTraining = container => {
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
};

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

const scales = {
  "test": [
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 }
  ],
  "c_major": [
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "B", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 }
  ],
  "c_sharp_major": [
    { "name": "C#", "octave": 4 },
    { "name": "D#", "octave": 4 },
    { "name": "E#", "octave": 4 },
    { "name": "F#", "octave": 4 },
    { "name": "G#", "octave": 4 },
    { "name": "A#", "octave": 4 },
    { "name": "B#", "octave": 4 },
    { "name": "C#", "octave": 5 },
    { "name": "B#", "octave": 4 },
    { "name": "A#", "octave": 4 },
    { "name": "G#", "octave": 4 },
    { "name": "F#", "octave": 4 },
    { "name": "E#", "octave": 4 },
    { "name": "D#", "octave": 4 },
    { "name": "C#", "octave": 4 }
  ],
  "d_major": [
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "F#", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "B", "octave": 4 },
    { "name": "C#", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C#", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F#", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 }
  ],
  "e_flat_major": [
    { "name": "Eb", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "Ab", "octave": 4 },
    { "name": "Bb", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "Eb", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "Bb", "octave": 4 },
    { "name": "Ab", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "Eb", "octave": 4 }
  ],
  "e_major": [
    { "name": "E", "octave": 4 },
    { "name": "F#", "octave": 4 },
    { "name": "G#", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "B", "octave": 4 },
    { "name": "C#", "octave": 5 },
    { "name": "D#", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "D#", "octave": 5 },
    { "name": "C#", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "G#", "octave": 4 },
    { "name": "F#", "octave": 4 },
    { "name": "E", "octave": 4 }
  ],
  "f_major": [
    { "name": "F", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "Bb", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "F", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "Bb", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 }
  ],
  "f_sharp_major": [
    { "name": "F#", "octave": 4 },
    { "name": "G#", "octave": 4 },
    { "name": "A#", "octave": 4 },
    { "name": "B", "octave": 4 },
    { "name": "C#", "octave": 5 },
    { "name": "D#", "octave": 5 },
    { "name": "E#", "octave": 5 },
    { "name": "F#", "octave": 5 },
    { "name": "E#", "octave": 5 },
    { "name": "D#", "octave": 5 },
    { "name": "C#", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "A#", "octave": 4 },
    { "name": "G#", "octave": 4 },
    { "name": "F#", "octave": 4 }
  ],
  "g_major": [
    { "name": "G", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "B", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "F#", "octave": 5 },
    { "name": "G", "octave": 5 },
    { "name": "F#", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "G", "octave": 4 }
  ],
  "a_flat_major": [
    { "name": "Ab", "octave": 4 },
    { "name": "Bb", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "Db", "octave": 5 },
    { "name": "Eb", "octave": 5 },
    { "name": "F", "octave": 5 },
    { "name": "G", "octave": 5 },
    { "name": "Ab", "octave": 5 },
    { "name": "G", "octave": 5 },
    { "name": "F", "octave": 5 },
    { "name": "Eb", "octave": 5 },
    { "name": "Db", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "Bb", "octave": 4 },
    { "name": "Ab", "octave": 4 }
  ],
  "a_major": [
    { "name": "A", "octave": 4 },
    { "name": "B", "octave": 4 },
    { "name": "C#", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "F#", "octave": 5 },
    { "name": "G#", "octave": 5 },
    { "name": "A", "octave": 5 },
    { "name": "G#", "octave": 5 },
    { "name": "F#", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C#", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "A", "octave": 4 }
  ],
  "b_flat_major": [
    { "name": "Bb", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "Eb", "octave": 5 },
    { "name": "F", "octave": 5 },
    { "name": "G", "octave": 5 },
    { "name": "A", "octave": 5 },
    { "name": "Bb", "octave": 5 },
    { "name": "A", "octave": 5 },
    { "name": "G", "octave": 5 },
    { "name": "F", "octave": 5 },
    { "name": "Eb", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "Bb", "octave": 4 }
  ],
  "b_major": [
    { "name": "B", "octave": 4 },
    { "name": "C#", "octave": 5 },
    { "name": "D#", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "F#", "octave": 5 },
    { "name": "G#", "octave": 5 },
    { "name": "A#", "octave": 5 },
    { "name": "B", "octave": 5 },
    { "name": "A#", "octave": 5 },
    { "name": "G#", "octave": 5 },
    { "name": "F#", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "D#", "octave": 5 },
    { "name": "C#", "octave": 5 },
    { "name": "B", "octave": 4 }
  ],
  "mary_had_a_little_lamb": [
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 }
  ],
  "twinkle_twinkle_little_star": [
    { "name": "C", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 }
  ],
  "row_row_row_your_boat": [
    { "name": "C", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "G", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 }
  ],
  "happy_birthday": [
    { "name": "C", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "A", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "A#", "octave": 4 },
    { "name": "A#", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 }
],
  "yankee_doodle": [
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "Bb", "octave": 3 },
    { "name": "D", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "Bb", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "G", "octave": 4 }
  ],
  "jingle_bells": [
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "G", "octave": 4 },
    { "name": "C", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "F", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "E", "octave": 4 },
    { "name": "D", "octave": 4 },
    { "name": "G", "octave": 4 }
  ],
  "tetris-theme": [
    { "name": "E", "octave": 4 },
    { "name": "B", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "A", "octave": 4 },
    { "name": "A", "octave": 4 },
    { "name": "D", "octave": 5 },
    { "name": "F", "octave": 5 },
    { "name": "A", "octave": 5 },
    { "name": "G", "octave": 5 },
    { "name": "F", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "E", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "C", "octave": 5 },
    { "name": "B", "octave": 4 },
    { "name": "C", "octave": 5 },
    { "name": "D", "octave": 5 },
    { "name": "E", "octave": 5 }
  ]
}
