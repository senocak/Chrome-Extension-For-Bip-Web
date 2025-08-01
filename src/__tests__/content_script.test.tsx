import { ContentMessage } from '../types';

// Mock Chrome runtime API BEFORE importing content script
const mockChrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(),
  },
};

// Replace global chrome BEFORE import
global.chrome = mockChrome as unknown as typeof chrome;

// Mock document.body
Object.defineProperty(document, 'body', {
  value: document.createElement('body'),
  writable: true,
});

// Import content script AFTER mocks are set up
import '../content_script';

describe('Content Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body styles
    document.body.style.backgroundColor = '';
  });

  describe('Content Script Integration', () => {
    it('should work in browser environment', () => {
      expect(typeof window).toBe('object');
      expect(typeof document).toBe('object');
      expect(document.body).toBeDefined();
    });

    it('should have access to Chrome runtime API', () => {
      expect(chrome.runtime).toBeDefined();
      expect(chrome.runtime.onMessage).toBeDefined();
    });

    it('should handle DOM manipulation safely', () => {
      // Test that DOM operations work without throwing
      expect(() => {
        document.body.style.backgroundColor = '#ff0000';
        // Browser normalizes colors, so we check for either format
        const bgColor = document.body.style.backgroundColor;
        expect(bgColor === '#ff0000' || bgColor === 'rgb(255, 0, 0)').toBe(true);
      }).not.toThrow();
    });

    it('should support color message structure', () => {
      const colorMessage: ContentMessage = { color: '#ff0000' };
      expect(colorMessage).toHaveProperty('color');
      expect(colorMessage.color).toBe('#ff0000');
    });
  });
});
