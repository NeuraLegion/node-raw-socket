import { htonl } from '../index.mjs';

if (process.argv.length < 3) {
  console.log('node htonl <uint32>');
  process.exit(-1);
}

const uint32 = parseInt(process.argv[2], 10);

console.log(htonl(uint32));
