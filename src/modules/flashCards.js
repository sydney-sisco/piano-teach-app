const { pianoEvents } = require('./midi')
const Note = require('./Note');

// reference notes
const referenceNotes = [
  // right hand 
  {
    note: new Note('C', 4),
    stave: "treble"
  },
  {
    note: new Note('G', 4),
    stave: "treble"
  },
  {
    note: new Note('C', 5),
    stave: "treble"
  },
  {
    note: new Note('F', 5),
    stave: "treble"
  },
  {
    note: new Note('C', 6),
    stave: "treble"
  },

  // left hand
  {
    note: new Note('C', 4),
    stave: "bass"
  },
  {
    note: new Note('F', 3),
    stave: "bass"
  },
  {
    note: new Note('C', 3),
    stave: "bass"
  },
  {
    note: new Note('G', 2),
    stave: "bass"
  },
  {
    note: new Note ('C', 2),
    stave: "bass"
  },
];
let notesForCurrentQuiz;
let currentNote;
let streak = 0;
const streakGoal = 20;

export default function initFlashCards(container) {
  console.log('Flash Cards module loaded');
  createElements(container);
}

const newRandomNote = notes => {
  const {note, stave} = notes[Math.floor(Math.random() * notes.length)];
  pianoEvents.emit('displaySingleNote', note.toVexFlowNote(), stave);
  currentNote = note;
}

const createElements = (container) => {
  // button to start reference notes quiz
  const referenceNotesButton = document.createElement('button');
  referenceNotesButton.textContent = 'Reference Notes Quiz';
  referenceNotesButton.addEventListener('click', () => {
    notesForCurrentQuiz = referenceNotes;
    newRandomNote(notesForCurrentQuiz);
    setTrainingIndicator(`Streak: ${streak}/${streakGoal}`)
    // Remove the listener if it already exists
    pianoEvents.off('keyPress', checkNote);
    pianoEvents.on('keyPress', checkNote);
  });
  container.appendChild(referenceNotesButton);

  // button to start all notes quiz
  const allNotesButton = document.createElement('button');
  allNotesButton.textContent = 'All Notes Quiz';
  allNotesButton.addEventListener('click', () => {
    notesForCurrentQuiz = generateNotes();
    newRandomNote(notesForCurrentQuiz);
    setTrainingIndicator(`Streak: ${streak}/${streakGoal}`)
    // Remove the listener if it already exists
    pianoEvents.off('keyPress', checkNote);
    pianoEvents.on('keyPress', checkNote);
  });
  container.appendChild(allNotesButton);

  // button to stop flash cards
  const stopButton = document.createElement('button');
  stopButton.textContent = 'Stop';
  stopButton.addEventListener('click', () => {
    pianoEvents.off('keyPress', checkNote)
    notesForCurrentQuiz = null;
    currentNote = null;
    streak = 0;
    setTrainingIndicator('')
    pianoEvents.emit('displayEmptyStaves');
  });
  container.appendChild(stopButton);
};

const checkNote = note => {
  pianoEvents.emit('expectedNote', currentNote);

  if (note.isEqual(currentNote)) {
    console.log('correct!');
    streak++;
    setTrainingIndicator(`Streak: ${streak}/${streakGoal}`)
    playSuccessAudio();

    if (streak === streakGoal) {
      // TODO: play a good sound here
      console.log('quiz complete!');
      pianoEvents.off('keyPress', checkNote)
      notesForCurrentQuiz = null;
      currentNote = null;
      streak = 0;
      setTrainingIndicator('Success!')
      pianoEvents.emit('displayEmptyStaves');
    } else {
      newRandomNote(notesForCurrentQuiz);
    }

  } else {
    console.log('wrong!');
    streak = 0;
    setTrainingIndicator(`Streak: ${streak}/${streakGoal}`)
    playIncorrectNote();
  }
};

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

const setTrainingIndicator = (text) => {
  const trainingIndicator = document.getElementById('trainingIndicator');
  trainingIndicator.textContent = text;
}

// function to generate all notes between C2 and C6
function generateNotes() {
  // Helper function to generate note objects
  function createNoteObjects(startOctave, endOctave, stave) {
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const notes = [];
    
    for (let octave = startOctave; octave <= endOctave; octave++) {
      for (const noteName of noteNames) {
        notes.push({
          note: new Note(noteName, octave),
          stave: stave
        });
      }
    }

    return notes;
  }

  const bassNotes = createNoteObjects(2, 3, 'bass');         // From C2 to B3
  const middleC = [{ note: new Note('C', 4), stave: 'bass' }]; // C4 in bass
  const trebleNotes = createNoteObjects(4, 6, 'treble');     // From C4 to B6

  // Concatenate all notes into a single array
  return [...bassNotes, ...middleC, ...trebleNotes];
}
