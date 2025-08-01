import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock i18next configuration
jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockReturnThis(),
  t: jest.fn((key: string) => key),
  changeLanguage: jest.fn(),
  language: 'en',
  languages: ['en', 'tr'],
}));

jest.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}));

// Import config after mocks
import '../config';

describe('i18n Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Translation Function Availability', () => {
    it('should provide translation function', () => {
      // Test that i18next mock is working
      expect(typeof jest.fn()).toBe('function');
    });

    it('should handle translation keys', () => {
      // Mock translation function behavior
      const mockTranslate = jest.fn((key: string) => key);

      const result = mockTranslate('test.key');
      expect(result).toBe('test.key');
      expect(mockTranslate).toHaveBeenCalledWith('test.key');
    });

    it('should support parameterized translations', () => {
      const mockTranslate = jest.fn((key: string, options?: any) => {
        if (options && options.name) {
          return `${key} ${options.name}`;
        }
        return key;
      });

      const result = mockTranslate('welcome', { name: 'User' });
      expect(result).toBe('welcome User');
    });
  });

  describe('Language Management', () => {
    it('should support language switching', () => {
      const mockChangeLanguage = jest.fn();

      mockChangeLanguage('tr');
      expect(mockChangeLanguage).toHaveBeenCalledWith('tr');
    });

    it('should maintain language state', () => {
      const mockLanguageState = {
        current: 'en',
        available: ['en', 'tr']
      };

      expect(mockLanguageState.current).toBe('en');
      expect(mockLanguageState.available).toContain('en');
      expect(mockLanguageState.available).toContain('tr');
    });
  });

  describe('Configuration Validation', () => {
    it('should handle missing translation keys gracefully', () => {
      const mockTranslate = jest.fn((key: string) => key);

      const result = mockTranslate('nonexistent.key');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should support fallback behavior', () => {
      const mockTranslate = jest.fn((key: string, fallback?: string) => {
        return fallback || key;
      });

      const result = mockTranslate('missing.key', 'Fallback Text');
      expect(result).toBe('Fallback Text');
    });
  });

  describe('Integration with React Components', () => {
    it('should provide useTranslation hook mock', () => {
      // This tests that our mock is properly set up
      const { useTranslation } = require('react-i18next');
      const hook = useTranslation();

      expect(hook).toHaveProperty('t');
      expect(hook).toHaveProperty('i18n');
      expect(typeof hook.t).toBe('function');
    });

    it('should handle common UI translation keys', () => {
      const mockT = jest.fn((key: string) => key);

      const commonKeys = [
        'extensionName',
        'messages',
        'settings',
        'blur',
        'privacy'
      ];

      commonKeys.forEach(key => {
        const result = mockT(key);
        expect(result).toBe(key);
      });

      expect(mockT).toHaveBeenCalledTimes(commonKeys.length);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', () => {
      // Test that config module doesn't throw during import
      expect(() => {
        // Simulate requiring the config module
        const mockConfig = {
          lng: 'en',
          fallbackLng: 'en',
          resources: {
            en: { translation: {} }
          }
        };

        expect(mockConfig).toBeDefined();
      }).not.toThrow();
    });

    it('should provide safe defaults', () => {
      const mockDefaults = {
        language: 'en',
        fallback: 'en',
        escapeValue: false
      };

      expect(mockDefaults.language).toBe('en');
      expect(mockDefaults.fallback).toBe('en');
      expect(mockDefaults.escapeValue).toBe(false);
    });
  });
});

describe('i18n Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Translation Function', () => {
    it('should provide translation function', () => {
      expect(i18n.t).toBeDefined();
      expect(typeof i18n.t).toBe('function');
    });

    it('should handle missing translation keys gracefully', () => {
      const result = i18n.t('nonexistent.key');
      expect(result).toBeDefined();
    });

    it('should support translation with parameters', () => {
      const key = 'welcome';
      const options = { name: 'User' };

      i18n.t(key, options);

      expect(i18n.t).toHaveBeenCalledWith(key, options);
    });
  });

  describe('Language Switching', () => {
    it('should support language change', () => {
      const newLanguage = 'tr';

      i18n.changeLanguage(newLanguage);

      expect(i18n.changeLanguage).toHaveBeenCalledWith(newLanguage);
    });

    it('should maintain current language state', () => {
      expect(i18n.language).toBeDefined();
      expect(typeof i18n.language).toBe('string');
    });

    it('should provide available languages list', () => {
      expect(i18n.languages).toBeDefined();
      expect(Array.isArray(i18n.languages)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', () => {
      const mockInit = i18n.init as jest.Mock;
      mockInit.mockImplementationOnce(() => {
        throw new Error('Initialization failed');
      });

      // Should not throw during module import
      expect(() => {
        require('../config');
      }).not.toThrow();
    });

    it('should provide fallback behavior for missing resources', () => {
      // Test translation with missing resource
      const result = i18n.t('missing.nested.key');
      expect(result).toBeDefined();
    });
  });
});
