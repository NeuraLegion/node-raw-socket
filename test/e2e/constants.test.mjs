import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AddressFamily, Protocol, SocketLevel, SocketOption } from '../../index.mjs';

describe('AddressFamily', () => {
  it('should have IPv4 mapped to 1', () => {
    // assert
    assert.strictEqual(AddressFamily.IPv4, 1);
  });

  it('should have IPv6 mapped to 2', () => {
    // assert
    assert.strictEqual(AddressFamily.IPv6, 2);
  });

  it('should have reverse mapping for IPv4', () => {
    // assert
    assert.strictEqual(AddressFamily[1], 'IPv4');
  });

  it('should have reverse mapping for IPv6', () => {
    // assert
    assert.strictEqual(AddressFamily[2], 'IPv6');
  });
});

describe('Protocol', () => {
  it('should have None mapped to 0', () => {
    // assert
    assert.strictEqual(Protocol.None, 0);
  });

  it('should have ICMP mapped to 1', () => {
    // assert
    assert.strictEqual(Protocol.ICMP, 1);
  });

  it('should have TCP mapped to 6', () => {
    // assert
    assert.strictEqual(Protocol.TCP, 6);
  });

  it('should have UDP mapped to 17', () => {
    // assert
    assert.strictEqual(Protocol.UDP, 17);
  });

  it('should have ICMPv6 mapped to 58', () => {
    // assert
    assert.strictEqual(Protocol.ICMPv6, 58);
  });

  it('should have reverse mappings', () => {
    // assert
    assert.strictEqual(Protocol[0], 'None');
    assert.strictEqual(Protocol[1], 'ICMP');
    assert.strictEqual(Protocol[6], 'TCP');
    assert.strictEqual(Protocol[17], 'UDP');
    assert.strictEqual(Protocol[58], 'ICMPv6');
  });
});

describe('SocketLevel', () => {
  it('should have IPPROTO_IP defined', () => {
    // assert
    assert.strictEqual(typeof SocketLevel.IPPROTO_IP, 'number');
  });

  it('should have IPPROTO_IPV6 defined', () => {
    // assert
    assert.strictEqual(typeof SocketLevel.IPPROTO_IPV6, 'number');
  });

  it('should have SOL_SOCKET defined', () => {
    // assert
    assert.strictEqual(typeof SocketLevel.SOL_SOCKET, 'number');
  });
});

describe('SocketOption', () => {
  it('should have IP_TTL defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.IP_TTL, 'number');
  });

  it('should have IP_HDRINCL defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.IP_HDRINCL, 'number');
  });

  it('should have IP_TOS defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.IP_TOS, 'number');
  });

  it('should have SO_BROADCAST defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.SO_BROADCAST, 'number');
  });

  it('should have SO_RCVBUF defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.SO_RCVBUF, 'number');
  });

  it('should have SO_SNDBUF defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.SO_SNDBUF, 'number');
  });

  it('should have IPV6_TTL defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.IPV6_TTL, 'number');
  });

  it('should have IPV6_UNICAST_HOPS defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.IPV6_UNICAST_HOPS, 'number');
  });

  it('should have IPV6_V6ONLY defined', () => {
    // assert
    assert.strictEqual(typeof SocketOption.IPV6_V6ONLY, 'number');
  });
});
