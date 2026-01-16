import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createChecksum, writeChecksum } from '../../index.mjs';

describe('ICMP checksum calculation', () => {
  it('should calculate valid checksum for ICMP echo request', () => {
    // arrange
    const icmpPacket = Buffer.from([
      0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09,
      0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
      0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70,
      0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x61,
      0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69
    ]);

    // act
    const checksum = createChecksum(icmpPacket);

    // assert
    assert.strictEqual(typeof checksum, 'number');
    assert.ok(checksum > 0, 'checksum should be non-zero');
  });

  it('should write checksum to ICMP packet at offset 2', () => {
    // arrange
    const icmpPacket = Buffer.from([
      0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09,
      0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68
    ]);
    const checksum = createChecksum(icmpPacket);

    // act
    writeChecksum(icmpPacket, 2, checksum);

    // assert
    const writtenChecksum = (icmpPacket[2] << 8) | icmpPacket[3];
    assert.strictEqual(writtenChecksum, checksum);
  });

  it('should produce consistent checksum for same input', () => {
    // arrange
    const packet = Buffer.from([
      0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09
    ]);

    // act
    const checksum1 = createChecksum(packet);
    const checksum2 = createChecksum(packet);

    // assert
    assert.strictEqual(checksum1, checksum2);
  });

  it('should calculate different checksum for different data', () => {
    // arrange
    const packet1 = Buffer.from([0x08, 0x00, 0x00, 0x00]);
    const packet2 = Buffer.from([0x08, 0x00, 0x00, 0x01]);

    // act
    const checksum1 = createChecksum(packet1);
    const checksum2 = createChecksum(packet2);

    // assert
    assert.notStrictEqual(checksum1, checksum2);
  });

  it('should calculate checksum for split buffers matching combined buffer', () => {
    // arrange
    const combined = Buffer.from([
      0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09,
      0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68
    ]);
    const part1 = Buffer.from([0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09]);
    const part2 = Buffer.from([0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68]);

    // act
    const combinedChecksum = createChecksum(combined);
    const splitChecksum = createChecksum(part1, part2);

    // assert
    assert.strictEqual(splitChecksum, combinedChecksum);
  });

  it('should calculate checksum using offset and length options', () => {
    // arrange
    const buffer = Buffer.from([
      0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x0a, 0x09, 0x00, 0x00
    ]);
    const option = {
      buffer,
      offset: 2,
      length: 8
    };

    // act
    const checksum = createChecksum(option);

    // assert
    assert.strictEqual(typeof checksum, 'number');
  });

  it('should mix buffer and option objects', () => {
    // arrange
    const buffer1 = Buffer.from([0x08, 0x00, 0x00, 0x00]);
    const largeBuffer = Buffer.from([
      0xff, 0xff, 0x00, 0x01, 0x0a, 0x09, 0xff, 0xff
    ]);
    const option = {
      buffer: largeBuffer,
      offset: 2,
      length: 4
    };

    // act
    const checksum = createChecksum(buffer1, option);

    // assert
    assert.strictEqual(typeof checksum, 'number');
  });
});
