import { hello } from './hello.js';

export function goodbye(name) {
  const greeting = hello(name);
  return greeting.replace(/^Hello/, 'Goodbye');
}
