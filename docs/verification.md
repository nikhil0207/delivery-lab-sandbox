# Calculator verification checklist

Owner-review checklist for the integrated calculator.

- **PASS (automated)**: observed by running code in the sandbox.
- **NOT RUN**: needs a real browser, which the sandbox does not provide. The owner must check these by hand.

## Test command

`npm test` (runs `node --test`). Result: 29 tests, 29 pass, 0 fail. Node v22.

Additional check: a throwaway script drove `src/calculator.mjs` (`press`, `keyFromEvent`, `getDisplay`) with each criterion's key sequence. The script lived outside the repository.

## Browsers and viewport widths

| Browser | Viewport width | Status |
|---|---|---|
| Chrome (current) | 1280 px | NOT RUN |
| Firefox (current) | 1280 px | NOT RUN |
| Safari (current) | 1280 px | NOT RUN |
| Any of the above | 320 px | NOT RUN |

No browser was available, so no browser, layout, or focus result is claimed as passed.

## Criteria

| # | Criterion | Result | Evidence |
|---|---|---|---|
| 1 | 2+3=5, 7-4=3, 6*4=24, 8/2=4 | PASS (automated) | Displays "5", "3", "24", "4" |
| 2a | 0.1+0.2= shows 0.3 | PASS (automated) | Displays "0.3" |
| 2b | 1 . . 5 shows 1.5 | PASS (automated) | Displays "1.5" |
| 3 | 2+3*4= shows 20 | PASS (automated) | Displays "20" (left to right) |
| 4a | 8/0= shows a readable error | PASS (automated) | Displays "Cannot divide by zero" |
| 4b | Clear shows 0, then 1+1= shows 2 | PASS (automated) | Displays "0", then "2" (state only; no page reload involved) |
| 5a | On-screen 6*4= shows 24 | PASS (automated) | Logic level; button click wiring NOT RUN in a browser |
| 5b | Keyboard 6, *, 4, Enter shows 24 | PASS (automated) | `keyFromEvent` maps to 6,*,4,=; displays "24". Real key events NOT RUN |
| 5c | Clear button and Escape reset to 0 | PASS (automated) | Escape maps to C and displays "0". Button click NOT RUN |
| 5d | Visible focus on every button via Tab | NOT RUN | CSS has `.key:focus-visible` outline (code review only) |
| 6 | 320 px width, no horizontal scroll | NOT RUN | CSS uses a 4-column fluid grid and a `max-width: 360px` media query (code review only) |

## Failures

None observed. Criteria marked NOT RUN are unverified, not passed.

## Manual steps for the owner

1. Run `npm test` and confirm 0 failures.
2. Serve the repository root statically (for example `python3 -m http.server`) and open `index.html` in each browser listed above.
3. Click 6, ×, 4, = and confirm 24. Click C and confirm 0.
4. Press 6, *, 4, Enter and confirm 24. Press Escape and confirm 0.
5. Press Tab repeatedly and confirm every button shows a visible focus outline.
6. Set the viewport to 320 px wide (devtools device mode). Confirm no horizontal scrollbar and that every key is reachable and tappable.
7. Enter 8, ÷, 0, = and confirm the error message. Press C, then 1 + 1 = and confirm 2 without reloading.

If any step fails, record the browser, viewport width, exact keys pressed, expected result, and actual result here.
