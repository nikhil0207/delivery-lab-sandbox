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
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;

  // Enter or Space on a focused calculator button must keep native button
  // behavior: the browser fires a click, which sends that button's data-key.
  const target = event.target;
  const focusedButton =
    target && typeof target.closest === 'function' ? target.closest('button[data-key]') : null;
  if (focusedButton && (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar')) {
    return;
  }

  const key = keyFromEvent(event);
  if (!key) return;
  event.preventDefault();
  send(key);
});

render();
