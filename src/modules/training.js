const cMajorScale = [60, 62, 64, 65, 67, 69, 71]; // C4, D4, E4, F4, G4, A4, B4


let currentNoteIndex = 0;

pianoEvents.emit('highlightNote', cMajorScale[currentNoteIndex]);

pianoEvents.on('keyPress', (note, velocity) => {
  if (note === cMajorScale[currentNoteIndex]) {
    console.log('You pressed the correct key!');

    // Increment the current note index, and reset to 0 if the end is reached.
    currentNoteIndex = (currentNoteIndex + 1) % cMajorScale.length;

    // Highlight the next note for the user
    pianoEvents.emit('highlightNote', cMajorScale[currentNoteIndex]);

  } else {
    console.log('Incorrect key pressed. Try again!');
  }
});
