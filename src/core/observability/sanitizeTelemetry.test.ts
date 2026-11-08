import { sanitizeTelemetry } from './sanitizeTelemetry';

describe('sanitizeTelemetry', () => {
  it('redacts auth and SSN values, including nested objects and arrays', () => {
    expect(sanitizeTelemetry({
      auth: 'bearer-value',
      ssn: '123-45-6789',
      nested: [{ authToken: 'nested-token', safe: 'visible' }],
    })).toEqual({
      auth: '[REDACTED]',
      ssn: '[REDACTED]',
      nested: [{ authToken: '[REDACTED]', safe: 'visible' }],
    });
  });
});
