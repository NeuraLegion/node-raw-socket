import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  AddressFamily,
  Protocol,
  SocketLevel,
  SocketOption,
  createChecksum,
  createSocket,
  htonl,
  htons,
  ntohl,
  ntohs,
  writeChecksum
} from '../../index.mjs';

describe('exports', () => {
  it('should export AddressFamily constants', () => {
    // arrange
    const expectedKeys = ['IPv4', 'IPv6'];

    // act
    const keys = Object.keys(AddressFamily).filter((k) => isNaN(Number(k)));

    // assert
    assert.deepStrictEqual(keys.sort(), expectedKeys.sort());
  });

  it('should export Protocol constants', () => {
    // arrange
    const expectedKeys = ['None', 'ICMP', 'TCP', 'UDP', 'ICMPv6'];

    // act
    const keys = Object.keys(Protocol).filter((k) => isNaN(Number(k)));

    // assert
    assert.deepStrictEqual(keys.sort(), expectedKeys.sort());
  });

  it('should export SocketLevel constants', () => {
    // arrange
    const expectedKeys = ['IPPROTO_IP', 'IPPROTO_IPV6', 'SOL_SOCKET'];

    // act
    const keys = Object.keys(SocketLevel);

    // assert
    assert.deepStrictEqual(keys.sort(), expectedKeys.sort());
  });

  it('should export SocketOption constants', () => {
    // arrange
    const expectedOptions = [
      'SO_BROADCAST',
      'SO_RCVBUF',
      'SO_RCVTIMEO',
      'SO_SNDBUF',
      'SO_SNDTIMEO',
      'IP_HDRINCL',
      'IP_OPTIONS',
      'IP_TOS',
      'IP_TTL',
      'IPV6_TTL',
      'IPV6_UNICAST_HOPS',
      'IPV6_V6ONLY'
    ];

    // act
    const keys = Object.keys(SocketOption);

    // assert
    for (const option of expectedOptions) {
      assert.ok(keys.includes(option), `Missing option: ${option}`);
    }
  });

  it('should export createSocket function', () => {
    // assert
    assert.strictEqual(typeof createSocket, 'function');
  });

  it('should export createChecksum function', () => {
    // assert
    assert.strictEqual(typeof createChecksum, 'function');
  });

  it('should export writeChecksum function', () => {
    // assert
    assert.strictEqual(typeof writeChecksum, 'function');
  });

  it('should export byte order functions', () => {
    // assert
    assert.strictEqual(typeof htonl, 'function');
    assert.strictEqual(typeof htons, 'function');
    assert.strictEqual(typeof ntohl, 'function');
    assert.strictEqual(typeof ntohs, 'function');
  });
});
