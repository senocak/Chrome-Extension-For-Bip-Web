# Bip Web Privacy Extension

A Chrome extension that applies blur effects to various elements on web4.bip.com for privacy.

## Features

- Blurs messages, message previews, media previews, text inputs, profile pictures, and names on web4.bip.com
- Configurable blur amount for each element type
- Option to unblur elements on hover
- Settings are persisted between sessions

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Option

* [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

* TypeScript
* Webpack
* React
* Jest
* Example Code
    * Chrome Storage
    * Options Version 2
    * content script
    * count up badge number
    * background

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```sh
npm install
npm run clean 
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Test
`npx jest` or `npm run test`

## Usage

1. Install the extension in Chrome
2. Navigate to web4.bip.com
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
6. Your settings will be automatically saved and applied to web4.bip.com
