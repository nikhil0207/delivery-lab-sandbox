import { createState, press, keyFromEvent, getDisplay } from './calculator.mjs';

let state = createState();

const displayEl = document.getElementById('display');

function render() {
  displayEl.textContent = getDisplay(state);
}

function send(key) {
  if (!key) return;
  state = press(state, key);
  render();
}

document.querySelectorAll('button[data-key]').forEach((button) => {
  button.addEventListener('click', () => send(button.dataset.key));
});

document.addEventListener('keydown', (event) => {
  const key = keyFromEvent(event);
  if (!key) return;
  // Enter on a focused button would otherwise also trigger a click.
  event.preventDefault();
  send(key);
});

render();
