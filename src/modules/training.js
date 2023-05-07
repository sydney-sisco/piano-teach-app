const { pianoEvents } = require('./midi')
const Note = require('./Note');

export default class Training{
  constructor() {
    this.targetIndex = 0;
    this.cMajorScale = [
      new Note('C', 4),
      new Note('D', 4),
      new Note('E', 4),
      new Note('F', 4),
      new Note('G', 4),
      new Note('A', 4),
      new Note('B', 4),
      new Note('C', 5),
    ];

    this.checkNoteProgressionBound = (note, velocity) => {
      this.checkNoteProgression(note);
    };

    pianoEvents.on('keyPress', this.checkNoteProgressionBound);
  }

  stop() {
    // Detach the keyPress event listener
    pianoEvents.off('keyPress', this.checkNoteProgressionBound);
  }

  checkNoteProgression(playedNote) {
    const targetNote = this.cMajorScale[this.targetIndex];
    if (playedNote.name === targetNote.name && playedNote.octave === targetNote.octave) {
      pianoEvents.emit('keyCorrect', playedNote, this.targetIndex);
      this.targetIndex += 1;
      if (this.targetIndex >= this.cMajorScale.length) {
        console.log('Congratulations! You completed the C major scale.');
        playSuccessAudio();
        this.targetIndex = 0;
      }
    } else {
      pianoEvents.emit('keyMiss', playedNote, this.targetIndex);
      this.targetIndex = 0;
      playIncorrectNote();
    }
  }
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
