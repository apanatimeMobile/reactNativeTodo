import React from 'react';
import { Text } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { ErrorBoundary } from './ErrorBoundary';
import { setActiveLocale } from '../i18n/locale';

describe('ErrorBoundary', () => {
  it('shows safe recovery copy and can retry without exposing the exception', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    let fail = true;
    function Child() {
      if (fail) throw new Error('private payload');
      return <Text>Recovered</Text>;
    }
    let root!: ReactTestRenderer;
    try {
      setActiveLocale('hi');
      await act(async () => { root = create(<ErrorBoundary><Child /></ErrorBoundary>); });
      expect(JSON.stringify(root.toJSON())).not.toContain('private payload');
      expect(JSON.stringify(root.toJSON())).toContain('फिर प्रयास करें');
      fail = false;
      await act(async () => {
        root.root.findByType(ErrorBoundary).instance.handleRetry();
      });
      expect(JSON.stringify(root.toJSON())).toContain('Recovered');
      await act(async () => root.unmount());
    } finally {
      log.mockRestore();
      setActiveLocale('en');
    }
  });
});
