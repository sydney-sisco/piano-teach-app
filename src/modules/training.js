const { pianoEvents } = require('./midi')
const Note = require('./Note');
import patterns from './patterns.json';

function jsonPatternToNotes(scale) {
  return scale.map(({ name, octave }) => new Note(name, octave));
}

export default class Training {
  constructor(pattern, cb) {
    console.log('Training started:', pattern);
    this.targetIndex = 0;
    this.patternName = pattern;

    // Callback to be called when training is complete
    this.cb = cb;

    this.notePattern = jsonPatternToNotes(patterns[pattern]);

    this.checkNoteProgressionBound = (note, velocity) => {
      this.checkNoteProgression(note);
    };

    pianoEvents.on('keyPress', this.checkNoteProgressionBound);
  }

  stop() {
    console.log('Training stopped:', this.patternName);
    // Detach the keyPress event listener
    pianoEvents.off('keyPress', this.checkNoteProgressionBound);
  }

  checkNoteProgression(playedNote) {
    pianoEvents.emit('expectedNote', this.notePattern[this.targetIndex]);

    const targetNote = this.notePattern[this.targetIndex];
    if (playedNote.isEqual(targetNote)) {
      pianoEvents.emit('keyCorrect', playedNote, this.targetIndex);
      this.targetIndex += 1;
      if (this.targetIndex >= this.notePattern.length) {
        console.log(`Congratulations! You completed ${this.patternName}.`);
        playSuccessAudio();
        this.targetIndex = 0;

        if (typeof this.cb === 'function') {
          this.cb();
        }
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
