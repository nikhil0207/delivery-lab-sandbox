import { test } from "node:test";
import assert from "node:assert/strict";
import { whisper } from "../src/whisper.js";

test("whispers mixed case text in lower case with an ellipsis", () => {
  assert.equal(whisper("Hello World"), "hello world...");
});

test("keeps already lower case text and adds an ellipsis", () => {
  assert.equal(whisper("already quiet"), "already quiet...");
});

test("lowers partly upper case text", () => {
  assert.equal(whisper("ALREADY quiet"), "already quiet...");
});

test("returns just an ellipsis for an empty string", () => {
  assert.equal(whisper(""), "...");
});

test("preserves existing punctuation and whitespace", () => {
  assert.equal(whisper("Hi, There!"), "hi, there!...");
  assert.equal(whisper("  Spaced  Out  "), "  spaced  out  ...");
  assert.equal(whisper("Wait..."), "wait......");
});
