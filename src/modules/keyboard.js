const { pianoEvents } = require('./midi')

export default function createVirtualKeyboard(container) {
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

  // pianoEvents.on('keyMiss', (note, index) => {
  //   console.log(`Incorrect note played: ${note.name}${note.octave}, Index: ${index}`);
  // });
}
