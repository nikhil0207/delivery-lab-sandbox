# Calculator Behavior Specification

Single-page calculator: add, subtract, multiply, divide, decimal entry, equals and clear. Chained operations evaluate strictly left to right with no operator precedence. Scientific functions, history, memory, percent, sign toggle and backspace are out of scope.

## Module interface (src/calculator.mjs)

Pure functions, no DOM access. State objects are treated as immutable: no function ever mutates a state it receives.

- `createState()` returns a new initial state, whose display is `"0"`.
- `press(state, key)` returns the next state.
  - If the key changes the state, it returns a new object.
  - If the key is ignored, it returns the same state object it was given (reference-equal, `press(s, k) === s`). Ignored keys are: unknown keys, any key except `C` while in the error state, a 13th digit, a second `.` in one entry, and `=` with no pending operator.
  - A key that is accepted but produces an equivalent state (for example `C` from the initial state) still returns a new object.
- `getDisplay(state)` returns the display string.
- `formatNumber(n)` returns the display string for a finite number (see Result formatting).
- `keyFromEvent(event)` returns a calculator key for a keyboard event (`{ key, ctrlKey, metaKey, altKey }`), or `null` if the key is unmapped. Missing modifier fields count as false.

State shape: `{ display: string, accumulator: number|null, operator: string|null, waiting: boolean, error: boolean }`.

### Calculator keys

`"0"`-`"9"`, `"."`, `"+"`, `"-"`, `"*"`, `"/"`, `"="`, `"C"`.

On-screen buttons show the symbols +, −, ×, ÷, = and C, but call `press` with the ASCII keys above.

## Keyboard mappings

| Keyboard key | Calculator key |
| --- | --- |
| 0-9 (main row or numpad) | the same digit |
| `.` or `,` | `.` |
| `+` | `+` |
| `-` | `-` |
| `*` or `x` or `X` | `*` |
| `/` | `/` |
| `Enter` or `=` | `=` |
| `Escape` | `C` |
| anything else | ignored (`null`) |

The app calls `preventDefault()` for mapped keys, so that `/` does not open browser quick find and Enter does not re-activate a focused button. Modifier combinations (Ctrl, Meta, Alt) are not mapped (`null`).

## Rules

1. Initial display is `0`.
2. Digit: if the display is `0` or a new entry is waiting, it replaces the display; otherwise it appends. Entry is limited to 12 digits (the decimal point does not count); extra digits are ignored.
3. Decimal point: if a new entry is waiting it gives `0.`; if the entry already has a `.`, the key is ignored; otherwise it appends `.`.
4. Operator: if an operator is pending and an operand was entered, the pending operation is evaluated first, the result is shown and the new operator becomes pending. If no operand was entered since the last operator, the pending operator is replaced. With no previous value, the displayed value (initially 0) becomes the left operand.
5. Equals: if an operator is pending, evaluate it and show the result; the operator is cleared. With no pending operator, equals is ignored. If the right operand is missing, the displayed value is used. Repeated equals does not repeat the operation.
6. A digit after equals starts a new entry; an operator after equals continues from the result.
7. Clear (`C`, Escape): resets to the initial state, display `0`, from any state including error.
8. Division by zero: display `Cannot divide by zero`, error state set. All keys except `C` are ignored until cleared.

## Result formatting

One precision rule applies everywhere: results carry at most 12 significant digits.

- Round to 12 significant digits (`Number(n.toPrecision(12))`) to remove floating point noise, then print without trailing zeros. So 0.1 + 0.2 shows `0.3`.
- Integers show no decimal point (`4`, not `4.0`).
- Negative results use a leading `-`. Negative zero shows `0`.
- If the absolute value is at least 1e12, or nonzero and below 1e-9, use exponential notation: the mantissa has at most 12 significant digits (up to 11 fraction digits) with trailing zeros removed, followed by `e`, a sign and the exponent (for example `1e+12`, `9.99999999999e+12`, `1e-10`).
- Typed entries are shown as typed (`1.`, `1.50`) until an operator or equals is pressed.

## Behavior table

Each row starts from the cleared state. Keys are pressed in order and the final display is shown.

| Input sequence | Display after sequence | Notes |
| --- | --- | --- |
| (none) | `0` | initial |
| 7 | `7` | |
| 0 0 7 | `7` | leading zeros collapse |
| 2 + 3 = | `5` | |
| 7 - 4 = | `3` | |
| 6 * 4 = | `24` | |
| 8 / 2 = | `4` | |
| 2 + | `2` | operator shows the left operand |
| 2 + 3 | `3` | entering right operand |
| . | `0.` | |
| . 5 | `0.5` | |
| 1 . . 5 | `1.5` | second decimal point ignored |
| 1 . 5 + 2 . 5 = | `4` | |
| 0 . 1 + 0 . 2 = | `0.3` | rounding |
| 2 + 3 * 4 = | `20` | left to right |
| 2 + 3 * | `5` | chaining shows the intermediate result |
| 2 + * 3 = | `6` | operator replaced; 2 * 3 |
| 1 0 - 2 - 3 = | `5` | |
| 5 = | `5` | equals with no operator is ignored |
| 2 + 3 = = | `5` | no repeat |
| 2 + 3 = * 4 = | `20` | continue from result |
| 2 + 3 = 7 | `7` | digit after equals starts new entry |
| 2 + = | `4` | missing right operand uses the displayed value (2 + 2) |
| - 5 = | `-5` | missing left operand is 0 |
| 3 - 5 = | `-2` | |
| 1 / 3 = | `0.333333333333` | 12 significant digits |
| 9 9 9 9 9 9 9 9 9 9 9 9 * 1 0 = | `9.99999999999e+12` | exponential; 12 significant digits |
| 1 2 3 4 5 6 7 8 9 0 1 2 3 | `123456789012` | 13th digit ignored |
| 8 / 0 = | `Cannot divide by zero` | error state |
| 8 / 0 = 5 | `Cannot divide by zero` | input ignored in error |
| 8 / 0 = C | `0` | clear recovers |
| 8 / 0 = C 1 + 1 = | `2` | works again without reload |
| 5 + 3 C | `0` | clear mid-expression |
| 5 + 3 C 4 = | `4` | pending operator was discarded |
| Keyboard: 6 * 4 Enter | `24` | same as on-screen |
| Keyboard: 6 * 4 Escape | `0` | Escape clears |

## Display and accessibility

- The display is a single read-only element with `role="status"` and `aria-live="polite"`.
- Long values must not widen the page: the display scrolls or shrinks within its box.
- Every button is a native `button` element with a visible focus outline.
- At 320 CSS pixels wide there is no horizontal scrolling; the keypad is a 4-column grid.
