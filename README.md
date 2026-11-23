# delivery-lab-sandbox

A throwaway repository for trying AIRoundTable Delivery Lab repository runs.

- Test command: `npm test` (Node's built-in test runner, no dependencies).
- GitHub Actions runs the same command as the `test` check on every pull request.

Suggested trial plan for Delivery Lab (two tasks, separate owned paths):

| Task | Role | Owned paths | Deliverable |
| --- | --- | --- | --- |
| `farewell` | developer | `src/farewell.js`, `test/farewell.test.js` | A `farewell(name)` function returning `Goodbye, <name>!`, with a test |
| `shout` | developer | `src/shout.js`, `test/shout.test.js` | A `shout(text)` function returning the text in upper case with `!`, with a test |
