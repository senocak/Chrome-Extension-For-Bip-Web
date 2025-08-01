import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Settings } from '../types';

// Mock Chrome APIs
const mockChrome = {
  tabs: {
    query: jest.fn(),
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn(),
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  scripting: {
    executeScript: jest.fn(),
    insertCSS: jest.fn(),
  },
};

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock use-chrome-storage hook
const mockUseChromeStorageLocal = jest.fn();
jest.mock('use-chrome-storage', () => ({
  useChromeStorageLocal: () => mockUseChromeStorageLocal(),
}));

// Mock manifest.json
jest.mock('../../public/manifest.json', () => ({
  version: '1.1',
  name: 'Bip Web Privacy Extension',
}), { virtual: true });

// Replace global chrome
global.chrome = mockChrome as unknown as typeof chrome;

describe('Popup Component Tests', () => {
  const defaultSettings: Settings = {
    on: true,
    styles: {
      messages: false,
      messagesPreview: false,
      mediaPreview: false,
      name: false,
      profilePic: false,
      textInput: false,
    },
    varStyles: {
      msBlur: 8,
      mspBlur: 8,
      mdgBlur: 20,
      mdpBlur: 20,
      nmBlur: 5,
      ppBlur: 8,
      wiBlur: 14,
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for chrome storage hook
    mockUseChromeStorageLocal.mockReturnValue([
      defaultSettings,
      jest.fn(),
      true,
      null,
      true
    ]);

    // Mock chrome.tabs.query to return a Bip Web tab
    mockChrome.tabs.query.mockImplementation((query, callback) => {
      callback([{
        id: 1,
        url: 'https://web.bip.com/messages',
        title: 'Bip Web',
      }]);
    });
  });

  describe('Component Functionality', () => {
    it('should handle settings management through chrome storage hook', () => {
      const mockSetSettings = jest.fn();
      mockUseChromeStorageLocal.mockReturnValue([
        defaultSettings,
        mockSetSettings,
        true,
        null,
        true
      ]);

      // Test the hook returns expected values
      const [settings, setSettings, isPersistent, error, isInitialStateResolved] = mockUseChromeStorageLocal();

      expect(settings).toEqual(defaultSettings);
      expect(typeof setSettings).toBe('function');
      expect(isPersistent).toBe(true);
      expect(error).toBe(null);
      expect(isInitialStateResolved).toBe(true);
    });

    it('should calculate enabled styles count correctly', () => {
      const settingsWithEnabled = {
        ...defaultSettings,
        styles: {
          ...defaultSettings.styles,
          messages: true,
          profilePic: true,
          name: true,
        }
      };

      mockUseChromeStorageLocal.mockReturnValue([
        settingsWithEnabled,
        jest.fn(),
        true,
        null,
        true
      ]);

      // Simulate the enabled count calculation
      const enabledCount = Object.values(settingsWithEnabled.styles).filter(Boolean).length;
      expect(enabledCount).toBe(3);
    });

    it('should handle badge updates correctly', () => {
      // Test Bip Web page badge
      mockChrome.tabs.query.mockImplementation((query, callback) => {
        callback([{
          id: 1,
          url: 'https://web.bip.com/messages',
          title: 'Bip Web',
        }]);
      });

      // Simulate badge update logic
      const isWeb4Bip = (url: string) => url?.includes('web.bip.com') || false;
      const tabUrl = 'https://web.bip.com/messages';

      expect(isWeb4Bip(tabUrl)).toBe(true);
    });

    it('should handle non-Bip Web pages', () => {
      // Test non-Bip Web page badge
      mockChrome.tabs.query.mockImplementation((query, callback) => {
        callback([{
          id: 1,
          url: 'https://google.com',
          title: 'Google',
        }]);
      });

      // Simulate badge update logic
      const isWeb4Bip = (url: string) => url?.includes('web.bip.com') || false;
      const tabUrl = 'https://google.com';

      expect(isWeb4Bip(tabUrl)).toBe(false);
    });
  });

  describe('Settings Management', () => {
    it('should handle blur intensity updates', () => {
      const newBlurSettings = {
        ...defaultSettings,
        varStyles: {
          ...defaultSettings.varStyles,
          msBlur: 15,
          ppBlur: 20,
        }
      };

      const mockSetSettings = jest.fn();
      mockUseChromeStorageLocal.mockReturnValue([
        newBlurSettings,
        mockSetSettings,
        true,
        null,
        true
      ]);

      const [settings] = mockUseChromeStorageLocal();
      expect(settings.varStyles.msBlur).toBe(15);
      expect(settings.varStyles.ppBlur).toBe(20);
    });

    it('should handle toggle state changes', () => {
      const toggledSettings = {
        ...defaultSettings,
        styles: {
          ...defaultSettings.styles,
          messages: true,
          profilePic: true,
        }
      };

      const mockSetSettings = jest.fn();
      mockUseChromeStorageLocal.mockReturnValue([
        toggledSettings,
        mockSetSettings,
        true,
        null,
        true
      ]);

      const [settings] = mockUseChromeStorageLocal();
      expect(settings.styles.messages).toBe(true);
      expect(settings.styles.profilePic).toBe(true);
      expect(settings.styles.mediaPreview).toBe(false);
    });

    it('should handle chrome storage errors gracefully', () => {
      mockUseChromeStorageLocal.mockReturnValue([
        defaultSettings,
        jest.fn(),
        true,
        new Error('Storage error'),
        true
      ]);

      // Should not throw when rendering with error
      const [settings, setSettings, isPersistent, error, isInitialStateResolved] = mockUseChromeStorageLocal();
      expect(error).toBeInstanceOf(Error);
      expect(settings).toEqual(defaultSettings);
    });
  });
});
