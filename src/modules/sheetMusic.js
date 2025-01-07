import * as Vex from 'vexflow';
const { pianoEvents } = require('./midi')

const { Factory, Renderer, Stave } = Vex.Flow;

const VF = Vex.Flow;

const staveWidth = 200;


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
    
    system
    .addStave({
      voices: [voice1,voice1],
    })
    .addClef('treble')
    // .addTimeSignature('4/4');
  
    const voice3 = score.voice(score.notes(left_hand_notes, {clef: 'bass', stem: 'up'}));

    // Set the first note of the third voice to red
    // voice3.getTickables()[0].setStyle({ fillStyle: 'red', strokeStyle: 'red' });
  
    system
    .addStave({
      voices: [voice3],
    })
    .addClef('bass')
    // .addTimeSignature('4/4');
    
    system.addConnector();
    
    vf.draw();
  };
  window.displayNotes = displayNotes; 
  // displayNotes(['C4/q, G4, C5, F5', 'C4/q, F3, C3, G2']);

  const displaySingleNote = (note, stave) => {
    const [context, trebleStave, bassStave] = displayEmptyStaves();

    if (!(stave === 'treble' || stave === 'bass')) {
      console.error('displaySingleNote stave must be one of: [treble || bass]');
    }

    let staveForNote;
    if (stave === 'treble') {
      staveForNote = trebleStave;
    } else if (stave === 'bass') {
      staveForNote = bassStave;
    }

    // Create and draw the note as a whole note on the stave
    const notes = [
      new VF.StaveNote({ clef: stave, keys: [note], duration: "w" })
    ];

    // Create a voice in 4/4 and add the notes
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    // Format and justify the notes with a 400-pixel width
    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], staveWidth);

    // Render voice
    voice.draw(context, staveForNote);

  };
  window.displaySingleNote = displaySingleNote;
  // runnable in the browser console:
  // displaySingleNote('C/4', 'treble');

  const displayEmptyStaves = () => {
    const div = document.getElementById(containerId);
    div.innerHTML = '';

    const renderer = new Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(500, 500);
    const context = renderer.getContext();

    const trebleStave = new VF.Stave(50, 10, staveWidth);
    trebleStave.addClef('treble');

    const bassStave = new VF.Stave(50, 100, staveWidth);
    bassStave.addClef('bass');

    new VF.StaveConnector(trebleStave, bassStave)
    .setType(VF.StaveConnector.type.BRACE)
    .setContext(context)
    .draw();

    new VF.StaveConnector(trebleStave, bassStave)
    .setType(VF.StaveConnector.type.SINGLE_LEFT)
    .setContext(context)
    .draw();

    trebleStave.setContext(context).draw();
    bassStave.setContext(context).draw();

    return [context, trebleStave, bassStave];
  }
  window.displayEmptyStaves = displayEmptyStaves;
  displayEmptyStaves();

  pianoEvents.on('displaySingleNote', displaySingleNote);
  pianoEvents.on('displayEmptyStaves', displayEmptyStaves);
}
