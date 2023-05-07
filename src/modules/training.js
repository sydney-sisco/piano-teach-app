const EventEmitter = require('events');
const { pianoEvents } = require('./midi')
const Note = require('./Note'); // Assuming you have already exported the Note class

class Training extends EventEmitter {
  constructor() {
    super();
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
  }

  checkNoteProgression(playedNote) {
    const targetNote = this.cMajorScale[this.targetIndex];
    if (playedNote.name === targetNote.name && playedNote.octave === targetNote.octave) {
      this.targetIndex += 1;
      if (this.targetIndex >= this.cMajorScale.length) {
        this.emit('cMajorScaleComplete');
        this.targetIndex = 0;
      }
    } else {
      this.targetIndex = 0;
    }
  }
}

const training = new Training();
module.exports = training;

pianoEvents.on('keyPress', (note, velocity) => {
  training.checkNoteProgression(note);
});

training.on('cMajorScaleComplete', () => {
  console.log('Congratulations! You completed the C major scale.');
});