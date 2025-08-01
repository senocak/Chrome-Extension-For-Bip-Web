import { getCSS, getDefaultCSS } from '../styles';
import { Settings } from '../types';

describe('Styles Module', () => {
  describe('getDefaultCSS', () => {
    it('should return default CSS with standard blur values', () => {
      const defaultCSS = getDefaultCSS();
      
      expect(defaultCSS).toHaveProperty('messages');
      expect(defaultCSS.messages).toContain('filter: blur(8px)');
      expect(defaultCSS.messages).toContain('grayscale(1)'); // Updated to match actual CSS
    });

    it('should include hover functionality in default CSS', () => {
      const defaultCSS = getDefaultCSS();

      expect(defaultCSS.messages).toContain(':hover');
      expect(defaultCSS.messages).toContain('blur(0) grayscale(0)'); // Updated to match actual CSS
    });
  });

  describe('getCSS', () => {
    const mockSettings: Partial<Settings> = {
      varStyles: {
        msBlur: 10,
        mspBlur: 12,
        mdgBlur: 25,
        mdpBlur: 25,
        nmBlur: 6,
        ppBlur: 15,
        wiBlur: 18,
      }
    };

    it('should generate CSS with custom blur values', () => {
      const css = getCSS(mockSettings);

      expect(css.messages).toContain('filter: blur(10px)');
      expect(css.messages).toContain('!important');
    });

    it('should use default values when varStyles is undefined', () => {
      const css = getCSS({});
      
      expect(css.messages).toContain('filter: blur(8px)'); // Default msBlur value
    });

    it('should include proper CSS selectors for Bip Web elements', () => {
      const css = getCSS(mockSettings);

      expect(css.messages).toContain('div[itemtype="messages"]');
      expect(css.messages).toContain('div[class^="_textBubble__card_info__message_container_"]');
      expect(css.messages).toContain('div[class^="video-element"]');
      expect(css.messages).toContain('div[class^="document-element"]');
      expect(css.messages).toContain('div[class^="image-element"]');
    });

    it('should include grayscale effects for privacy', () => {
      const css = getCSS(mockSettings);

      expect(css.messages).toContain('grayscale(1)'); // Updated to match actual CSS
    });

    it('should handle edge case blur values', () => {
      const edgeCaseSettings: Partial<Settings> = {
        varStyles: {
          msBlur: 0,
          mspBlur: 50,
          mdgBlur: 1,
          mdpBlur: 100,
          nmBlur: 0.5,
          ppBlur: 30,
          wiBlur: 5,
        }
      };

      const css = getCSS(edgeCaseSettings);

      expect(css.messages).toContain('filter: blur(0px)');
    });

    it('should return all required CSS properties', () => {
      const css = getCSS(mockSettings);

      expect(css).toHaveProperty('messages');
      expect(css).toHaveProperty('messagesPreview');
      expect(css).toHaveProperty('mediaPreview');
      expect(css).toHaveProperty('textInput');
      expect(css).toHaveProperty('profilePic');
      expect(css).toHaveProperty('name');
    });
  });
});
