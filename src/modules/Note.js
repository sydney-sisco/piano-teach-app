const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const sharpToFlat = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };
const flatToSharp = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };

class Note {
  constructor(name, octave) {
    this.name = name;
    this.octave = octave;
  }

  static getSharpEquivalent(note) {
    return flatToSharp[note] || note;
  }

  static fromMidiKey(midiKey) {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = Math.floor(midiKey / 12) - 1;
    const name = noteNames[midiKey % 12];
    console.log(`got: ${midiKey}: ${name}, ${octave}`);
    return new Note(name, octave);
  }

  toMidiNote() {

    let noteName = Note.getSharpEquivalent(this.name);

    if (noteName === 'E#') {
      noteName = 'F';
    }

    let octaveAdjustment = 0;
    if (noteName === 'B#') {
      noteName = 'C';
      octaveAdjustment = 1;
    }



    const noteIndex = noteNames.indexOf(noteName);
    if (noteIndex === -1) throw new Error('Invalid note name');
    return noteIndex + (this.octave + 1 + octaveAdjustment) * 12;
  }

  isEqual(otherNote) {
    // return Note.getSharpEquivalent(this.name) === Note.getSharpEquivalent(otherNote.name) && this.octave === otherNote.octave;
    return this.toMidiNote() === otherNote.toMidiNote();
  }

  // to string
  toString() {
    return `${this.name}${this.octave}`;
  }
}

module.exports = Note;
