class Note {
  constructor(name, octave) {
    this.name = name;
    this.octave = octave;
  }

  static fromMidiKey(midiKey) {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = Math.floor(midiKey / 12) - 1;
    const name = noteNames[midiKey % 12];
    console.log(`got: ${midiKey}: ${name}, ${octave}`);
    return new Note(name, octave);
  }

  toMidiNote() {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const noteIndex = noteNames.indexOf(this.name);
    if (noteIndex === -1) throw new Error('Invalid note name');
    return noteIndex + (this.octave + 1) * 12;
  }

  // to string
  toString() {
    return `${this.name}${this.octave}`;
  }
}

module.exports = Note;
