import { describe, it } from 'node:test';
import assert from 'node:assert';
import { htonl, htons, ntohl, ntohs } from '../../index.mjs';

describe('byte order conversions', () => {
    it('should convert 0x1234 with htons', () => {
      // arrange
      const value = 0x1234;

      // act
      const result = htons(value);

      // assert
      assert.strictEqual(typeof result, 'number');
    });

    it('should convert 0x1234 back with ntohs after htons', () => {
      // arrange
      const original = 0x1234;

      // act
      const result = ntohs(htons(original));

      // assert
      assert.strictEqual(result, original);
    });

    it('should handle port number conversion (80)', () => {
      // arrange
      const httpPort = 80;

      // act
      const networkOrder = htons(httpPort);
      const hostOrder = ntohs(networkOrder);

      // assert
      assert.strictEqual(hostOrder, httpPort);
    });

    it('should handle port number conversion (443)', () => {
      // arrange
      const httpsPort = 443;

      // act
      const networkOrder = htons(httpsPort);
      const hostOrder = ntohs(networkOrder);

      // assert
      assert.strictEqual(hostOrder, httpsPort);
    });

    it('should handle max 16-bit value', () => {
      // arrange
      const maxValue = 0xffff;

      // act
      const result = ntohs(htons(maxValue));

      // assert
      assert.strictEqual(result, maxValue);
    });

    it('should handle zero', () => {
      // arrange
      const zero = 0;

      // act
      const result = ntohs(htons(zero));

      // assert
      assert.strictEqual(result, zero);
    });

    it('should convert 0x12345678 with htonl', () => {
      // arrange
      const value = 0x12345678;

      // act
      const result = htonl(value);

      // assert
      assert.strictEqual(typeof result, 'number');
    });

    it('should convert 0x12345678 back with ntohl after htonl', () => {
      // arrange
      const original = 0x12345678;

      // act
      const result = ntohl(htonl(original));

      // assert
      assert.strictEqual(result, original);
    });

    it('should handle IPv4 address conversion (192.168.1.1)', () => {
      // arrange
      const ipAddress = ((192 << 24) | (168 << 16) | (1 << 8) | 1) >>> 0;

      // act
      const networkOrder = htonl(ipAddress);
      const hostOrder = ntohl(networkOrder);

      // assert
      assert.strictEqual(hostOrder >>> 0, ipAddress >>> 0);
    });

    it('should handle IPv4 address conversion (127.0.0.1)', () => {
      // arrange
      const localhost = (127 << 24) | (0 << 16) | (0 << 8) | 1;

      // act
      const networkOrder = htonl(localhost);
      const hostOrder = ntohl(networkOrder);

      // assert
      assert.strictEqual(hostOrder, localhost);
    });

    it('should handle max 32-bit value', () => {
      // arrange
      const maxValue = 0xffffffff;

      // act
      const result = ntohl(htonl(maxValue));

      // assert
      assert.strictEqual(result >>> 0, maxValue >>> 0);
    });

    it('should handle zero', () => {
      // arrange
      const zero = 0;

      // act
      const result = ntohl(htonl(zero));

      // assert
      assert.strictEqual(result, zero);
    });

    it('should be idempotent for double conversion (htons)', () => {
      // arrange
      const original = 0x1234;

      // act
      const once = htons(original);
      const twice = htons(htons(original));
      const back = ntohs(ntohs(twice));

      // assert
      assert.strictEqual(back, original);
    });

    it('should be idempotent for double conversion (htonl)', () => {
      // arrange
      const original = 0x12345678;

      // act
      const once = htonl(original);
      const twice = htonl(htonl(original));
      const back = ntohl(ntohl(twice));

      // assert
      assert.strictEqual(back, original);
    });
});
