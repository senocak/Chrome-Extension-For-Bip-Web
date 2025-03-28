/**
 * Centralized CSS styles for the Chrome extension
 * This file contains all the CSS rules used in the extension
 */

// Default CSS for when no settings are found
export const getDefaultCSS = () => {
  return {
    // Default Messages CSS
    messages: `
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
    `
  };
};

// Helper function to get CSS with dynamic values
export const getCSS = (settings: any) => {
  return {
    // Messages CSS
    messages: `
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
    `,

    // Messages Preview CSS
    messagesPreview: `
    div[class^="_contact__content__body__message"] {
        filter: blur(${settings.varStyles.mspBlur}px) grayscale(1);
    }
    div[class^="_contact__content__body__message"]:hover {
        filter: blur(0) grayscale(0) !important;
    }
    `,

    // Media Preview CSS
    mediaPreview: `
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
    `,

    // Text Input CSS
    textInput: `
    .text-input, .message-input, .chat-input, textarea, input[type="text"], editor-paragraph, .editor-paragraph, #editor-paragraph {
      filter: blur(${settings.varStyles.wiBlur}px) opacity(0.25);
    }
    .text-input:hover, .message-input:hover, .chat-input:hover, textarea:hover, input[type="text"]:hover {
      filter: blur(0) opacity(1);
    }
    `,

    // Profile Picture CSS
    profilePic: `
    ._avatar_1vdaa_1 {
      filter: blur(${settings.varStyles.ppBlur}px) grayscale(1);
      transition-delay: 0s;
    }
    ._avatar_1vdaa_1:hover {
      filter: blur(0) grayscale(0);
      transition-delay: 0s;
    }
    `,

    // Name CSS
    name: `
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
    `,
  };
};
