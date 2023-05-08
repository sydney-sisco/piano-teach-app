const { pianoEvents } = require('./midi')
const Note = require('./Note');
import scales from './patterns.json';

function jsonScaleToNotes(scale) {
  return scale.map(({ name, octave }) => new Note(name, octave));
}

export default class Training{
  constructor(pattern) {
    this.targetIndex = 0;


    this.cMajorScale = jsonScaleToNotes(scales[pattern]);

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
