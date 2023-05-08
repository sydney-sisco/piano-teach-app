const { EventEmitter } = require('events');
const pianoEvents = new EventEmitter();
import Note from './Note';

function onMIDIMessage(event) {
  console.log("MIDI message received:", event.data);

  const [status, midiNote, velocity] = event.data;
  const command = event.data[0] & 0xf0;

  const key = document.querySelector(`.key[data-note="${midiNote}"]`);

  if (key) {
    const targetNote = Note.fromMidiKey(midiNote);
    if (command === 144 && velocity > 0) { // Note on
      pianoEvents.emit('keyPress', targetNote, velocity);
    } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off
      pianoEvents.emit('keyRelease', targetNote);
    }
  }
}

function onMIDISuccess(midiAccess) {
  for (const input of midiAccess.inputs.values()) {
    input.oscillators = new Map();
    input.addEventListener("midimessage", onMIDIMessage);
  }
}

function onMIDIError(error) {
  console.error("Error accessing MIDI devices:", error);
}

export default function initMidi() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIError);
  } else {
    console.error("MIDI not supported in this browser.");
  }
}

module.exports.pianoEvents = pianoEvents;
