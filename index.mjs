import { EventEmitter } from 'node:events';
import { isIP } from 'node:net';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodeGypBuild from 'node-gyp-build';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const raw = nodeGypBuild(__dirname);

const expandConstantObject = (object) => {
  const keys = Object.keys(object);
  for (const key of keys) {
    object[object[key]] = parseInt(key, 10);
  }
};

const AddressFamily = {
  1: 'IPv4',
  2: 'IPv6'
};

expandConstantObject(AddressFamily);

const Protocol = {
  0: 'None',
  1: 'ICMP',
  6: 'TCP',
  17: 'UDP',
  58: 'ICMPv6'
};

expandConstantObject(Protocol);

for (const key of Object.keys(EventEmitter.prototype)) {
  raw.SocketWrap.prototype[key] = EventEmitter.prototype[key];
}

class Socket extends EventEmitter {
  constructor(options) {
    super();

    this.requests = [];
    this.buffer = Buffer.alloc(options?.bufferSize ?? 4096);

    this.recvPaused = false;
    this.sendPaused = true;

    this.wrap = new raw.SocketWrap(
      options?.protocol ?? 0,
      options?.addressFamily ?? AddressFamily.IPv4
    );

    this.wrap.on('sendReady', this.onSendReady.bind(this));
    this.wrap.on('recvReady', this.onRecvReady.bind(this));
    this.wrap.on('error', this.onError.bind(this));
    this.wrap.on('close', this.onClose.bind(this));
  }

  close() {
    this.wrap.close();
    return this;
  }

  getOption(level, option, value, length) {
    return this.wrap.getOption(level, option, value, length);
  }

  onClose() {
    this.emit('close');
  }

  onError(error) {
    this.emit('error', error);
    this.close();
  }

  onRecvReady() {
    try {
      this.wrap.recv(this.buffer, (buffer, bytes, source) => {
        const newBuffer = buffer.slice(0, bytes);
        this.emit('message', newBuffer, source);
      });
    } catch (error) {
      this.emit('error', error);
    }
  }

  onSendReady() {
    if (this.requests.length > 0) {
      const req = this.requests.shift();
      try {
        req.beforeCallback?.();
        this.wrap.send(req.buffer, req.offset, req.length, req.address, (bytes) => {
          req.afterCallback.call(this, null, bytes);
        });
      } catch (error) {
        req.afterCallback.call(this, error, 0);
      }
    } else if (!this.sendPaused) {
      this.pauseSend();
    }
  }

  pauseRecv() {
    this.recvPaused = true;
    this.wrap.pause(this.recvPaused, this.sendPaused);
    return this;
  }

  pauseSend() {
    this.sendPaused = true;
    this.wrap.pause(this.recvPaused, this.sendPaused);
    return this;
  }

  resumeRecv() {
    this.recvPaused = false;
    this.wrap.pause(this.recvPaused, this.sendPaused);
    return this;
  }

  resumeSend() {
    this.sendPaused = false;
    this.wrap.pause(this.recvPaused, this.sendPaused);
    return this;
  }

  send(buffer, offset, length, address, beforeCallback, afterCallback) {
    if (!afterCallback) {
      afterCallback = beforeCallback;
      beforeCallback = null;
    }

    if (length + offset > buffer.length) {
      afterCallback.call(
        this,
        new Error(
          `Buffer length '${buffer.length}' is not large enough for the specified offset '${offset}' plus length '${length}'`
        )
      );
      return this;
    }

    if (!isIP(address)) {
      afterCallback.call(this, new Error(`Invalid IP address '${address}'`));
      return this;
    }

    const req = {
      buffer,
      offset,
      length,
      address,
      afterCallback,
      beforeCallback
    };
    this.requests.push(req);

    if (this.sendPaused) {
      this.resumeSend();
    }

    return this;
  }

  setOption(level, option, value, length) {
    if (arguments.length > 3) {
      this.wrap.setOption(level, option, value, length);
    } else {
      this.wrap.setOption(level, option, value);
    }
  }
}

const createChecksum = (...args) => {
  let sum = 0;
  for (const object of args) {
    if (object instanceof Buffer) {
      sum = raw.createChecksum(sum, object, 0, object.length);
    } else {
      sum = raw.createChecksum(sum, object.buffer, object.offset, object.length);
    }
  }
  return sum;
};

const writeChecksum = (buffer, offset, checksum) => {
  buffer.writeUInt8((checksum & 0xff00) >> 8, offset);
  buffer.writeUInt8(checksum & 0xff, offset + 1);
  return buffer;
};

const createSocket = (options) => new Socket(options ?? {});

const SocketLevel = raw.SocketLevel;
const SocketOption = raw.SocketOption;

const htonl = raw.htonl;
const htons = raw.htons;
const ntohl = raw.ntohl;
const ntohs = raw.ntohs;

export {
  AddressFamily,
  Protocol,
  Socket,
  SocketLevel,
  SocketOption,
  createChecksum,
  createSocket,
  htonl,
  htons,
  ntohl,
  ntohs,
  writeChecksum
};
