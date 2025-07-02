# Bip Web Privacy Extension

A Chrome extension that applies blur effects to various elements on web.bip.com for privacy.

## Features

- Blurs messages, message previews, media previews, text inputs, profile pictures, and names on web.bip.com
- Configurable blur amount for each element type
- Option to unblur elements on hover
- Settings are persisted between sessions
- Internationalization support (i18n)

## Prerequisites

* [Node.js + npm](https://nodejs.org/) (Current Version)

## Recommended Tools

* [Visual Studio Code](https://code.visualstudio.com/)

## Technologies Used

* TypeScript
* React
* Webpack
* Jest for testing
* Chrome Extension APIs
* i18next for internationalization

## Project Structure

* src: TypeScript and CSS source files
  * background.ts: Background script for the extension
  * content_script.tsx: Content script injected into web pages
  * popup.tsx: Popup UI implementation
  * config.ts: Configuration settings
  * styles.ts: Styling utilities
  * types.ts: TypeScript type definitions
* public: Static files
  * manifest.json: Extension manifest
  * icon.png: Extension icon
  * popup.html: HTML template for popup
  * options.html: HTML template for options page
* dist: Chrome Extension directory (generated after build)
  * js: Compiled JavaScript files

## Setup

```sh
npm install
npm run clean 
npm run build
```

## Build in watch mode

```
npm run watch
```

## Load extension to Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click on "Load unpacked" button
4. Select the `dist` directory from this project
5. The extension should now be installed and visible in your Chrome toolbar


## Usage

1. Install the extension in Chrome
2. Navigate to web.bip.com
3. Click on the extension icon to open the popup
4. Check the boxes for the elements you want to blur:
   - "All Messages in Chat" - Blurs all messages in the chat
   - "Last Messages Preview" - Blurs message previews
   - "Media preview" - Blurs media previews (images, videos, etc.)
   - "Text input" - Blurs text input fields
   - "Profile pictures" - Blurs profile pictures
   - "Group/Users names" - Blurs user and group names
   - "No transition delay" - Removes transition delay when hovering over blurred elements
   - "Unblur all on app hover" - Unblurs all elements when hovering over the app
5. Adjust the blur amount for each element type using the sliders
6. Your settings will be automatically saved and applied to web.bip.com

## Development

This project uses Webpack for building and bundling. Here are some tips for development:

1. Make changes to the source files in the `src` directory
2. Run `npm run watch` to automatically rebuild when files change
3. Refresh the extension in Chrome to see your changes:
   - Go to `chrome://extensions/`
   - Find the Bip Web Privacy Extension
   - Click the refresh icon

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
