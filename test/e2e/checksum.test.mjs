import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createChecksum, writeChecksum } from '../../index.mjs';

describe('createChecksum', () => {
  it('should calculate checksum for a buffer', () => {
    // arrange
    const buffer = Buffer.from([
      0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09, 0x61, 0x62, 0x63, 0x64,
      0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70,
      0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x61, 0x62, 0x63, 0x64, 0x65,
      0x66, 0x67, 0x68, 0x69
    ]);

    // act
    const checksum = createChecksum(buffer);

    // assert
    assert.strictEqual(typeof checksum, 'number');
    assert.ok(checksum >= 0 && checksum <= 0xffff);
  });

  it('should calculate checksum for multiple buffers', () => {
    // arrange
    const buffer1 = Buffer.from([
      0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09, 0x61, 0x62, 0x63, 0x64,
      0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70
    ]);
    const buffer2 = Buffer.from([
      0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x61, 0x62, 0x63, 0x64, 0x65,
      0x66, 0x67, 0x68, 0x69
    ]);

    // act
    const checksum = createChecksum(buffer1, buffer2);

    // assert
    assert.strictEqual(typeof checksum, 'number');
    assert.ok(checksum >= 0 && checksum <= 0xffff);
  });

  it('should accept buffer with offset and length', () => {
    // arrange
    const buffer = Buffer.from([
      0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09
    ]);
    const option = {
      buffer,
      offset: 0,
      length: buffer.length
    };

    // act
    const checksum = createChecksum(option);

    // assert
    assert.strictEqual(typeof checksum, 'number');
  });
});

describe('writeChecksum', () => {
  it('should write checksum to buffer at specified offset', () => {
    // arrange
    const buffer = Buffer.alloc(10);
    const checksum = 0x1234;
    const offset = 2;

    // act
    const result = writeChecksum(buffer, offset, checksum);

    // assert
    assert.strictEqual(result, buffer);
    assert.strictEqual(buffer[offset], 0x12);
    assert.strictEqual(buffer[offset + 1], 0x34);
  });

  it('should return the same buffer', () => {
    // arrange
    const buffer = Buffer.alloc(4);

    // act
    const result = writeChecksum(buffer, 0, 0xabcd);

    // assert
    assert.strictEqual(result, buffer);
  });
});
