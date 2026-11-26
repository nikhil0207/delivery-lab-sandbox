import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createState, press, getDisplay, keyFromEvent } from '../src/calculator.mjs';

function run(keys, start = createState()) {
  return (Array.isArray(keys) ? keys : [...keys]).reduce(press, start);
}

function show(keys) {
  return getDisplay(run(keys));
}

function viaKeyboard(events) {
  let state = createState();
  for (const key of events) {
    const mapped = keyFromEvent({ key });
    if (mapped !== null) state = press(state, mapped);
  }
  return getDisplay(state);
}

test('initial display is 0', () => {
  assert.equal(getDisplay(createState()), '0');
});

test('basic arithmetic', () => {
  assert.equal(show('2+3='), '5');
  assert.equal(show('7-4='), '3');
  assert.equal(show('6*4='), '24');
  assert.equal(show('8/2='), '4');
});

test('multi-digit entry and leading zeros', () => {
  assert.equal(show('123'), '123');
  assert.equal(show('007'), '7');
  assert.equal(show('12+30='), '42');
});

test('decimal arithmetic avoids floating point noise', () => {
  assert.equal(show('0.1+0.2='), '0.3');
  assert.equal(show('1.5+2.25='), '3.75');
});

test('decimal point entry', () => {
  assert.equal(show('1..5'), '1.5');
  assert.equal(show('.5'), '0.5');
  assert.equal(show('2+.5='), '2.5');
});

test('negative results are displayed', () => {
  assert.equal(show('3-5='), '-2');
});

test('chained operations evaluate left to right', () => {
  assert.equal(show('2+3*4='), '20');
  assert.equal(show('10-4/2='), '3');
  assert.equal(show('2+3+'), '5');
});

test('changing operator before right operand replaces it', () => {
  assert.equal(show('5+*3='), '15');
});

test('result can be continued with a new operator', () => {
  assert.equal(show('2+3=*4='), '20');
});

test('division by zero shows a readable error', () => {
  const display = show('8/0=');
  assert.match(display, /divide by zero/i);
  assert.match(getDisplay(run('8/0+')), /divide by zero/i);
});

test('clear resets after an error and calculator works again', () => {
  const errored = run('8/0=');
  assert.equal(getDisplay(run('C', errored)), '0');
  assert.equal(getDisplay(run('C1+1=', errored)), '2');
});

test('clear resets mid-calculation', () => {
  assert.equal(show('12+3C'), '0');
  assert.equal(show('12+3C4='), '4');
});

test('keyboard sequence matches on-screen sequence', () => {
  assert.equal(viaKeyboard(['6', '*', '4', 'Enter']), '24');
  assert.equal(show('6*4='), '24');
});

test('keyboard mappings', () => {
  assert.equal(keyFromEvent({ key: '7' }), '7');
  assert.equal(keyFromEvent({ key: '+' }), '+');
  assert.equal(keyFromEvent({ key: '-' }), '-');
  assert.equal(keyFromEvent({ key: '/' }), '/');
  assert.equal(keyFromEvent({ key: '.' }), '.');
  assert.equal(keyFromEvent({ key: '=' }), '=');
  assert.equal(keyFromEvent({ key: 'Escape' }), 'C');
  assert.equal(keyFromEvent({ key: 'a' }), null);
  assert.equal(keyFromEvent({ key: '5', ctrlKey: true }), null);
});

test('Escape resets the display to 0', () => {
  assert.equal(viaKeyboard(['9', '+', '1', 'Escape']), '0');
});

test('press does not mutate previous state', () => {
  const s = createState();
  const snapshot = { ...s };
  press(s, '5');
  assert.deepEqual(s, snapshot);
});
