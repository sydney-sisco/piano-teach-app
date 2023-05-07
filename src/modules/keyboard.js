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
}
