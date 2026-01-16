import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert';
import { createSocket, Protocol, AddressFamily } from '../../index.mjs';

const tryCreateSocket = (options) => {
  try {
    return createSocket(options);
  } catch (err) {
    if (err.message === 'Operation not permitted') {
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
