import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import "./config.ts"
import { useTranslation } from "react-i18next"
import {useChromeStorageLocal} from 'use-chrome-storage'
import "./popup.css"
import { getCSS } from './styles'

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
            profilePic: false,
            textInput: false,
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
    const isWeb4Bip: () => boolean = (): boolean => {
        return currentTab?.url?.includes('web4.bip.com') || false
    }

    const insertCSSDirectly: (styleId: string, cssRules: string) => void = (styleId: string, cssRules: string): void => {
        console.log("Started insertCSSDirectly")
        const existingStyle = document.getElementById(styleId)
        if (existingStyle) {
            console.log(`Style with ID "${styleId}" already exists.`)
            return;
        }
        const styleElement: HTMLStyleElement = document.createElement("style")
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

    // Get CSS from centralized styles
    const css = getCSS(settings);

    // toggleMessages
    const messagesCSS: string = css.messages
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
    const messagesPreviewCSS: string = css.messagesPreview
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
    const mediaPreviewCSS: string = css.mediaPreview;
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
    const textInputDescriptionCSS: string = css.textInput;
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

    const profilePicDescriptionCSS: string = css.profilePic
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

    const nameDescriptionCSS: string = css.name
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
                            })
                        }
                    }
                })
            }
        })
    }, [messagesCSS, messagesPreviewCSS, mediaPreviewCSS, textInputDescriptionCSS, profilePicDescriptionCSS, nameDescriptionCSS]) // Update when CSS changes


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
