/**
 * Type definitions for the Chrome extension
 */

// Settings interface
export interface Settings {
  on: boolean;
  styles: {
    messages: boolean;
    messagesPreview: boolean;
    mediaPreview: boolean;
    name: boolean;
    profilePic: boolean;
    textInput: boolean;
  };
  varStyles: {
    msBlur: number;
    mspBlur: number;
    mdgBlur: number;
    mdpBlur: number;
    nmBlur: number;
    ppBlur: number;
    wiBlur: number;
  };
}

// CSS structure returned by getCSS
export interface CSSStyles {
  messages: string;
  messagesPreview: string;
  mediaPreview: string;
  textInput: string;
  profilePic: string;
  name: string;
}

// Default CSS structure returned by getDefaultCSS
export interface DefaultCSSStyles {
  messages: string;
}

// Chrome storage result for settings
export interface StorageResult {
  settings?: Settings;
}

// Message structure for content script
export interface ContentMessage {
  color?: string;
}