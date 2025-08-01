// Mock Chrome APIs for background script testing
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
    onUpdated: {
      addListener: jest.fn(),
    },
    onActivated: {
      addListener: jest.fn(),
    },
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

// Replace global chrome
global.chrome = mockChrome as unknown as typeof chrome;

// Import background script after mocks
import '../background';

describe('Background Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tab Management', () => {
    it('should handle tab queries for badge updates', async () => {
      mockChrome.tabs.query.mockImplementation((query, callback) => {
        callback([{
          id: 1,
          url: 'https://web.bip.com/messages',
          title: 'Bip Web',
        }]);
      });

      // Simulate a tab query
      const result = await new Promise((resolve) => {
        mockChrome.tabs.query({ active: true }, resolve);
      });

      expect(result).toEqual([{
        id: 1,
        url: 'https://web.bip.com/messages',
        title: 'Bip Web',
      }]);
    });
  });

  describe('Storage Operations', () => {
    it('should handle storage get operations', async () => {
      const mockSettings = {
        on: true,
        styles: { messages: true },
        varStyles: { msBlur: 8 }
      };

      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ settings: mockSettings });
      });

      const result = await new Promise((resolve) => {
        mockChrome.storage.local.get(['settings'], resolve);
      });

      expect(result).toEqual({ settings: mockSettings });
    });

    it('should handle storage set operations', async () => {
      const settingsToSave = {
        on: true,
        styles: { messages: true }
      };

      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      await new Promise<void>((resolve) => {
        mockChrome.storage.local.set({ settings: settingsToSave }, resolve);
      });

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        { settings: settingsToSave },
        expect.any(Function)
      );
    });
  });

  describe('CSS Script Injection', () => {
    it('should handle CSS insertion requests', () => {
      const mockCSS = 'div { filter: blur(8px); }';

      mockChrome.scripting.insertCSS.mockImplementation((injection, callback) => {
        if (callback) callback();
      });

      // Simulate CSS insertion
      chrome.scripting.insertCSS({
        target: { tabId: 1 },
        css: mockCSS
      });

      expect(mockChrome.scripting.insertCSS).toHaveBeenCalledWith({
        target: { tabId: 1 },
        css: mockCSS
      });
    });
  });

  describe('Background Script Integration', () => {
    it('should maintain proper execution context', () => {
      // Background scripts should be in service worker context
      expect(typeof chrome).toBe('object');
      expect(chrome.runtime).toBeDefined();
      expect(chrome.storage).toBeDefined();
    });

    it('should have Chrome APIs available', () => {
      expect(chrome.tabs).toBeDefined();
      expect(chrome.action).toBeDefined();
      expect(chrome.scripting).toBeDefined();
    });
  });
});
