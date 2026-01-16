import { Protocol, SocketLevel, SocketOption, createSocket } from '../index.mjs';

if (process.argv.length < 4) {
  console.log('node get-option <name> <option>');
  process.exit(-1);
}

let level = process.argv[2];
let option = process.argv[3];

level = SocketLevel[level] || parseInt(level, 10);
option = SocketOption[option] || parseInt(option, 10);

const options = {
  protocol: Protocol.ICMP
};

const socket = createSocket(options);

const buffer = Buffer.alloc(4096);
const len = socket.getOption(level, option, buffer, buffer.length);

socket.pauseSend().pauseRecv();

console.log(buffer.toString('hex', 0, len));
