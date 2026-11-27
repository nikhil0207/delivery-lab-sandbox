import ms from 'ms';

const duration = 90000;

console.log(`Duration: ${ms(duration)}`);
console.log(`Duration (long): ${ms(duration, { long: true })}`);
