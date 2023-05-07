import * as Tone from 'tone';
console.log('Hello world!');

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

// const pianoSampler = new Tone.Sampler(pianoSamples, {
//   release: 1,
//   baseUrl: "/"
// }).toDestination();

async function playPianoNote(note, duration) {
  await Tone.start(); // Required to start audio context
  pianoSampler.triggerAttackRelease(note, duration);
}

// Web Audio API initialization
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// const gainNode = audioContext.createGain();

// Function to play a MIDI note
// function playMidiNote(midiNote, velocity) {
//   const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
//   const oscillator = audioContext.createOscillator();
//   oscillator.type = 'sine';
//   oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
//   oscillator.connect(gainNode);
//   gainNode.gain.setValueAtTime(velocity / 127, audioContext.currentTime);
//   gainNode.connect(audioContext.destination);
//   oscillator.start(audioContext.currentTime);
//   return oscillator;
// }
// async function playMidiNote(midiNote, velocity, duration=0.5) {
//   const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
//   const note = Tone.Frequency(frequency, "midi").toNote();
//   const volume = Math.max(0, Math.min(1, velocity / 127));

//   await Tone.start(); // Required to start audio context
//   pianoSampler.volume.value = Tone.gainToDb(volume);
//   pianoSampler.triggerAttackRelease(note, duration);
// }
function playMidiNote(midiNote, velocity) {
  const note = Tone.Frequency(midiNote, "midi").toNote();
  pianoSampler.triggerAttackRelease(note, "16n", Tone.context.currentTime, velocity / 127);
}


function createVirtualKeyboard(container) {
  const numberOfKeys = 88;
  const firstMidiNote = 21;

  const blackKeys = [1, 3, 6, 8, 10];

  for (let i = 0; i < numberOfKeys; i++) {
    const key = document.createElement("div");

    const keyPosition = (firstMidiNote + i) % 12;
    if (blackKeys.includes(keyPosition)) {
      key.className = "key key-black";
    } else {
      key.className = "key key-white";
    }

    key.dataset.note = firstMidiNote + i;
    container.appendChild(key);
  }
}

const keyboardContainer = document.getElementById("keyboard");
createVirtualKeyboard(keyboardContainer);

function onMIDIMessage(event) {
  console.log("MIDI message received:", event.data);

  const [status, midiNote, velocity] = event.data;
  const command = event.data[0] & 0xf0;
  // const velocity = event.data[2];

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
    if (command === 144 && velocity > 0) { // Note on
      key.classList.add("pressed");
    } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off
      key.classList.remove("pressed");
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

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIError);
} else {
  console.error("MIDI not supported in this browser.");
}