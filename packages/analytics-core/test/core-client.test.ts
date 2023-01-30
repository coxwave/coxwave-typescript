import { CoxwaveCore } from '../src/index';

import { useDefaultConfig } from './helpers/default';

describe('core-client', () => {
  const client = new CoxwaveCore();

  describe('init', () => {
    test('should call init', async () => {
      expect(client.config).toBeUndefined();
      await client._init(useDefaultConfig());
      expect(client.config).toBeDefined();
    });
  });
});
