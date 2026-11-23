import { test } from "node:test";
import assert from "node:assert/strict";
import { shout } from "../src/shout.js";

test("shouts text in upper case with an exclamation mark", () => {
  assert.equal(shout("hello"), "HELLO!");
});
