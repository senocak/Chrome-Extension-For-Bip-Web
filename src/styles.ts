/**
 * Centralized CSS styles for the Chrome extension
 * This file contains all the CSS rules used in the extension
 */
import { Settings, CSSStyles, DefaultCSSStyles } from './types'

// Default CSS for when no settings are found
export const getDefaultCSS = (): DefaultCSSStyles => {
  // Default settings with standard blur values
  const defaultSettings: Partial<Settings> = {
    varStyles: {
      msBlur: 8,
      mspBlur: 8,
      mdgBlur: 20,
      mdpBlur: 20,
      nmBlur: 5,
      ppBlur: 8,
      wiBlur: 14,
    }
  }
  // Reuse the getCSS function with default settings
  return {
    messages: getCSS(defaultSettings).messages
  }
}

// Helper function to get CSS with dynamic values
export const getCSS = (settings: Partial<Settings>): CSSStyles => {
  // Default blur values in case settings.varStyles is undefined
  const defaultBlur = {
    msBlur: 8,
    mspBlur: 8,
    mdgBlur: 20,
    mdpBlur: 20,
    nmBlur: 5,
    ppBlur: 8,
    wiBlur: 14,
  }
  // Use settings.varStyles if defined, otherwise use default values
  const varStyles = settings.varStyles || defaultBlur
  return {
    // Messages CSS
    messages: `
    /* CSS selectors for web.bip.com */
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
    div[itemtype="messages"] div[class^="_text_"],
    div[class^="_search_messages__search_results__messages__message_card_"]
    {
        filter: blur(${varStyles.msBlur}px) grayscale(1) !important;
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
    div[itemtype="messages"] div[class^="_text_"]:hover,
    div[class^="_search_messages__search_results__messages__message_card_"]:hover
    {
        filter: blur(0) grayscale(0) !important;
    }
    `,

    // Messages Preview CSS
    messagesPreview: `
    div[class^="_contact__content__body__message"] {
        filter: blur(${varStyles.mspBlur}px) grayscale(1);
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
      filter: blur(${varStyles.mdpBlur}px) grayscale(1);
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
    .editor-input,
    input
    {
      filter: blur(${varStyles.wiBlur}px) grayscale(1);
    }
    .editor-input:hover,
    input:hover
    {
      filter: blur(0) grayscale(0);
    }
    `,

    // Profile Picture CSS
    profilePic: `
    .avatar-wrap
    {
      filter: blur(${varStyles.ppBlur}px) grayscale(1);
      transition-delay: 0s;
    }
    .avatar-wrap:hover
    {
      filter: blur(0) grayscale(0);
      transition-delay: 0s;
    }
    `,

    // Name CSS
    name: `
    div[class^="_contact__content__header__name_"],
    span[class^="_message__nick_"],
    div[class^="_username_"],
    h3[class^="_info_card__title_"],
    div[class^="_input__actions_"],
    div[class^="_info_card__members_"],
    div[class^="_action__informative__row__title_"],
    div[class^="_action__selectable__row__title_"],
    div[class^="_action__chip__row__title_"],
    div[class^="_contact_info__title__user_info__user_name_"]
    {
      filter: blur(${varStyles.nmBlur}px) grayscale(1);
    }
    div[class^="_contact__content__header__name_"]:hover,
    span[class^="_message__nick_"]:hover,
    div[class^="_username_"]:hover,
    h3[class^="_info_card__title_"]:hover,
    div[class^="_input__actions_"]:hover,
    div[class^="_info_card__members_"]:hover,
    div[class^="_action__informative__row__title_"]:hover,
    div[class^="_action__selectable__row__title_"]:hover,
    div[class^="_action__chip__row__title_"]:hover,
    div[class^="_contact_info__title__user_info__user_name_"]:hover
    {
      filter: blur(0) grayscale(0);
    }
    `,
  }
}
