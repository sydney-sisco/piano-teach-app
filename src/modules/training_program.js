import Training from './training.js';
import practiceJson from './practice.json';

export default function initTrainingProgram(container) {
  console.log('Training Program module loaded');
  createPracticeDropdown(container);
  createButtons(container);
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
}

function createButtons(container) {
  const startButton = document.createElement('button');
  startButton.id = 'startTrainingProgram';
  startButton.textContent = 'Start Training Program';

  startButton.addEventListener('click', () => {
    console.log('Start Training Program button clicked');
    console.log('Practice:', practiceDropdown.value);

    console.log(practiceJson[practiceDropdown.value]);

    let scale = 0;
    let reps = 0;
    let training = new Training(practiceJson[practiceDropdown.value][scale], () => {
      console.log('Training complete');
      reps += 1;
      if (reps >= 5) {
        training.stop();
        scale += 1;
        training = new Training(practiceJson[practiceDropdown.value][scale], () => {
          console.log('Training complete');
          reps = 0;
        });
      }
    });
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
