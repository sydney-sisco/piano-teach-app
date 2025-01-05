import * as Vex from 'vexflow';
const { pianoEvents } = require('./midi')

const { Factory, EasyScore, System } = Vex.Flow;

export default function initNotation(containerId) {
  console.log('Notation module loaded');
  
  

  const displayNotes = notes => {
    div=document.getElementById(containerId);
    div.innerHTML='';

    console.log('displaying notes:', notes);
    const right_hand_notes = notes[0];
    const left_hand_notes = notes[1];

    const vf = new Factory({
      renderer: { elementId: containerId, width: 500, height: 300 },
    });
    
    const score = vf.EasyScore();
    const system = vf.System();
  
    const voice1 = score.voice(score.notes(right_hand_notes, {stem: 'up'}));
    
    system.addStave({
      voices: [voice1,],
    })
    .addClef('treble')
    // .addTimeSignature('4/4');
  
    const voice3 = score.voice(score.notes(left_hand_notes, {clef: 'bass', stem: 'up'}));
  
    // Set the first note of the third voice to red
    // voice3.getTickables()[0].setStyle({ fillStyle: 'red', strokeStyle: 'red' });
  
    system.addStave({
      voices: [voice3,],
    })
    .addClef('bass')
    // .addTimeSignature('4/4');
    
    system.addConnector();
    
    vf.draw();
  };
  window.displayNotes = displayNotes; 

  // displayNotes(['C4/q, G4, C5, F5', 'C4/q, F3, C3, G2']);

  const displaySingleNote = note => {
    const div = document.getElementById(containerId);
    div.innerHTML = '';

    console.log('displaying single note:', note);

    const vf = new Vex.Flow.Factory({
        renderer: { elementId: containerId, width: 500, height: 300 },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    // Create a voice with a full measure rest to complete the measure
    const voice = score.voice(score.notes(note + '/w', { stem: 'up' }), { time: '1/1' });

    system.addStave({
        voices: [voice],
    })
    .addClef('treble')
    // .addTimeSignature('4/4');

    vf.draw();
  };

  window.displaySingleNote = displaySingleNote;

  displaySingleNote('C4');

  pianoEvents.on('displaySingleNote', displaySingleNote);
}
