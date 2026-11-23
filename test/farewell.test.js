import { test } from "node:test";
import assert from "node:assert/strict";
import { farewell } from "../src/farewell.js";

test("says goodbye by name", () => {
  assert.equal(farewell("Ada"), "Goodbye, Ada!");
});
