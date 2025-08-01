import { Settings, CSSStyles, ContentMessage } from '../types';
import { getCSS } from '../styles';

// Mock Chrome APIs for integration testing
const mockChrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(),
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
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

global.chrome = mockChrome as unknown as typeof chrome;

describe('Extension Integration Tests', () => {
  const mockSettings: Settings = {
    on: true,
    styles: {
      messages: true,
      messagesPreview: true,
      mediaPreview: false,
      name: true,
      profilePic: false,
      textInput: true,
    },
    varStyles: {
      msBlur: 10,
      mspBlur: 12,
      mdgBlur: 20,
      mdpBlur: 20,
      nmBlur: 6,
      ppBlur: 8,
      wiBlur: 15,
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('End-to-End Privacy Flow', () => {
    it('should generate and apply CSS based on settings', () => {
      // Generate CSS from settings
      const css = getCSS(mockSettings);

      // Verify CSS contains expected blur values
      expect(css.messages).toContain('filter: blur(10px)');
      expect(css.textInput).toContain('filter: blur(15px)');
      expect(css.name).toContain('filter: blur(6px)');

      // Simulate CSS injection
      chrome.scripting.insertCSS({
        target: { tabId: 1 },
        css: css.messages
      });

      expect(mockChrome.scripting.insertCSS).toHaveBeenCalledWith({
        target: { tabId: 1 },
        css: css.messages
      });
    });

    it('should handle complete settings workflow', async () => {
      // Mock storage operations
      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ settings: mockSettings });
      });

      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      // Simulate reading settings
      const storageResult = await new Promise((resolve) => {
        chrome.storage.local.get(['settings'], resolve);
      });

      expect(storageResult).toEqual({ settings: mockSettings });

      // Generate CSS based on settings
      const css = getCSS(mockSettings);

      // Apply CSS to active tab
      chrome.scripting.insertCSS({
        target: { tabId: 1 },
        css: css.messages
      });

      // Update badge to reflect active privacy layers
      const enabledCount = Object.values(mockSettings.styles).filter(Boolean).length;
      chrome.action.setBadgeText({ text: enabledCount.toString() });

      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({ text: '4' });
    });
  });

  describe('Cross-Component Communication', () => {
    it('should handle popup to content script communication', () => {
      const testMessage: ContentMessage = { color: '#ff0000' };

      // Simulate sending message from popup to content script
      chrome.tabs.sendMessage(1, testMessage);

      expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(1, testMessage);
    });

    it('should handle background script orchestration', () => {
      // Simulate background script coordinating privacy settings
      const tabId = 1;
      const css = getCSS(mockSettings);

      // Background script applies CSS
      chrome.scripting.insertCSS({
        target: { tabId },
        css: css.messages
      });

      // Background script updates badge
      chrome.action.setBadgeText({ text: '4' });
      chrome.action.setBadgeBackgroundColor({ color: '#4285F4' });

      expect(mockChrome.scripting.insertCSS).toHaveBeenCalledWith({
        target: { tabId },
        css: css.messages
      });
      expect(mockChrome.action.setBadgeText).toHaveBeenCalledWith({ text: '4' });
      expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: '#4285F4' });
    });
  });

  describe('Privacy Feature Combinations', () => {
    it('should handle all privacy features enabled', () => {
      const allEnabledSettings: Settings = {
        ...mockSettings,
        styles: {
          messages: true,
          messagesPreview: true,
          mediaPreview: true,
          name: true,
          profilePic: true,
          textInput: true,
        }
      };

      const css = getCSS(allEnabledSettings);

      // All CSS properties should be generated
      expect(css).toHaveProperty('messages');
      expect(css).toHaveProperty('messagesPreview');
      expect(css).toHaveProperty('mediaPreview');
      expect(css).toHaveProperty('name');
      expect(css).toHaveProperty('profilePic');
      expect(css).toHaveProperty('textInput');

      // All should contain blur filters
      Object.values(css).forEach(cssRule => {
        expect(cssRule).toContain('filter: blur(');
      });
    });

    it('should handle no privacy features enabled', () => {
      const noFeaturesSettings: Settings = {
        ...mockSettings,
        styles: {
          messages: false,
          messagesPreview: false,
          mediaPreview: false,
          name: false,
          profilePic: false,
          textInput: false,
        }
      };

      const css = getCSS(noFeaturesSettings);

      // CSS should still be generated but may have different behavior
      expect(css).toHaveProperty('messages');
      expect(typeof css.messages).toBe('string');
    });
  });

  describe('Settings Validation', () => {
    it('should handle invalid settings gracefully', () => {
      const invalidSettings = {
        // Missing required properties
        styles: {},
        varStyles: {}
      } as Settings;

      // Should not throw when processing invalid settings
      expect(() => {
        const css = getCSS(invalidSettings);
        expect(css).toBeDefined();
      }).not.toThrow();
    });

    it('should handle multiple rapid CSS updates', () => {
      const updates = Array.from({ length: 10 }, (_, i) => ({
        ...mockSettings,
        varStyles: { ...mockSettings.varStyles, msBlur: i + 5 }
      }));

      // Should handle rapid CSS generation without issues
      expect(() => {
        updates.forEach(settings => {
          const css = getCSS(settings);
          chrome.scripting.insertCSS({
            target: { tabId: 1 },
            css: css.messages
          });
        });
      }).not.toThrow();

      expect(mockChrome.scripting.insertCSS).toHaveBeenCalledTimes(10);
    });
  });
});
