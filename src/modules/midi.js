import * as Tone from 'tone';
const { EventEmitter } = require('events');
const pianoEvents = new EventEmitter();
import Note from './Note';

const pianoSampler = new Tone.Sampler({
  urls: {
    A0: "A0.mp3",
    C1: "C1.mp3",
    "D#1": "Ds1.mp3",
    "F#1": "Fs1.mp3",
    A1: "A1.mp3",
    C2: "C2.mp3",
    "D#2": "Ds2.mp3",
    "F#2": "Fs2.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    "D#3": "Ds3.mp3",
    "F#3": "Fs3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    A4: "A4.mp3",
    C5: "C5.mp3",
    "D#5": "Ds5.mp3",
    "F#5": "Fs5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3",
    "D#6": "Ds6.mp3",
    "F#6": "Fs6.mp3",
    A6: "A6.mp3",
    C7: "C7.mp3",
    "D#7": "Ds7.mp3",
    "F#7": "Fs7.mp3",
    A7: "A7.mp3",
    C8: "C8.mp3"
  },
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

function playMidiNote(midiNote, velocity) {
  const note = Tone.Frequency(midiNote, "midi").toNote();
  pianoSampler.triggerAttackRelease(note, "16n", Tone.context.currentTime, velocity / 127);
}

function onMIDIMessage(event) {
  console.log("MIDI message received:", event.data);

  const [status, midiNote, velocity] = event.data;
  const command = event.data[0] & 0xf0;

  if ((status & 0xF0) === 0x90 && velocity > 0) {
    const oscillator = playMidiNote(midiNote, velocity);
    event.target.oscillators.set(midiNote, oscillator);
  } else if ((status & 0xF0) === 0x80 || ((status & 0xF0) === 0x90 && velocity === 0)) {
    const oscillator = event.target.oscillators.get(midiNote);
    if (oscillator) {
      oscillator.disconnect();
      oscillator.stop();
      event.target.oscillators.delete(midiNote);
    }
  }

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