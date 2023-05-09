import practiceJson from './practice.json';

export default function initTrainingProgram(container, xxx, stopTraining) {
  console.log('Training Program module loaded');
  const dropdown = createPracticeDropdown(container);
  createButtons(container, dropdown, xxx, stopTraining);
}

function createPracticeDropdown(container) {
  const dropdown = document.createElement('select');
  dropdown.id = 'practiceDropdown';

  Object.keys(practiceJson).forEach(practice => {
    const option = document.createElement('option');
    option.value = practice;
    option.textContent = practice.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    dropdown.appendChild(option);
  });

  container.appendChild(dropdown);
  return dropdown;
}

function createButtons(container, dropdown, xxx, stopTraining) {
  const startButton = document.createElement('button');
  startButton.id = 'startTrainingProgram';
  startButton.textContent = 'Start Training Program';

  startButton.addEventListener('click', () => {
    console.log('Start Training Program button clicked');
    console.log('Practice:', dropdown.value);

    trainingLoop(practiceJson[dropdown.value], xxx, stopTraining);

    // let scale = 0;
    // let reps = 0;
    // let training = new Training(practiceJson[practiceDropdown.value][scale], () => {
    //   console.log('Training complete');
    //   reps += 1;
    //   if (reps >= 5) {
    //     training.stop();
    //     scale += 1;
    //     training = new Training(practiceJson[practiceDropdown.value][scale], () => {
    //       console.log('Training complete');
    //       reps = 0;
    //     });
    //   }
    // });
  });
  


  const stopButton = document.createElement('button');
  stopButton.id = 'stopTrainingProgram';
  stopButton.textContent = 'End Training Program';

  stopButton.addEventListener('click', () => {
    console.log('End Training Program button clicked');
    // Add your functionality here
  });


  container.appendChild(startButton);
  container.appendChild(stopButton);
}

const trainingLoop = async (training, xxx, stopTraining) => {
  console.log('Training:', training);

  // iterate through each scale in the training program
  for (let i = 0; i < training.length; i++) {
    const maxReps = 5;
    let reps = 0;

    
    while (reps < maxReps) {
      setTrainingIndicator(`${training[i]}: ${reps}/${maxReps}`);
        
      console.log('Scale:', training[i]);
      await xxx(training[i]);
      console.log('Training complete');
      stopTraining();
      reps += 1;
    }

  }

  console.log('Training program complete');
}

const setTrainingIndicator = (training) => {
  const trainingIndicator = document.getElementById('trainingIndicator');
  trainingIndicator.textContent = `Training: ${training}`;
}
