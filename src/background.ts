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

                      // Apply CSS based on stored settings
                      if (settings.styles.messages) {
                          const messagesCSS = `
                          /* CSS selectors for web4.bip.com */
                          div[itemtype="messages"] div[class^="_textBubble__card_info__message_container_"], 
                          div[itemtype="messages"] div[class^="_textBubble__card_info__message_content_text_"], 
                          div[itemtype="messages"] div[class^="video-element"], 
                          div[itemtype="messages"] div[class^="document-element"], 
                          div[itemtype="messages"] div[class^="image-element"],
                          div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__image"], 
                          div[itemtype="messages"] div[class^="_richLinkBubble__card_info__message_container__text_"], 
                          div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__info_"], 
                          div[itemtype="messages"] div[class^="_replyContent_"], 
                          div[itemtype="messages"] div[class^="_content_"], 
                          div[itemtype="messages"] div[class^="_text_"] {
                              filter: blur(${settings.varStyles.msBlur}px) grayscale(1) !important;
                          }
                          div[itemtype="messages"] div[class^="_textBubble__card_info__message_container_"]:hover, 
                          div[itemtype="messages"] div[class^="_textBubble__card_info__message_content_text_"]:hover, 
                          div[itemtype="messages"] div[class^="video-element"]:hover, 
                          div[itemtype="messages"] div[class^="document-element"]:hover, 
                          div[itemtype="messages"] div[class^="image-element"]:hover, 
                          div[itemtype="messages"] div[class^="_richLinkBubble__card_info__message_container__text_"]:hover, 
                          div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__info_"]:hover, 
                          div[itemtype="messages"] div[class^="_replyContent_"]:hover, 
                          div[itemtype="messages"] div[class^="_content_"]:hover, 
                          div[itemtype="messages"] div[class^="_text_"]:hover {
                              filter: blur(0) grayscale(0) !important;
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleMessages", messagesCSS]
                          });
                      }

                      if (settings.styles.messagesPreview) {
                          const messagesPreviewCSS = `
                          div[class^="_contact__content__body__message"] {
                              filter: blur(${settings.varStyles.mspBlur}px) grayscale(1);
                          }
                          div[class^="_contact__content__body__message"]:hover {
                              filter: blur(0) grayscale(0) !important;
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleMessagesPreview", messagesPreviewCSS]
                          });
                      }

                      if (settings.styles.mediaPreview) {
                          const mediaPreviewCSS = `
                          div[itemtype="messages"] div[class^="video-element"], 
                          div[itemtype="messages"] div[class^="document-element"], 
                          div[itemtype="messages"] div[class^="image-element"],
                          div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__image"] {
                            filter: blur(${settings.varStyles.mdpBlur}px) grayscale(1);
                            transition: initial;
                            transition-delay: 0s;
                          }
                          div[itemtype="messages"] div[class^="video-element"]:hover,
                          div[itemtype="messages"] div[class^="document-element"]:hover,
                          div[itemtype="messages"] div[class^="image-element"]:hover,
                          div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__image"]:hover {
                            filter: blur(0) grayscale(0);
                            transition: initial;
                            transition-delay: 0s;
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleMediaPreview", mediaPreviewCSS]
                          });
                      }

                      if (settings.styles.textInput) {
                          const textInputDescriptionCSS = `
                          .text-input, .message-input, .chat-input, textarea, input[type="text"], editor-paragraph, .editor-paragraph, #editor-paragraph {
                            filter: blur(8px) opacity(0.25);
                          }
                          .text-input:hover, .message-input:hover, .chat-input:hover, textarea:hover, input[type="text"]:hover {
                            filter: blur(0) opacity(1);
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleTextInputDescription", textInputDescriptionCSS]
                          });
                      }

                      if (settings.styles.profilePic) {
                          const profilePicDescriptionCSS = `
                          ._avatar_1vdaa_1 {
                            filter: blur(${settings.varStyles.ppBlur}px) grayscale(1);
                            transition-delay: 0s;
                          }
                          ._avatar_1vdaa_1:hover {
                            filter: blur(0) grayscale(0);
                            transition-delay: 0s;
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleProfilePicDescription", profilePicDescriptionCSS]
                          });
                      }

                      if (settings.styles.name) {
                          const nameDescriptionCSS = `
                          div[class^="_contact__content__header__name_"],
                          span[class^="_message__nick_"],
                          div[class^="_username_"],
                          h3[class^="_info_card__title_"]
                          {
                            filter: blur(${settings.varStyles.nmBlur}px) grayscale(1);
                          }
                          div[class^="_contact__content__header__name_"]:hover,
                          span[class^="_message__nick_"]:hover,
                          div[class^="_username_"]:hover,
                          h3[class^="_info_card__title_"]:hover
                          {
                            filter: blur(0) grayscale(0);
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleNameDescription", nameDescriptionCSS]
                          });
                      }

                      if (settings.styles.noDelay) {
                          const noDelayDescriptionCSS = `
                          /* CSS selectors for web4.bip.com */
                          .message:hover, 
                          .chat-message:hover, 
                          .message-content:hover, 
                          .message-text:hover, 
                          .message-body:hover,
                          .message-preview:hover, 
                          .preview-text:hover, 
                          .chat-preview:hover, 
                          .preview-content:hover,
                          .media-preview:hover, 
                          .image-preview:hover, 
                          .video-preview:hover, 
                          .attachment-preview:hover, 
                          img:hover, 
                          video:hover,
                          .text-input:hover, 
                          .message-input:hover, 
                          .chat-input:hover, 
                          textarea:hover, 
                          input[type="text"]:hover,
                          .profile-pic:hover, 
                          .avatar:hover, 
                          .user-avatar:hover, 
                          .profile-image:hover, 
                          .user-pic:hover, 
                          .user-image:hover,
                          .user-name:hover, 
                          .username:hover, 
                          .display-name:hover, 
                          .chat-name:hover, 
                          .contact-name:hover, 
                          .name:hover
                          {
                            transition-delay: 0.04s !important;
                            -webkit-transition-duration: 0s !important;
                            -moz-transition-duration: 0s !important;
                            -o-transition-duration: 0s !important;
                            transition-duration: 0s !important;
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleNoDelayDescription", noDelayDescriptionCSS]
                          });
                      }

                      if (settings.styles.unblurActive) {
                          const unblurActiveDescriptionCSS = `
                          /* CSS selectors for web4.bip.com */
                          body:hover .message, 
                          body:hover .chat-message, 
                          body:hover .message-content, 
                          body:hover .message-text, 
                          body:hover .message-body,
                          body:hover .message-preview, 
                          body:hover .preview-text, 
                          body:hover .chat-preview, 
                          body:hover .preview-content,
                          body:hover .media-preview, 
                          body:hover .image-preview, 
                          body:hover .video-preview, 
                          body:hover .attachment-preview, 
                          body:hover img, 
                          body:hover video,
                          body:hover .text-input, 
                          body:hover .message-input, 
                          body:hover .chat-input, 
                          body:hover textarea, 
                          body:hover input[type="text"],
                          body:hover .profile-pic, 
                          body:hover .avatar, 
                          body:hover .user-avatar, 
                          body:hover .profile-image, 
                          body:hover .user-pic, 
                          body:hover .user-image,
                          body:hover .user-name, 
                          body:hover .username, 
                          body:hover .display-name, 
                          body:hover .chat-name, 
                          body:hover .contact-name, 
                          body:hover .name
                          {
                            filter: blur(0) grayscale(0);
                            transition-delay: 0s;
                          }
                          `;
                          chrome.scripting.executeScript({
                              target: { tabId },
                              func: insertCSSDirectly,
                              args: ["toggleUnblurActiveDescription", unblurActiveDescriptionCSS]
                          });
                      }
                  } else {
                      console.log("No settings found in storage, using defaults");
                      // If no settings are found, apply default CSS
                      const defaultMessagesCSS = `
                      /* CSS selectors for web4.bip.com */
                      div[itemtype="messages"] div[class^="_textBubble__card_info__message_container_"], 
                      div[itemtype="messages"] div[class^="_textBubble__card_info__message_content_text_"], 
                      div[itemtype="messages"] div[class^="video-element"], 
                      div[itemtype="messages"] div[class^="document-element"], 
                      div[itemtype="messages"] div[class^="image-element"],
                      div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__image"], 
                      div[itemtype="messages"] div[class^="_richLinkBubble__card_info__message_container__text_"], 
                      div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__info_"], 
                      div[itemtype="messages"] div[class^="_replyContent_"], 
                      div[itemtype="messages"] div[class^="_content_"], 
                      div[itemtype="messages"] div[class^="_text_"] {
                          filter: blur(8px) grayscale(1) !important;
                      }
                      div[itemtype="messages"] div[class^="_textBubble__card_info__message_container_"]:hover, 
                      div[itemtype="messages"] div[class^="_textBubble__card_info__message_content_text_"]:hover, 
                      div[itemtype="messages"] div[class^="video-element"]:hover, 
                      div[itemtype="messages"] div[class^="document-element"]:hover, 
                      div[itemtype="messages"] div[class^="image-element"]:hover, 
                      div[itemtype="messages"] div[class^="_richLinkBubble__card_info__message_container__text_"]:hover, 
                      div[itemtype="messages"] div[class^="_richLinkBubble__card_info__content__info_"]:hover, 
                      div[itemtype="messages"] div[class^="_replyContent_"]:hover, 
                      div[itemtype="messages"] div[class^="_content_"]:hover, 
                      div[itemtype="messages"] div[class^="_text_"]:hover {
                          filter: blur(0) grayscale(0) !important;
                      }
                      `;
                      chrome.scripting.executeScript({
                          target: { tabId },
                          func: insertCSSDirectly,
                          args: ["toggleMessages", defaultMessagesCSS]
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
