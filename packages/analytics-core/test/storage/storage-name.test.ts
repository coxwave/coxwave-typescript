import { getCookieName, getStorageName } from '../../src/storage/storage-name';
import { PROJECT_TOKEN } from '../helpers/default';

describe('storage-name', () => {
  describe('getStorageName', () => {
    test('should return default name', () => {
      expect(getStorageName(PROJECT_TOKEN)).toBe('COX_unsent_projectToken');
    });

    test('should return cookie name', () => {
      expect(getCookieName(PROJECT_TOKEN)).toBe('COX_projectToken');
    });

    test('should handle projectToken is empty string', () => {
      expect(getStorageName('')).toBe('COX_unsent');
    });
  });
});
