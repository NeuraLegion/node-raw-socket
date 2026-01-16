import { describe, it } from 'node:test';
import assert from 'node:assert';
import { htonl, htons, ntohl, ntohs } from '../../index.mjs';

describe('htonl', () => {
  it('should convert host to network byte order for 32-bit value', () => {
    // arrange
    const hostValue = 0x12345678;

    // act
    const networkValue = htonl(hostValue);

    // assert
    assert.strictEqual(typeof networkValue, 'number');
  });

  it('should be reversible with ntohl', () => {
    // arrange
    const original = 0x12345678;

    // act
    const converted = ntohl(htonl(original));

    // assert
    assert.strictEqual(converted, original);
  });
});

describe('htons', () => {
  it('should convert host to network byte order for 16-bit value', () => {
    // arrange
    const hostValue = 0x1234;

    // act
    const networkValue = htons(hostValue);

    // assert
    assert.strictEqual(typeof networkValue, 'number');
  });

  it('should be reversible with ntohs', () => {
    // arrange
    const original = 0x1234;

    // act
    const converted = ntohs(htons(original));

    // assert
    assert.strictEqual(converted, original);
  });
});

describe('ntohl', () => {
  it('should convert network to host byte order for 32-bit value', () => {
    // arrange
    const networkValue = 0x78563412;

    // act
    const hostValue = ntohl(networkValue);

    // assert
    assert.strictEqual(typeof hostValue, 'number');
  });
});

describe('ntohs', () => {
  it('should convert network to host byte order for 16-bit value', () => {
    // arrange
    const networkValue = 0x3412;

    // act
    const hostValue = ntohs(networkValue);

    // assert
    assert.strictEqual(typeof hostValue, 'number');
  });
});
