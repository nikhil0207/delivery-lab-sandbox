import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goodbye } from '../src/goodbye.js';

test('goodbye returns a farewell for World', () => {
  assert.equal(goodbye('World'), 'Goodbye, World!');
});

test('goodbye returns a farewell for another name', () => {
  assert.equal(goodbye('Ada'), 'Goodbye, Ada!');
});

test('goodbye handles an empty name', () => {
  assert.equal(goodbye(''), 'Goodbye, !');
});
