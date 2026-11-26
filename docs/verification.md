# Calculator verification checklist

Owner-review checklist for the integrated calculator.

- **PASS**: observed in the stated environment.
- **NOT RUN**: not checked. Unverified, not passed.

## Test command

`npm test` (runs `node --test`). Result: 29 tests, 29 pass, 0 fail. Node v22.

## Browsers and viewport widths

The UI checks ran in a real browser engine: headless Chromium 158.0.8127.0, driven by playwright-core with the `@sparticuz/chromium` build. The repository root was served over local HTTP and `index.html` was loaded with its real CSS and ES modules. Interactions used real Playwright clicks and real keyboard presses. The page reported no uncaught page errors.

| Browser | Viewport width | Status |
|---|---|---|
| Chromium 158 (headless) | 1280 px | Checked, all criteria PASS |
| Chromium 158 (headless) | 320 px | Checked, all criteria PASS |
| Firefox | any | NOT RUN (not available in the sandbox) |
| Safari / WebKit | any | NOT RUN (not available in the sandbox) |

Only Chromium was exercised. Firefox and Safari remain for the owner to check.

## Criteria

Each result below was observed through the real page. Buttons were clicked with Playwright, and keyboard input was sent as real key presses. Both viewport widths are listed.

| # | Criterion | 1280 px | 320 px | Observed |
|---|---|---|---|---|
| 1a | 2 + 3 = shows 5 | PASS | PASS | "5" |
| 1b | 7 − 4 = shows 3 | PASS | PASS | "3" |
| 1c | 6 × 4 = shows 24 | PASS | PASS | "24" |
| 1d | 8 ÷ 2 = shows 4 | PASS | PASS | "4" |
| 2a | 0.1 + 0.2 = shows 0.3 | PASS | PASS | "0.3" |
| 2b | 1 . . 5 shows 1.5 | PASS | PASS | "1.5" |
| 3 | 2 + 3 × 4 = shows 20 | PASS | PASS | "20" (left to right) |
| 4a | 8 ÷ 0 = shows a readable error | PASS | PASS | "Cannot divide by zero" |
| 4b | Clear shows 0, then 1 + 1 = shows 2, no reload | PASS | PASS | "0", then "2" in the same page session, no reload between steps |
| 5a | On-screen 6 × 4 = shows 24 | PASS | PASS | Button clicks produce "24" |
| 5b | Keyboard 6, *, 4, Enter shows 24 | PASS | PASS | Real key presses with no button focused produce "24" |
| 5c | Clear button and Escape reset to 0 | PASS | PASS | Clear button click gives "0"; Escape gives "0" |
| 5d | Visible focus on every button via Tab | PASS | PASS | Tab reached all 17 buttons; each matched `:focus-visible` with a computed outline of at least 2 px |
| 6 | 320 px: no horizontal scrolling, controls usable | n/a | PASS | At 320 px: scrollWidth 320 = clientWidth 320, and every button and the display lie inside the viewport. At 1280 px: scrollWidth 1280 = clientWidth 1280 |

Limits of these checks:

- 5d was checked programmatically through computed styles. No screenshot was inspected, so owner review of the outline's appearance is still welcome.
- Criterion 6 "usable" was checked as in-viewport and at least 20 × 30 px per control, not by touch testing on a real device.

## Failures

None observed in Chromium at 1280 px or 320 px. Firefox and Safari were not checked.

## Manual steps for the owner (remaining browsers)

1. Run `npm test` and confirm 0 failures.
2. Serve the repository root statically (for example `python3 -m http.server`) and open `index.html` in Firefox and Safari.
3. Click 6, ×, 4, = and confirm 24. Click C and confirm 0.
4. Press 6, *, 4, Enter and confirm 24. Press Escape and confirm 0.
5. Press Tab repeatedly and confirm every button shows a visible focus outline.
6. Set the viewport to 320 px wide. Confirm no horizontal scrollbar and that every key is reachable.
7. Enter 8, ÷, 0, = and confirm the error. Press C, then 1 + 1 = and confirm 2 without reloading.

If any step fails, record the browser, viewport width, exact keys pressed, expected result, and actual result here.
