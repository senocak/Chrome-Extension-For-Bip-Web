import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import "./config.ts"
import { useTranslation } from "react-i18next"
import {useChromeStorageLocal} from 'use-chrome-storage'
import "./popup.css"

const Popup: () => React.JSX.Element = (): React.JSX.Element => {
    const [count, setCount] = useState<number>(0)
    const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab |null>(null)
    const { t } = useTranslation()

    const defaultSettings = {
        on: true,
        styles: {
            messages: false,
            messagesPreview: false,
            mediaPreview: false,
            name: false,
            noDelay: false,
            profilePic: false,
            textInput: false,
            unblurActive: false
        },
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
    const [settings, setSettings, isPersistent, error, isInitialStateResolved] = useChromeStorageLocal('settings', defaultSettings);

    //useEffect((): void => {
    //    chrome.action.setBadgeText({ text: count.toString() })
    //}, [count])

    useEffect((): void => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: chrome.tabs.Tab[]): void {
            setCurrentTab(tabs[0])
        })
    }, [])

    // Check if the current tab is web4.bip.com
    const isWeb4Bip = (): boolean => {
        return currentTab?.url?.includes('web4.bip.com') || false
    }

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

    // toggleMessages
    const messagesCSS: string = isWeb4Bip() 
    ? `
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
    `
    : ``;
    const _toggleMessages: (status: boolean) => void = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tab.id!
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleMessages", messagesCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, messages: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleMessages"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, messages: false}
                }))
            }
        })
    }

    // toggleMessagesPreview
    const messagesPreviewCSS: string =
    `
    div[class^="_contact__content__body__message"] {
        filter: blur(${settings.varStyles.mspBlur}px) grayscale(1);
    }
    div[class^="_contact__content__body__message"]:hover {
        filter: blur(0) grayscale(0) !important;
    }
    `
    const _toggleMessagesPreview = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tabs[0].id!
            console.log("tab:" + JSON.stringify(tab))
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleMessagesPreview", messagesPreviewCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, messagesPreview: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleMessagesPreview"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, messagesPreview: false}
                }))
            }
        })
    }

    // toggleMediaPreview
    const mediaPreviewCSS: string =
    `
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
    const _toggleMediaPreview: (status: boolean) => void = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tabs[0].id!
            console.log("tab:" + JSON.stringify(tab))
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleMediaPreview", mediaPreviewCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, mediaPreview: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleMediaPreview"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, mediaPreview: false}
                }))
            }
        })
    }

    // toggleTextInputDescription
    const textInputDescriptionCSS: string =
    `
    .text-input, .message-input, .chat-input, textarea, input[type="text"], editor-paragraph, .editor-paragraph, #editor-paragraph {
      filter: blur(8px) opacity(0.25);
    }
    .text-input:hover, .message-input:hover, .chat-input:hover, textarea:hover, input[type="text"]:hover {
      filter: blur(0) opacity(1);
    }
    `;
    const _toggleTextInputDescription: (status: boolean) => void = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tabs[0].id!
            console.log("tab:" + JSON.stringify(tab))
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleTextInputDescription", textInputDescriptionCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, textInput: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleTextInputDescription"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, textInput: false}
                }))
            }
        })
    }

    const profilePicDescriptionCSS: string =
    `
    ._avatar_1vdaa_1 {
      filter: blur(${settings.varStyles.ppBlur}px) grayscale(1);
      transition-delay: 0s;
    }
    ._avatar_1vdaa_1:hover {
      filter: blur(0) grayscale(0);
      transition-delay: 0s;
    }
    `
    const _toggleProfilePicDescription = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tab.id!
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleProfilePicDescription", profilePicDescriptionCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, profilePic: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleProfilePicDescription"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, profilePic: false}
                }))
            }
        })
    }

    const nameDescriptionCSS: string =
    `
    div[class^="_contact__content__header__name_"],
    span[class^="_message__nick_"],
    div[class^="_username_"],
    h3[class^="_info_card__title_"]
    {
      filter: blur(${settings.varStyles.mspBlur}px) grayscale(1);
    }
    div[class^="_contact__content__header__name_"]:hover,
    span[class^="_message__nick_"]:hover,
    div[class^="_username_"]:hover,
    h3[class^="_info_card__title_"]:hover
    {
      filter: blur(0) grayscale(0);
    }
    `
    const _toggleNameDescription = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tabs[0].id!
            console.log("tab:" + JSON.stringify(tab))
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleNameDescription", nameDescriptionCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, name: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleNameDescription"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, name: false}
                }))
            }
        })
    }

    // toggleNoDelayDescription
    const noDelayDescriptionCSS = isWeb4Bip() 
    ? `
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
    `
    : `
    /* former wa version (v2.2412.xx) */
    /* mediaGallery */
    .tukmaf4q:hover /*media preview in gallery*/,
    ._1Pr6q:hover /*media preview in send media*/,

    /* mediaPreview */
    ._2AOIt div.ktbp76dp div[role="button"]:hover img /*image landscape*/,
    ._2AOIt div.eu4mztcy div[role="button"]:hover img /*image potrait*/,
    ._2AOIt div.ktbp76dp > div[role="button"]:hover /*video landscape*/,
    ._2AOIt div.eu4mztcy > div[role="button"]:hover /*video potrait*/,
    ._2AOIt .cm280p3y > div[role="button"] > div.g0rxnol2.fe3aadhc.g0rxnol2.ln8gz9je:hover /*document image*/,
    ._2AOIt .cm280p3y > div[role="button"] > div > div > div:not(:last-child):hover /*document*/,
    ._2AOIt .M6sU5:hover /*link*/,
    ._1BOF7 ._3cupO > div:not(.LldYr):hover /*link list*/,
    ._3V9pc:hover /* gif */,
    .kknmh:hover /*media reply thumb*/,
    ._2MmTH:hover /*media send preview*/,
    .ZRhsD._2foMf:hover /*Sticker*/,

    /* messages */
    ._2AOIt:hover div:first-child /*normal message*/,
    ._3cupO:hover /*link list message*/,
    ._1qNn2 ._1nCcB:hover /*sticker*/,
    ._1BOF7 ._1sykI:hover /*blue info bar*/,

    /* messagesPreview */
    .vQ0w7:hover /*message preview*/,

    /* name */
    div:not([role]) > div:not([role]) > ._8nE1Y ._21S-L:hover /*user/group name in search message*/,
    div[role="row"] > div > ._8nE1Y ._21S-L:hover /*user/group name in message list*/,
    div[role="button"] > div > ._8nE1Y ._21S-L:hover /*user/group name in non message list*/,
    ._3W2ap:hover /*Top user/group name*/,
    ._2au8k div:nth-child(2):hover /*Top group user preview*/,
    ._2HCBh:hover ._1N-sl ._1mDG- /*Details groupname*/,
    .q9lllk4z:hover /*Details username */,
    .qfejxiq4 .Mk0Bp._30scZ:hover /*Details username business*/,
    .njub1g37 span._11JPr:hover /*Starred messages user/group name*/,
    .a4ywakfo.qt60bha0:hover /*About user phone number*/,
    ._3IzYj:hover /*Message in chat*/,
    .Efdtr:hover /* name in contact attachment */,
    .djhxrpsl:hover /* name in multi contact attachment */,

    /* profilePic */
    [role="row"] > div > ._1AHcd ._13jwn:hover /*profile pic message list*/,
    [role="button"] > div > ._1AHcd ._13jwn:hover /*profile pic non message list*/,
    ._2pr2H:hover /*message view profile pic*/,
    ._3WByx:hover /*self profile pic*/,
    .stnyektq:hover /*group chat msg profile pic*/,
    ._3oha0._2xaO4:hover /* voice message profile pic */,
    ._3dPH0:hover /* contacts attachment */,
    .b021xdil:hover /* multi contacts attachment */,
    .pz0xruzv:hover /*Details direct profile pic*/,
    .njub1g37 ._3xH7K:hover /*Details group profile pic*/,
    .njub1g37 .kk3akd72.claouzo6:hover /*Starred message profile pic*/,

    /* textInput */
    ._3Uu1_:hover /*textarea*/,

    /* updated wa version (v2.3000.xx) */
    /* mediaGallery */
    div._ajuf._ajuh._ajug > div:hover /* media in overlay view */,
    div.x1conndi:hover /* media thumb in overlay view and details panel */,
    div.x4t2iug:hover /* media thumb in media gallery panel */,

    /* mediaPreview */
    div._amk4 > ._amk6 :is(div, button)[role="button"]:not(.x13yyeie, ._ak3u, [data-js-context-icon], .x1a06ls3):hover /* media messages in chat panel (also quoted message and contact attachment button) */,
    div._ak4o:hover /* voice note / audio in chat panel */,
    div._ahy5 > div:hover /* link preview in chat panel */,
    div._ak15 > ._ahwq:hover /* some link preview in link list panel */,
    span._ajxd._ajxk > ._ajxj._ajxd:hover /* sticker in chat panel */,
    div.xz9dduz > div:first-child:hover /* maps / location */,
    div._ajwt > div:first-child > div:nth-child(2) > div:hover /* media preview in send media */,
    div._ak3i:hover /* media preview thumb in send media */,
    div._ajwt .xm0mufa > div:hover /* document filename in send media */,

    /* messages */
    div._amk4 > ._amk6:hover /* normal message text */,
    div._amk4 ._am2s:hover /* sticker message */,

    /* messagesPreview */
    div._ak8k:hover /* message preview */,

    /* name */
    div[role="listitem"] ._ak8q:hover /* user/group name in message list */,
    div[role="button"][class=""] ._ak8q:hover /* user/group name in details list and popup list */,
    div[role="dialog"] ._ak8q:hover /* user name in contact popup list */,
    div[role="dialog"] div.copyable-text:hover /* phone number and business user name in contact popup list */,
    div[role="listitem"] ._am_2:hover /* community name */,
    div[role="button"]._amie > div:nth-child(1):hover /* user/group name at the top of chat panel */,
    div[role="button"]._amie > div:nth-child(2):hover /* user/group details at the top of chat panel */,
    div._ahxj:hover /* user name in group chat messages */,
    div._ahz1:hover /* user name in contact attachment */,
    div.xs83m0k.x1iyjqo2.xdl72j9.x18wx58x.x6ikm8r.x10wlt62:hover /* user name in multiple contacts attachment */,
    div.overlay ._ak8q:hover /* user name in overlay media view */,
    h2.xngnso2.x1fcty0u.x2b8uid:hover /* user name in details info */,
    div.x2b8uid.x193iq5w.xqmxbcd:hover /* group name in details info */,
    div.x1evy7pa.x1gslohp:hover /* user phone number in details info*/,
    span.x1lkfr7t.xdbd6k5.x1fcty0u.xw2npq5:nth-child(2):hover /* user phone number in details info*/,
    div.x1evy7pa.x1kgmq87.x2b8uid:hover /* group short details in details info */,
    div.xlm9qay.x1s688f.x1e56ztr:hover /* business user name in details info */,
    div.xlm9qay.x1s688f.x1e56ztr + div:hover /* business short details in details info */,
    div.x2b8uid > .xzueoph + div:hover /* business category in details info */,
    div.xkhd6sd:not([role]) > ._ajxu > div:hover /* business about in details info */,
    div.xkhd6sd._ajxt > ._ajxu > div:hover /* business phone number in details info */,
    div._ak1d > div:first-child > div:first-child > :not(:first-child):hover /* user/group name in starred message list */,

    /* profilePic */
    div[role="listitem"] ._ak8h:hover /* user/group profile pic in message list */,
    div[role="button"][class=""] ._ak8h:hover /* user/group profile pic in details list and popup list */,
    div[role="dialog"] ._ak8h:hover /* user/group profile pic in details list and popup list */,
    header._amid div[role="button"]:first-child > div:hover /* user/group profile pic at the top of chat panel */,
    div._amk4 > div[role="button"]:hover /* user profile pic in group chat messages */,
    div._ahz2:hover /* user profile pic in contact attachment */,
    div.x2lah0s.x1c4vz4f.xdl72j9.x194xeti:hover /* user profile pic in multiple contact attachment */,
    div._ak4m:hover /* user profile pic in voice note chat */,
    div.overlay ._ak8h:hover /* user profile pic in overlay media view */,
    div.x78zum5.xl56j7k.x1fqp7bg > div[role="button"]:hover /* user profile pic in details panel */,
    div[role="button"][class="x1n2onr6 x14yjl9h xudhj91 x18nykt9 xww2gxu"]:hover /* business profile pic in details panel */,
    div.x10l6tqk.x13vifvy.x17qophe.xh8yej3.xiqx3za.x6ikm8r.x10wlt62.x1knukwh.xihgre1:hover /* business profile banner in details panel */,
    div.x15e7hw7:hover /* business profile banner in catalog list */,
    div._amje:hover /* group profile pic in details panel */,
    div.overlay ._am0k:hover /* user/group profile pic overlay view */,
    div.x1okw0bk.x1w0mnb:hover /* user profile pic in starred message list */,

    /* textInput */
    div._ak1l:hover /* message text input */
    {
      transition-delay: 0.04s !important;
      -webkit-transition-duration: 0s !important;
      -moz-transition-duration: 0s !important;
      -o-transition-duration: 0s !important;
      transition-duration: 0s !important;
    }
    `;
    const _toggleNoDelayDescription = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tabs[0].id!
            console.log("tab:" + JSON.stringify(tab))
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleNoDelayDescription", noDelayDescriptionCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, noDelay: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleNoDelayDescription"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, noDelay: false}
                }))
            }
        })
    }

    // toggleUnblurActiveDescription
    const unblurActiveDescriptionCSS = isWeb4Bip() 
    ? `
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
    `
    : `
    /* former wa version (v2.2412.xx) */
    /* mediaGallery */
    body:hover .tukmaf4q /*media preview in gallery*/,
    body:hover ._1Pr6q /*media preview in send media*/,

    /* mediaPreview */
    body:hover ._2AOIt div.ktbp76dp div[role="button"] img /*image landscape*/,
    body:hover ._2AOIt div.eu4mztcy div[role="button"] img /*image potrait*/,
    body:hover ._2AOIt div.ktbp76dp > div[role="button"] /*video landscape*/,
    body:hover ._2AOIt div.eu4mztcy > div[role="button"] /*video potrait*/,
    body:hover ._2AOIt .cm280p3y > div[role="button"] > div.g0rxnol2.fe3aadhc.g0rxnol2.ln8gz9je /*document image*/,
    body:hover ._2AOIt .cm280p3y > div[role="button"] > div > div > div:not(:last-child) /*document*/,
    body:hover ._2AOIt .M6sU5 /*link*/,
    body:hover ._1BOF7 ._3cupO > div:not(.LldYr) /*link list*/,
    body:hover ._3V9pc /* gif */,
    body:hover .kknmh /*media reply thumb*/,
    body:hover ._2MmTH /*media send preview*/,
    body:hover .ZRhsD._2foMf /*Sticker*/,

    /* messages */
    body:hover ._2AOIt div:first-child /*normal message*/,
    body:hover ._3cupO /*link list message*/,
    body:hover ._1qNn2 ._1nCcB /*sticker*/,
    body:hover ._1BOF7 ._1sykI /*blue info bar*/,

    /* messagesPreview */
    body:hover .vQ0w7 /*message preview*/,

    /* name */
    body:hover div:not([role]) > div:not([role]) > ._8nE1Y ._21S-L /*user/group name in search message*/,
    body:hover div[role="row"] > div > ._8nE1Y ._21S-L /*user/group name in message list*/,
    body:hover div[role="button"] > div > ._8nE1Y ._21S-L /*user/group name in non message list*/,
    body:hover ._3W2ap /*Top user/group name*/,
    body:hover ._2au8k div:nth-child(2) /*Top group user preview*/,
    body:hover ._2HCBh ._1N-sl ._1mDG- /*Details groupname*/,
    body:hover .q9lllk4z /*Details username */,
    body:hover .qfejxiq4 .Mk0Bp._30scZ /*Details username business*/,
    body:hover .njub1g37 span._11JPr /*Starred messages user/group name*/,
    body:hover .a4ywakfo.qt60bha0 /*About user phone number*/,
    body:hover ._3IzYj /*Message in chat*/,
    body:hover .Efdtr /* name in contact attachment */,
    body:hover .djhxrpsl /* name in multi contact attachment */,

    /* profilePic */
    body:hover [role="row"] > div > ._1AHcd ._13jwn /*profile pic message list*/,
    body:hover [role="button"] > div > ._1AHcd ._13jwn /*profile pic non message list*/,
    body:hover ._2pr2H /*message view profile pic*/,
    body:hover ._3WByx /*self profile pic*/,
    body:hover .stnyektq /*group chat msg profile pic*/,
    body:hover ._3oha0._2xaO4 /* voice message profile pic */,
    body:hover ._3dPH0 /* contacts attachment */,
    body:hover .b021xdil /* multi contacts attachment */,
    body:hover .pz0xruzv /*Details direct profile pic*/,
    body:hover .njub1g37 ._3xH7K /*Details group profile pic*/,
    body:hover .njub1g37 .kk3akd72.claouzo6 /*Starred message profile pic*/,

    /* updated wa version (v2.3000.xx) */
    /* mediaGallery */
    body:hover div._ajuf._ajuh._ajug > div /* media in overlay view */,
    body:hover div.x1conndi /* media thumb in overlay view and details panel */,
    body:hover div.x4t2iug /* media thumb in media gallery panel */,

    /* mediaPreview */
    body:hover div._amk4 > ._amk6 :is(div, button)[role="button"]:not(.x13yyeie, ._ak3u, [data-js-context-icon], .x1a06ls3) /* media messages in chat panel (also quoted message and contact attachment button) */,
    body:hover div._ak4o /* voice note / audio in chat panel */,
    body:hover div._ahy5 > div /* link preview in chat panel */,
    body:hover div._ak15 > ._ahwq /* some link preview in link list panel */,
    body:hover span._ajxd._ajxk > ._ajxj._ajxd /* sticker in chat panel */,
    body:hover div.xz9dduz > div:first-child /* maps / location */,
    body:hover div._ajwt > div:first-child > div:nth-child(2) > div /* media preview in send media */,
    body:hover div._ak3i /* media preview thumb in send media */,
    body:hover div._ajwt .xm0mufa > div /* document filename in send media */,

    /* messages */
    body:hover div._amk4 > ._amk6 /* normal message text */,
    body:hover div._amk4 ._am2s /* sticker message */,

    /* messagesPreview */
    body:hover div._ak8k /* message preview */,

    /* name */
    body:hover div[role="listitem"] ._ak8q /* user/group name in message list */,
    body:hover div[role="button"][class=""] ._ak8q /* user/group name in details list and popup list */,
    body:hover div[role="dialog"] ._ak8q /* user name in contact popup list */,
    body:hover div[role="dialog"] div.copyable-text /* phone number and business user name in contact popup list */,
    body:hover div[role="listitem"] ._am_2 /* community name */,
    body:hover div[role="button"]._amie > div:nth-child(1) /* user/group name at the top of chat panel */,
    body:hover div[role="button"]._amie > div:nth-child(2) /* user/group details at the top of chat panel */,
    body:hover div._ahxj /* user name in group chat messages */,
    body:hover div._ahz1 /* user name in contact attachment */,
    body:hover div.xs83m0k.x1iyjqo2.xdl72j9.x18wx58x.x6ikm8r.x10wlt62 /* user name in multiple contacts attachment */,
    body:hover div.overlay ._ak8q /* user name in overlay media view */,
    body:hover h2.xngnso2.x1fcty0u.x2b8uid /* user name in details info */,
    body:hover div.x2b8uid.x193iq5w.xqmxbcd /* group name in details info */,
    body:hover div.x1evy7pa.x1gslohp /* user phone number in details info*/,
    body:hover span.x1lkfr7t.xdbd6k5.x1fcty0u.xw2npq5:nth-child(2) /* user phone number in details info*/,
    body:hover div.x1evy7pa.x1kgmq87.x2b8uid /* group short details in details info */,
    body:hover div.xlm9qay.x1s688f.x1e56ztr /* business user name in details info */,
    body:hover div.xlm9qay.x1s688f.x1e56ztr + div /* business short details in details info */,
    body:hover div.x2b8uid > .xzueoph + div /* business category in details info */,
    body:hover div.xkhd6sd:not([role]) > ._ajxu > div /* business about in details info */,
    body:hover div.xkhd6sd._ajxt > ._ajxu > div /* business phone number in details info */,
    body:hover div._ak1d > div:first-child > div:first-child > :not(:first-child) /* user/group name in starred message list */,

    /* profilePic */
    body:hover div[role="listitem"] ._ak8h /* user/group profile pic in message list */,
    body:hover div[role="button"][class=""] ._ak8h /* user/group profile pic in details list and popup list */,
    body:hover div[role="dialog"] ._ak8h /* user/group profile pic in details list and popup list */,
    body:hover header._amid div[role="button"]:first-child > div /* user/group profile pic at the top of chat panel */,
    body:hover div._amk4 > div[role="button"] /* user profile pic in group chat messages */,
    body:hover div._ahz2 /* user profile pic in contact attachment */,
    body:hover div.x2lah0s.x1c4vz4f.xdl72j9.x194xeti /* user profile pic in multiple contact attachment */,
    body:hover div._ak4m /* user profile pic in voice note chat */,
    body:hover div.overlay ._ak8h /* user profile pic in overlay media view */,
    body:hover div.x78zum5.xl56j7k.x1fqp7bg > div[role="button"] /* user profile pic in details panel */,
    body:hover div[role="button"][class="x1n2onr6 x14yjl9h xudhj91 x18nykt9 xww2gxu"] /* business profile pic in details panel */,
    body:hover div.x10l6tqk.x13vifvy.x17qophe.xh8yej3.xiqx3za.x6ikm8r.x10wlt62.x1knukwh.xihgre1 /* business profile banner in details panel */,
    body:hover div.x15e7hw7 /* business profile banner in catalog list */,
    body:hover div._amje /* group profile pic in details panel */,
    body:hover div.overlay ._am0k /* user/group profile pic overlay view */,
    body:hover div.x1okw0bk.x1w0mnb /* user profile pic in starred message list */
    {
      filter: blur(0) grayscale(0);
      transition-delay: 0s;
    }

    /* former wa version (v2.2412.xx) */
    /* textInput */
    body:hover ._3Uu1_ /*textarea*/,

    /* updated wa version (v2.3000.xx) */
    /* textInput */
    div._ak1l:hover /* message text input */
    {
      filter: grayscale(0) opacity(1);
    }

    `;
    const _toggleUnblurActiveDescription = (status: boolean): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tabs[0].id!
            console.log("tab:" + JSON.stringify(tab))
            if (status) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: insertCSSDirectly,
                    args: ["toggleUnblurActiveDescription", unblurActiveDescriptionCSS]
                })
                setCount(count + 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, unblurActive: true}
                }))
            } else {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: ["toggleUnblurActiveDescription"]
                })
                setCount(count - 1)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, unblurActive: false}
                }))
            }
        })
    }

    // The chrome.tabs.onUpdated event listener has been moved to background.ts
    // to ensure CSS is applied even when the popup is closed

    // Add event listeners for reveal buttons to toggle collapsible sections
    useEffect(() => {
        const revealButtons = document.querySelectorAll('.reveal-btn');

        revealButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const listItem = target.closest('li');
                const collapsible = listItem?.querySelector('.collapsible');

                // Toggle the 'show' class on the collapsible element
                collapsible?.classList.toggle('show');

                // Toggle the 'active' class on the button
                target.classList.toggle('active');
            });
        });

        return () => {
            revealButtons.forEach(button => {
                button.removeEventListener('click', () => {});
            });
        };
    }, []);

    useEffect(() => {
        // Load settings from chrome.storage.local on page load
        chrome.storage.local.get('settings', (result) => {
            if (result.settings) {
                setSettings(result.settings); // Update state with stored settings

                // Check if the current tab is web4.bip.com
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: chrome.tabs.Tab[]): void {
                    const tab: chrome.tabs.Tab = tabs[0];
                    if (tab.url && tab.url.includes('web4.bip.com')) {
                        console.log("Applying CSS to web4.bip.com from stored settings");
                        const tabId: number = tab.id!;

                        // Apply CSS based on stored settings
                        if (result.settings.styles.messages) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleMessages", messagesCSS]
                            });
                        }

                        if (result.settings.styles.messagesPreview) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleMessagesPreview", messagesPreviewCSS]
                            });
                        }

                        if (result.settings.styles.mediaPreview) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleMediaPreview", mediaPreviewCSS]
                            });
                        }

                        if (result.settings.styles.textInput) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleTextInputDescription", textInputDescriptionCSS]
                            });
                        }

                        if (result.settings.styles.profilePic) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleProfilePicDescription", profilePicDescriptionCSS]
                            });
                        }

                        if (result.settings.styles.name) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleNameDescription", nameDescriptionCSS]
                            });
                        }

                        if (result.settings.styles.noDelay) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleNoDelayDescription", noDelayDescriptionCSS]
                            });
                        }

                        if (result.settings.styles.unblurActive) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleUnblurActiveDescription", unblurActiveDescriptionCSS]
                            });
                        }
                    }
                });
            }
        });
    }, [messagesCSS, messagesPreviewCSS, mediaPreviewCSS, textInputDescriptionCSS, profilePicDescriptionCSS, nameDescriptionCSS, noDelayDescriptionCSS, unblurActiveDescriptionCSS]); // Update when CSS changes


    return (
      <>
          <div className="header">
              <h1>{t("extensionSettings")}</h1>
          </div>
          <div id="mainContent">
              <ul>
                  <li>
                      {t("toggleMessages")}
                      <input type="checkbox" id="messages" data-style="messages"
                             checked={settings.styles.messages}
                             onChange={(): void => _toggleMessages(!settings.styles.messages)}
                      />
                      <label htmlFor="messages" data-localetitle="toggleMessagesDescription"></label>
                      <div className="collapsible">
                          <form className="var-style">
                              {t("blurInputLabel")}
                              <button type="reset" data-localetitle="resetValue"
                                      onClick={(event): void => {
                                          setSettings(prevSettings => ({
                                              ...prevSettings,
                                              varStyles: {...prevSettings.varStyles, msBlur: 8}
                                          }))
                                      }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                                          <path stroke-miterlimit="10"
                                                d="M6.395 7.705A7.885 7.885 0 0 1 12 5.382a7.929 7.929 0 0 1 7.929 7.929A7.94 7.94 0 0 1 12 21.25a7.939 7.939 0 0 1-7.929-7.94"/>
                                          <path stroke-linejoin="round"
                                                d="m7.12 2.75l-.95 3.858a1.332 1.332 0 0 0 .97 1.609l3.869.948"/>
                                      </g>
                                  </svg>
                              </button>
                              <input type="number" name="msBlur" id="msBlur" data-var-name="msBlur"
                                     value={settings.varStyles.msBlur}
                                     onChange={(event): void => {
                                         setSettings(prevSettings => ({
                                             ...prevSettings,
                                             varStyles: {...prevSettings.varStyles, msBlur: Number(event.target.value)}
                                         }))
                                     }}
                                     data-localetitle="msBlurInputDescription"/>
                              <span className="unit">px</span>
                              <button type="submit" data-localetitle="msBlurInputDescription">✔</button>
                          </form>
                      </div>
                  </li>
                  <li>
                      {t("toggleMessagesPreview")}
                      <button type="button" className="reveal-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentColor"
                                    d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/>
                          </svg>
                      </button>
                      <input type="checkbox" id="messagesPreview" data-style="messagesPreview"
                             checked={settings.styles.messagesPreview}
                             onChange={(): void => _toggleMessagesPreview(!settings.styles.messagesPreview)}
                      />
                      <label htmlFor="messagesPreview" data-localetitle="toggleMessagesPreviewDescription"></label>
                      <div className="collapsible">
                          <form className="var-style">
                              {t("blurInputLabel")}
                              <button type="reset" data-localetitle="resetValue"
                                      onClick={(event): void => {
                                          setSettings(prevSettings => ({
                                              ...prevSettings,
                                              varStyles: {...prevSettings.varStyles, mspBlur: 8}
                                          }))
                                      }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                                          <path stroke-miterlimit="10"
                                                d="M6.395 7.705A7.885 7.885 0 0 1 12 5.382a7.929 7.929 0 0 1 7.929 7.929A7.94 7.94 0 0 1 12 21.25a7.939 7.939 0 0 1-7.929-7.94"/>
                                          <path stroke-linejoin="round"
                                                d="m7.12 2.75l-.95 3.858a1.332 1.332 0 0 0 .97 1.609l3.869.948"/>
                                      </g>
                                  </svg>
                              </button>
                              <input type="number" name="mspBlur" id="mspBlur" data-var-name="mspBlur"
                                     value={settings.varStyles.mspBlur}
                                     onChange={(event): void => {
                                         setSettings(prevSettings => ({
                                             ...prevSettings,
                                             varStyles: {...prevSettings.varStyles, mspBlur: Number(event.target.value)}
                                         }))
                                     }}
                                     data-localetitle="mspBlurInputDescription"/>
                              <span className="unit">px</span>
                              <button type="submit" data-localetitle="mspBlurInputDescription">✔</button>
                          </form>
                      </div>
                  </li>
                  <li>
                      {t("toggleMediaPreview")}
                      <button type="button" className="reveal-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentColor"
                                    d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/>
                          </svg>
                      </button>
                      <input type="checkbox" id="mediaPreview" data-style="mediaPreview"
                             checked={settings.styles.mediaPreview}
                             onChange={(): void => _toggleMediaPreview(!settings.styles.mediaPreview)}
                      />
                      <label htmlFor="mediaPreview" data-localetitle="toggleMediaPreviewDescription"></label>
                      <div className="collapsible">
                          <form className="var-style">
                              {t("blurInputLabel")}
                              <button type="reset" data-localetitle="resetValue"
                                      onClick={(event): void => {
                                          setSettings(prevSettings => ({
                                              ...prevSettings,
                                              varStyles: {...prevSettings.varStyles, mdpBlur: 20}
                                          }))
                                      }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                                          <path stroke-miterlimit="10"
                                                d="M6.395 7.705A7.885 7.885 0 0 1 12 5.382a7.929 7.929 0 0 1 7.929 7.929A7.94 7.94 0 0 1 12 21.25a7.939 7.939 0 0 1-7.929-7.94"/>
                                          <path stroke-linejoin="round"
                                                d="m7.12 2.75l-.95 3.858a1.332 1.332 0 0 0 .97 1.609l3.869.948"/>
                                      </g>
                                  </svg>
                              </button>
                              <input type="number" name="mdpBlur" id="mdpBlur" data-var-name="mdpBlur"
                                     value={settings.varStyles.mdpBlur}
                                     onChange={(event): void => {
                                         setSettings(prevSettings => ({
                                             ...prevSettings,
                                             varStyles: {...prevSettings.varStyles, mdpBlur: Number(event.target.value)}
                                         }))
                                     }}
                                     data-localetitle="mdpBlurInputDescription"/>
                              <span className="unit">px</span>
                              <button type="submit" data-localetitle="mdpBlurInputDescription">✔</button>
                          </form>
                      </div>
                  </li>
                  <li>
                      {t("toggleTextInput")}
                      <input type="checkbox" id="textInput" data-style="textInput"
                             checked={settings.styles.textInput}
                             onChange={(): void => _toggleTextInputDescription(!settings.styles.textInput)}
                      />
                      <label htmlFor="textInput" data-localetitle="toggleTextInputDescription"></label>
                  </li>
                  <li>
                      {t("toggleProfilePic")}
                      <button type="button" className="reveal-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentColor"
                                    d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/>
                          </svg>
                      </button>
                      <input type="checkbox" id="profilePic" data-style="profilePic"
                             checked={settings.styles.profilePic}
                             onChange={(): void => _toggleProfilePicDescription(!settings.styles.profilePic)}
                      />
                      <label htmlFor="profilePic" data-localetitle="toggleProfilePicDescription"></label>
                      <div className="collapsible">
                          <form className="var-style">
                              {t("ppSmBlurInputLabel")}
                              <button type="reset" data-localetitle="resetValue"
                                      onClick={(event): void => {
                                          setSettings(prevSettings => ({
                                              ...prevSettings,
                                              varStyles: {...prevSettings.varStyles, ppBlur: 8}
                                          }))
                                      }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                                          <path stroke-miterlimit="10"
                                                d="M6.395 7.705A7.885 7.885 0 0 1 12 5.382a7.929 7.929 0 0 1 7.929 7.929A7.94 7.94 0 0 1 12 21.25a7.939 7.939 0 0 1-7.929-7.94"/>
                                          <path stroke-linejoin="round"
                                                d="m7.12 2.75l-.95 3.858a1.332 1.332 0 0 0 .97 1.609l3.869.948"/>
                                      </g>
                                  </svg>
                              </button>
                              <input type="number" name="ppSmBlur" id="ppSmBlur" data-var-name="ppSmBlur"
                                     value={settings.varStyles.ppBlur}
                                     onChange={(event): void => {
                                         setSettings(prevSettings => ({
                                             ...prevSettings,
                                             varStyles: {...prevSettings.varStyles, ppBlur: Number(event.target.value)}
                                         }))
                                     }}
                                     data-localetitle="ppSmBlurInputDescription"/>
                              <span className="unit">px</span>
                              <button type="submit" data-localetitle="ppSmBlurInputDescription">✔</button>
                          </form>
                      </div>
                  </li>
                  <li>
                      {t("toggleName")}
                      <button type="button" className="reveal-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentColor"
                                    d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/>
                          </svg>
                      </button>
                      <input type="checkbox" id="name" data-style="name"
                             checked={settings.styles.name}
                             onChange={(): void => _toggleNameDescription(!settings.styles.name)}
                      />
                      <label htmlFor="name" data-localetitle="toggleNameDescription"></label>
                      <div className="collapsible">
                          <form className="var-style">
                              {t("blurInputLabel")}
                              <button type="reset" data-localetitle="resetValue"
                                      onClick={(event): void => {
                                          setSettings(prevSettings => ({
                                              ...prevSettings,
                                              varStyles: {...prevSettings.varStyles, nmBlur: 5}
                                          }))
                                      }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                                          <path stroke-miterlimit="10"
                                                d="M6.395 7.705A7.885 7.885 0 0 1 12 5.382a7.929 7.929 0 0 1 7.929 7.929A7.94 7.94 0 0 1 12 21.25a7.939 7.939 0 0 1-7.929-7.94"/>
                                          <path stroke-linejoin="round"
                                                d="m7.12 2.75l-.95 3.858a1.332 1.332 0 0 0 .97 1.609l3.869.948"/>
                                      </g>
                                  </svg>
                              </button>
                              <input type="number" name="nmBlur" id="nmBlur" data-var-name="nmBlur"
                                     value={settings.varStyles.nmBlur}
                                     onChange={(event): void => {
                                         setSettings(prevSettings => ({
                                             ...prevSettings,
                                             varStyles: {...prevSettings.varStyles, nmBlur: Number(event.target.value)}
                                         }))
                                     }}
                                     data-localetitle="nmBlurInputDescription"/>
                              <span className="unit">px</span>
                              <button type="submit" data-localetitle="nmBlurInputDescription">✔</button>
                          </form>
                      </div>
                  </li>
                  <li>
                      {t("toggleNoDelay")}
                      <input type="checkbox" id="noDelay" data-style="noDelay"
                             checked={settings.styles.noDelay}
                             onChange={(): void => _toggleNoDelayDescription(!settings.styles.noDelay)}
                      />
                      <label htmlFor="noDelay" data-localetitle="toggleNoDelayDescription"></label>
                  </li>
                  <li>
                      {t("toggleUnblurActive")}
                      <input type="checkbox" id="unblurActive" data-style="unblurActive"
                             checked={settings.styles.unblurActive}
                             onChange={(): void => _toggleUnblurActiveDescription(!settings.styles.unblurActive)}
                      />
                      <label htmlFor="unblurActive" data-localetitle="toggleUnblurActiveDescription"></label>
                  </li>
              </ul>
          </div>
      </>
    )
}
const root = createRoot(document.getElementById("root")!)
root.render(
    <React.StrictMode>
        <Popup/>
    </React.StrictMode>
)
