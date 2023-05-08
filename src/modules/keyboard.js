const { pianoEvents } = require('./midi')
import { fromMidiKey } from './Note.js'; // Add import for the Note class

export default function createVirtualKeyboard(container) {
  const numberOfKeys = 88;
  const firstMidiNote = 21;

  const blackKeys = [1, 3, 6, 8, 10];

  // Create the virtual keys
  for (let i = 0; i < numberOfKeys; i++) {
    const key = document.createElement('div');

    const keyPosition = (firstMidiNote + i) % 12;
    if (blackKeys.includes(keyPosition)) {
      key.className = 'key key-black';
    } else {
      key.className = 'key key-white';
    }

    key.dataset.note = firstMidiNote + i;
    container.appendChild(key);

    key.addEventListener('click', onKeyClick);
  }

  function onKeyClick(event) {
    const midiNote = parseInt(event.currentTarget.dataset.note, 10);
    const note = fromMidiKey(midiNote);
    pianoEvents.emit('keyPress', note, 127);

    // Release the key after a delay
    setTimeout(() => {
      pianoEvents.emit('keyRelease', note);
    }, 250);
  }

  // css 
  pianoEvents.on('keyPress', (note, velocity) => {
    // get key by note
    const midiNote = note.toMidiNote();
    const key = document.querySelector(`.key[data-note="${midiNote}"]`);
    key.classList.add("pressed");

  });

  // css
  pianoEvents.on('keyRelease', (note) => {
    // get key by note
    const midiNote = note.toMidiNote();
    const key = document.querySelector(`.key[data-note="${midiNote}"]`);
    key.classList.remove("pressed");
  });

  // pianoEvents.on('keyCorrect', (note, index) => {
  //   console.log(`Correct note played: ${note.name}${note.octave}, Index: ${index}`);
  // });

  pianoEvents.on('keyMiss', (note) => {
    console.log(`Incorrect note played: ${note.name}${note.octave}`);
    // get key by note
    const midiNote = note.toMidiNote();
    const key = document.querySelector(`.key[data-note="${midiNote}"]`);
    key.classList.add("missed");

    // Release the key after a delay
    setTimeout(() => {
      key.classList.remove("missed");
    }, 250);
  });

  pianoEvents.on('expectedNote', (note) => {
    console.log(`Expected note: ${note.name}${note.octave}`);
    // get key by note
    const midiNote = note.toMidiNote();
    const key = document.querySelector(`.key[data-note="${midiNote}"]`);
    key.classList.add("expected");
    
    // Release the key after a delay
    setTimeout(() => {
      key.classList.remove("expected");
    }
    , 250);
  });
}
