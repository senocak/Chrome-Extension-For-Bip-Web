// Helper function to insert CSS directly into the page
const insertCSSDirectly = (styleId: string, cssRules: string): void => {
  console.log("Started insertCSSDirectly")
  const existingStyle = document.getElementById(styleId)
  if (existingStyle) {
      console.log(`Style with ID "${styleId}" already exists.`)
      return;
  }
  const styleElement = document.createElement("style")
  styleElement.id = styleId
  styleElement.innerHTML = cssRules
  document.head.appendChild(styleElement)
  console.log(`CSS with ID "${styleId}" inserted successfully.`)
}

// Helper function to remove CSS from the page
const removeCSSDirectly = (styleId: string): void => {
  console.log("Started removeCSSDirectly")
  const styleElement = document.getElementById(styleId)
  if (styleElement) {
      styleElement.parentNode?.removeChild(styleElement)
      console.log(`CSS with ID "${styleId}" removed successfully.`)
  } else {
      console.log(`No CSS found with ID "${styleId}" to remove.`)
  }
}

// Import centralized CSS
import { getCSS, getDefaultCSS } from './styles';

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  console.log("Tab updated, info.status: " + info.status)
  if (info.status === 'complete') {
      // Get the tab URL
      chrome.tabs.get(tabId, function(tab) {
          // Check if the tab URL includes 'web4.bip.com'
          if (tab.url && tab.url.includes('web4.bip.com')) {
              console.log("Detected web4.bip.com, applying CSS")

              // Load settings from chrome.storage.local
              chrome.storage.local.get('settings', (result) => {
                  if (result.settings) {
                      const settings = result.settings;
                      // Get CSS from centralized styles
                      const css = getCSS(settings);

                      // Apply CSS based on stored settings
                      if (settings.styles.messages) {
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleMessages", css.messages]
                          });
                      }

                      if (settings.styles.messagesPreview) {
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleMessagesPreview", css.messagesPreview]
                          });
                      }

                      if (settings.styles.mediaPreview) {
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleMediaPreview", css.mediaPreview]
                          });
                      }

                      if (settings.styles.textInput) {
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleTextInputDescription", css.textInput]
                          });
                      }

                      if (settings.styles.profilePic) {
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleProfilePicDescription", css.profilePic]
                          });
                      }

                      if (settings.styles.name) {
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleNameDescription", css.name]
                          });
                      }
                  } else {
                      console.log("No settings found in storage, using defaults");
                      // If no settings are found, apply default CSS
                      const defaultCSS: { messages: string } = getDefaultCSS();
                      chrome.scripting.executeScript({
                          target: { tabId },
                          func: insertCSSDirectly,
                          args: ["toggleMessages", defaultCSS.messages]
                      });
                  }
              });
          }
      });
  }
});

// Keep the polling function for other background tasks
function polling(): void {
  console.log("polling")
  setTimeout(polling, 1_000 * 30)
}
polling()
