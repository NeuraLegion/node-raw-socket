import { htons } from '../index.mjs';

if (process.argv.length < 3) {
  console.log('node htons <uint16>');
  process.exit(-1);
}

const uint16 = parseInt(process.argv[2], 10);

console.log(htons(uint16));
