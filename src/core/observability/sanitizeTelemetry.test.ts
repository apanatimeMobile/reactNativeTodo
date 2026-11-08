import { sanitizeTelemetry } from "@/core/observability/sanitizeTelemetry";

describe('sanitizeTelemetry', () => {
  it('redacts auth and SSN values, including nested objects and arrays', () => {
    expect(sanitizeTelemetry({
      auth: 'bearer-value',
      ssn: '123-45-6789',
      email: 'private@example.invalid',
      nestedProfile: { phone: '1234567890', fullName: 'Private Person' },
      nested: [{ authToken: 'nested-token', safe: 'visible' }],
    })).toEqual({
      auth: '[REDACTED]',
      ssn: '[REDACTED]',
      email: '[REDACTED]',
      nestedProfile: { phone: '[REDACTED]', fullName: '[REDACTED]' },
      nested: [{ authToken: '[REDACTED]', safe: 'visible' }],
    });
  });
});
