/**
 * Browser-independent state machine for the calculator.
 * States are never modified; every accepted key produces a fresh state.
 */

const ERROR_DISPLAY = 'Cannot divide by zero';
const OPERATORS = new Set(['+', '-', '*', '/']);
const DIGITS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export function createState() {
  return {
    display: '0',
    accumulator: null,
    operator: null,
    waiting: false,
    error: false,
  };
}

/** Format a finite calculation result to at most twelve significant digits. */
export function formatNumber(n) {
  if (!Number.isFinite(n)) {
    throw new TypeError('formatNumber expects a finite number');
  }

  const rounded = Number(n.toPrecision(12));
  if (Object.is(rounded, -0) || rounded === 0) return '0';

  const absolute = Math.abs(rounded);
  if (absolute >= 1e12 || absolute < 1e-9) {
    // toExponential(11) supplies no more than twelve significant digits.
    const [mantissa, exponent] = rounded.toExponential(11).split('e');
    const tidyMantissa = mantissa.includes('.')
      ? mantissa.replace(/(?:\.0+|(?<=\..*?)0+)$/, '')
      : mantissa;
    // Number's exponent already includes an explicit sign for positive values.
    return `${tidyMantissa}e${exponent}`;
  }

  // Select enough decimal places to retain all twelve significant digits, then
  // remove insignificant typed-in calculation zeros.
  const magnitude = Math.floor(Math.log10(absolute));
  const places = Math.max(0, 11 - magnitude);
  return rounded.toFixed(places).replace(/\.0+$|(?<=\..*?)0+$/, '');
}

function evaluate(left, operator, right) {
  switch (operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return right === 0 ? null : left / right;
    default: return null;
  }
}

function errorState() {
  return {
    display: ERROR_DISPLAY,
    accumulator: null,
    operator: null,
    waiting: false,
    error: true,
  };
}

function digitCount(display) {
  return (display.match(/\d/g) || []).length;
}

function enterDigit(state, digit) {
  if (!state.waiting && digitCount(state.display) >= 12) return state;

  let display;
  if (state.waiting || state.display === '0') {
    display = digit;
  } else {
    display = state.display + digit;
  }
  return { ...state, display, waiting: false };
}

function enterDecimal(state) {
  if (state.waiting) {
    return { ...state, display: '0.', waiting: false };
  }
  if (state.display.includes('.')) return state;
  return { ...state, display: `${state.display}.` };
}

function enterOperator(state, operator) {
  if (state.operator !== null) {
    if (state.waiting) {
      // The right operand has not begun: replace the pending operation.
      return { ...state, operator };
    }

    const result = evaluate(state.accumulator, state.operator, Number(state.display));
    if (result === null) return errorState();
    return {
      ...state,
      display: formatNumber(result),
      accumulator: result,
      operator,
      waiting: true,
    };
  }

  return {
    ...state,
    accumulator: Number(state.display),
    operator,
    waiting: true,
  };
}

function enterEquals(state) {
  if (state.operator === null) return state;

  // The displayed left value is also the implicit right operand when no right
  // entry was made after an operator.
  const result = evaluate(state.accumulator, state.operator, Number(state.display));
  if (result === null) return errorState();
  return {
    ...state,
    display: formatNumber(result),
    accumulator: result,
    operator: null,
    waiting: true,
  };
}

/** Return the state resulting from one calculator key press. */
export function press(state, key) {
  if (state.error) return key === 'C' ? createState() : state;
  if (key === 'C') return createState();
  if (DIGITS.has(key)) return enterDigit(state, key);
  if (key === '.') return enterDecimal(state);
  if (OPERATORS.has(key)) return enterOperator(state, key);
  if (key === '=') return enterEquals(state);
  return state;
}

/** Translate a KeyboardEvent-like object to a calculator key. */
export function keyFromEvent(event) {
  if (!event || event.ctrlKey || event.metaKey || event.altKey) return null;
  const { key } = event;
  if (typeof key !== 'string') return null;
  if (DIGITS.has(key)) return key;
  if (key === '.' || key === ',') return '.';
  if (key === '+' || key === '-') return key;
  if (key === '*' || key === 'x' || key === 'X') return '*';
  if (key === '/') return '/';
  if (key === 'Enter' || key === '=') return '=';
  if (key === 'Escape') return 'C';
  return null;
}

export function getDisplay(state) {
  return state.display;
}
