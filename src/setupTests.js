// Setup file for Jest tests

// Add testing-library jest-dom matchers
require('@testing-library/jest-dom');

// Mock Chrome API globally
global.chrome = {
  tabs: {
    query: jest.fn(),
    get: jest.fn(),
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
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  scripting: {
    executeScript: jest.fn(),
  },
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
  },
};

// Clean up timers after each test
afterEach(() => {
  jest.clearAllTimers();
});
