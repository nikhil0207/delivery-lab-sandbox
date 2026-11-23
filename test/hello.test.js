import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hello } from '../src/hello.js';

test('hello returns greeting for World', () => {
  assert.equal(hello('World'), 'Hello, World!');
});

test('hello returns greeting for another name', () => {
  assert.equal(hello('Ada'), 'Hello, Ada!');
});
