import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert';
import { createSocket, Protocol, AddressFamily, SocketLevel, SocketOption } from '../../index.mjs';

const SKIP_ERRORS = [
  'Operation not permitted',
  'Protocol not supported',
];
const tryCreateSocket = (options) => {
  try {
    return createSocket(options);
  } catch (err) {
    if (SKIP_ERRORS.includes(err.message)) {
      return null;
    }
    throw err;
  }
};

describe('createSocket', () => {
  let socket = null;

  afterEach(() => {
    if (socket) {
      socket.pauseSend().pauseRecv();
      socket = null;
    }
  });

  it('should create a socket with default options', (t) => {
    // act
    socket = tryCreateSocket();

    // assert
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    assert.ok(socket);
    assert.strictEqual(typeof socket.send, 'function');
    assert.strictEqual(typeof socket.close, 'function');
  });

  it('should create a socket with ICMP protocol', (t) => {
    // arrange
    const options = {
      protocol: Protocol.ICMP
    };

    // act
    socket = tryCreateSocket(options);

    // assert
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    assert.ok(socket);
  });

  it('should create a socket with ICMPv6 protocol and IPv6 address family', (t) => {
    // arrange
    const options = {
      protocol: Protocol.ICMPv6,
      addressFamily: AddressFamily.IPv6
    };

    // act
    socket = tryCreateSocket(options);

    // assert
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    assert.ok(socket);
  });

  it('should create a socket with custom buffer size', (t) => {
    // arrange
    const options = {
      protocol: Protocol.ICMP,
      bufferSize: 8192
    };

    // act
    socket = tryCreateSocket(options);

    // assert
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    assert.ok(socket);
  });


  it('should support method chaining for pause/resume', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // act
    const result = socket.pauseSend().pauseRecv().resumeSend().resumeRecv();

    // assert
    assert.strictEqual(result, socket);
  });

  it('should chain pauseSend and pauseRecv', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // act
    const result = socket.pauseSend().pauseRecv();

    // assert
    assert.strictEqual(result, socket);
  });

  it('should use default buffer size of 4096', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // assert
    assert.strictEqual(socket.buffer.length, 4096);
  });

  it('should use custom buffer size', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP, bufferSize: 8192 });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // assert
    assert.strictEqual(socket.buffer.length, 8192);
  });

  it('should use small buffer size', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP, bufferSize: 1024 });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // assert
    assert.strictEqual(socket.buffer.length, 1024);
  });

  it('should create ICMPv6 socket with IPv6 address family', (t) => {
    // arrange
    const options = {
      protocol: Protocol.ICMPv6,
      addressFamily: AddressFamily.IPv6
    };

    // act
    socket = tryCreateSocket(options);

    // assert
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    assert.ok(socket);
  });
});

describe('Socket', () => {
  let socket = null;

  afterEach(() => {
    if (socket) {
      socket.pauseSend().pauseRecv();
      socket = null;
    }
  });

  it('should have pauseRecv method', (t) => {
    // arrange
    socket = tryCreateSocket();
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // act
    const result = socket.pauseRecv();

    // assert
    assert.strictEqual(result, socket);
  });

  it('should have pauseSend method', (t) => {
    // arrange
    socket = tryCreateSocket();
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // act
    const result = socket.pauseSend();

    // assert
    assert.strictEqual(result, socket);
  });

  it('should have resumeRecv method', (t) => {
    // arrange
    socket = tryCreateSocket();
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    socket.pauseRecv();

    // act
    const result = socket.resumeRecv();

    // assert
    assert.strictEqual(result, socket);
  });

  it('should have resumeSend method', (t) => {
    // arrange
    socket = tryCreateSocket();
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    socket.pauseSend();

    // act
    const result = socket.resumeSend();

    // assert
    assert.strictEqual(result, socket);
  });

  it('should be an EventEmitter', (t) => {
    // arrange
    socket = tryCreateSocket();
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // assert
    assert.strictEqual(typeof socket.on, 'function');
    assert.strictEqual(typeof socket.emit, 'function');
    assert.strictEqual(typeof socket.removeListener, 'function');
  });
});

describe('getOption', () => {
  let socket = null;

  afterEach(() => {
    if (socket) {
      socket.pauseSend().pauseRecv();
      socket = null;
    }
  });

  it('should get IP_TTL option', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    const buffer = Buffer.alloc(4);

    // act
    const len = socket.getOption(
      SocketLevel.IPPROTO_IP,
      SocketOption.IP_TTL,
      buffer,
      buffer.length
    );

    // assert
    assert.ok(len > 0);
  });

  it('should set IP_TTL option', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // act & assert (should not throw)
    socket.setOption(SocketLevel.IPPROTO_IP, SocketOption.IP_TTL, 64);
  });
});

describe('setOption', () => {
  let socket = null;

  afterEach(() => {
    if (socket) {
      socket.pauseSend().pauseRecv();
      socket = null;
    }
  });

  it('should set IP_TTL option', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }

    // act & assert (should not throw)
    socket.setOption(SocketLevel.IPPROTO_IP, SocketOption.IP_TTL, 64);
  });

  it('should set IP_TTL option with buffer', (t) => {
    // arrange
    socket = tryCreateSocket({ protocol: Protocol.ICMP });
    if (!socket) {
      t.skip('raw sockets require elevated privileges');
      return;
    }
    const ttlBuffer = Buffer.alloc(4);
    ttlBuffer.writeUInt32LE(128, 0);

    // act & assert (should not throw)
    socket.setOption(
      SocketLevel.IPPROTO_IP,
      SocketOption.IP_TTL,
      ttlBuffer,
      ttlBuffer.length
    );
  });
});
