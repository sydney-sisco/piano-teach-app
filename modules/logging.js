const initLogging = () => {
  console.log('Logging module loaded');

  pianoEvents.on('keyPress', (note, velocity) => {
    // Logic for handling key press
    console.log(`Note pressed: ${note}, Velocity: ${velocity}`);
  });

  pianoEvents.on('keyRelease', (note) => {
    // Logic for handling key release
    console.log(`Note released: ${note}`);
  });

};
