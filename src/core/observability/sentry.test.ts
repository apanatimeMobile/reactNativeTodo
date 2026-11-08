import { captureException } from "@/core/observability/sentry";

it('does not log raw exception payloads and redacts structured personal data', () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    captureException(new Error('private exception payload'), { email: 'private@example.invalid' });
    expect(log).toHaveBeenCalledWith('[Observability] Exception captured:', { email: '[REDACTED]' });
    expect(JSON.stringify(log.mock.calls)).not.toContain('private exception payload');
    expect(JSON.stringify(log.mock.calls)).not.toContain('private@example.invalid');
  } finally {
    log.mockRestore();
  }
});
