/**
 * RESPONSIBILITY: Verifies profile field validation, normalization and optional-phone compatibility.
 * FLOW: Profile payloads pass through UserProfileEditSchema before the save callback is invoked.
 */
import { UserFeedbackSubmitSchema, UserProfileEditSchema } from './user_settings.schema';

describe('UserProfileEditSchema', () => {
  it('trims valid profile values while allowing an empty optional phone number', () => {
    const parsed = UserProfileEditSchema.safeParse({
      name: '  Alex Kim  ',
      email: '  alex@example.com  ',
      phone: '',
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.name).toBe('Alex Kim');
    expect(parsed.data.email).toBe('alex@example.com');
    expect(parsed.data.phone).toBe('');
  });

  it('rejects an invalid name and email with field-scoped errors', () => {
    const parsed = UserProfileEditSchema.safeParse({
      name: 'A',
      email: 'not-an-email',
      phone: '12345',
    });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.error.issues.some((issue) => issue.path[0] === 'name')).toBe(true);
    expect(parsed.error.issues.some((issue) => issue.path[0] === 'email')).toBe(true);
    expect(parsed.error.issues.some((issue) => issue.path[0] === 'phone')).toBe(true);
  });
});

describe('UserFeedbackSubmitSchema', () => {
  it('accepts the documented message and rating boundaries', () => {
    expect(UserFeedbackSubmitSchema.safeParse({
      category: 'bug', rating: 1, message: '12345',
    }).success).toBe(true);
    expect(UserFeedbackSubmitSchema.safeParse({
      category: 'other', rating: 5, message: 'x'.repeat(1000),
    }).success).toBe(true);
  });

  it('rejects invalid category, rating, and message lengths with field-scoped keys', () => {
    const parsed = UserFeedbackSubmitSchema.safeParse({
      category: 'unknown', rating: 6, message: 'tiny',
    });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.error.issues.map(({ message }) => message)).toEqual(expect.arrayContaining([
      'user_settings_profile.VALIDATION_FEEDBACK_CATEGORY',
      'user_settings_profile.VALIDATION_FEEDBACK_RATING_MAX',
      'user_settings_profile.VALIDATION_FEEDBACK_MESSAGE_MIN',
    ]));
  });
});
