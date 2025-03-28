import React, { useEffect, useState, useMemo } from "react"
import { createRoot } from "react-dom/client"
import "./config.ts"
import { useTranslation } from "react-i18next"
import {useChromeStorageLocal} from 'use-chrome-storage'
import "./popup.css"
import { getCSS } from './styles'

const Popup: () => React.JSX.Element = (): React.JSX.Element => {
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
    const [settings, setSettings, isPersistent, error, isInitialStateResolved] = useChromeStorageLocal('settings', defaultSettings)

    // Dynamically calculate the count of enabled styles
    const enabledStylesCount: number = useMemo((): number => {
        if (!settings || !settings.styles)
            return 0
        return Object.values(settings.styles).filter(Boolean).length
    }, [settings])

    useEffect((): void => {
        chrome.action.setBadgeText({ text: enabledStylesCount.toString() })
    }, [enabledStylesCount])

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
            return
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
    const css = getCSS(settings)

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
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, messagesPreview: false}
                }))
            }
        })
    }

    // toggleMediaPreview
    const mediaPreviewCSS: string = css.mediaPreview
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
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, mediaPreview: false}
                }))
            }
        })
    }

    // toggleTextInputDescription
    const textInputDescriptionCSS: string = css.textInput
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
                setSettings(prevSettings => ({
                    ...prevSettings,
                    styles: {...prevSettings.styles, name: false}
                }))
            }
        })
    }

    // Reset all settings to default
    const _resetSettings = (): void => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs: chrome.tabs.Tab[]): void {
            const tab: chrome.tabs.Tab = tabs[0]
            const tabId: number = tab.id!

            // Remove all CSS
            const styleIds = [
                "toggleMessages", 
                "toggleMessagesPreview", 
                "toggleMediaPreview", 
                "toggleTextInputDescription", 
                "toggleProfilePicDescription", 
                "toggleNameDescription"
            ]

            styleIds.forEach(styleId => {
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: removeCSSDirectly,
                    args: [styleId]
                })
            })

            // Reset settings to default
            setSettings(defaultSettings)
        })
    }

    useEffect((): void => {
        // Load settings from chrome.storage.local on page load
        chrome.storage.local.get('settings', (result): void => {
            if (result.settings) {
                setSettings(result.settings) // Update state with stored settings
                // Check if the current tab is web4.bip.com
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: chrome.tabs.Tab[]): void {
                    const tab: chrome.tabs.Tab = tabs[0]
                    if (tab.url && tab.url.includes('web4.bip.com')) {
                        console.log("Applying CSS to web4.bip.com from stored settings")
                        const tabId: number = tab.id!
                        // Apply CSS based on stored settings
                        if (result.settings.styles.messages) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: removeCSSDirectly,
                                args: ["toggleMessages"]
                            })
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleMessages", messagesCSS]
                            })
                        }
                        if (result.settings.styles.messagesPreview) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: removeCSSDirectly,
                                args: ["toggleMessagesPreview"]
                            })
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleMessagesPreview", messagesPreviewCSS]
                            })
                        }
                        if (result.settings.styles.mediaPreview) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: removeCSSDirectly,
                                args: ["toggleMediaPreview"]
                            })
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleMediaPreview", mediaPreviewCSS]
                            })
                        }
                        if (result.settings.styles.textInput) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: removeCSSDirectly,
                                args: ["toggleTextInputDescription"]
                            })
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleTextInputDescription", textInputDescriptionCSS]
                            })
                        }
                        if (result.settings.styles.profilePic) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: removeCSSDirectly,
                                args: ["toggleProfilePicDescription"]
                            })
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: insertCSSDirectly,
                                args: ["toggleProfilePicDescription", profilePicDescriptionCSS]
                            })
                        }
                        if (result.settings.styles.name) {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: removeCSSDirectly,
                                args: ["toggleNameDescription"]
                            })
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
                      <input type="number" name="msBlur" id="msBlur" data-var-name="msBlur"
                             className="blur-input"
                             value={settings.varStyles.msBlur}
                             onChange={(event): void => {
                                 const newValue = Number(event.target.value)
                                 setSettings(prevSettings => ({
                                     ...prevSettings,
                                     varStyles: {...prevSettings.varStyles, msBlur: newValue}
                                 }))
                                 // Apply changes immediately
                                 if (settings.styles.messages && currentTab?.url?.includes('web4.bip.com')) {
                                     const tabId: any = currentTab.id!
                                     chrome.scripting.executeScript({
                                         target: { tabId },
                                         func: insertCSSDirectly,
                                         args: ["toggleMessages", css.messages]
                                     })
                                 }
                             }}
                             data-localetitle="msBlurInputDescription"/>
                  </li>
                  <li>
                      {t("toggleMessagesPreview")}
                      <input type="checkbox" id="messagesPreview" data-style="messagesPreview"
                             checked={settings.styles.messagesPreview}
                             onChange={(): void => _toggleMessagesPreview(!settings.styles.messagesPreview)}
                      />
                      <label htmlFor="messagesPreview" data-localetitle="toggleMessagesPreviewDescription"></label>
                      <input type="number" name="mspBlur" id="mspBlur" data-var-name="mspBlur"
                             className="blur-input"
                             value={settings.varStyles.mspBlur}
                             onChange={(event): void => {
                                 const newValue: number = Number(event.target.value)
                                 setSettings(prevSettings => ({
                                     ...prevSettings,
                                     varStyles: {...prevSettings.varStyles, mspBlur: newValue}
                                 }))
                                 // Apply changes immediately
                                 if (settings.styles.messagesPreview && currentTab?.url?.includes('web4.bip.com')) {
                                     const tabId: number = currentTab.id!
                                     chrome.scripting.executeScript({
                                         target: { tabId },
                                         func: insertCSSDirectly,
                                         args: ["toggleMessagesPreview", css.messagesPreview]
                                     })
                                 }
                             }}
                             data-localetitle="mspBlurInputDescription"/>
                  </li>
                  <li>
                      {t("toggleMediaPreview")}
                      <input type="checkbox" id="mediaPreview" data-style="mediaPreview"
                             checked={settings.styles.mediaPreview}
                             onChange={(): void => _toggleMediaPreview(!settings.styles.mediaPreview)}
                      />
                      <label htmlFor="mediaPreview" data-localetitle="toggleMediaPreviewDescription"></label>
                      <input type="number" name="mdpBlur" id="mdpBlur" data-var-name="mdpBlur"
                             className="blur-input"
                             value={settings.varStyles.mdpBlur}
                             onChange={(event): void => {
                                 const newValue: number = Number(event.target.value)
                                 setSettings(prevSettings => ({
                                     ...prevSettings,
                                     varStyles: {...prevSettings.varStyles, mdpBlur: newValue}
                                 }))
                                 // Apply changes immediately
                                 if (settings.styles.mediaPreview && currentTab?.url?.includes('web4.bip.com')) {
                                     const tabId: number = currentTab.id!
                                     chrome.scripting.executeScript({
                                         target: { tabId },
                                         func: insertCSSDirectly,
                                         args: ["toggleMediaPreview", css.mediaPreview]
                                     })
                                 }
                             }}
                             data-localetitle="mdpBlurInputDescription"/>
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
                      <input type="checkbox" id="profilePic" data-style="profilePic"
                             checked={settings.styles.profilePic}
                             onChange={(): void => _toggleProfilePicDescription(!settings.styles.profilePic)}
                      />
                      <label htmlFor="profilePic" data-localetitle="toggleProfilePicDescription"></label>
                      <input type="number" name="ppSmBlur" id="ppSmBlur" data-var-name="ppSmBlur"
                             className="blur-input"
                             value={settings.varStyles.ppBlur}
                             onChange={(event): void => {
                                 const newValue: number = Number(event.target.value)
                                 setSettings(prevSettings => ({
                                     ...prevSettings,
                                     varStyles: {...prevSettings.varStyles, ppBlur: newValue}
                                 }))
                                 // Apply changes immediately
                                 if (settings.styles.profilePic && currentTab?.url?.includes('web4.bip.com')) {
                                     const tabId: number = currentTab.id!
                                     chrome.scripting.executeScript({
                                         target: { tabId },
                                         func: insertCSSDirectly,
                                         args: ["toggleProfilePicDescription", css.profilePic]
                                     })
                                 }
                             }}
                             data-localetitle="ppSmBlurInputDescription"/>
                  </li>
                  <li>
                      {t("toggleName")}
                      <input type="checkbox" id="name" data-style="name"
                             checked={settings.styles.name}
                             onChange={(): void => _toggleNameDescription(!settings.styles.name)}
                      />
                      <label htmlFor="name" data-localetitle="toggleNameDescription"></label>
                      <input type="number" name="nmBlur" id="nmBlur" data-var-name="nmBlur"
                             className="blur-input"
                             value={settings.varStyles.nmBlur}
                             onChange={(event): void => {
                                 const newValue: number = Number(event.target.value)
                                 setSettings(prevSettings => ({
                                     ...prevSettings,
                                     varStyles: {...prevSettings.varStyles, nmBlur: newValue}
                                 }))
                                 // Apply changes immediately
                                 if (settings.styles.name && currentTab?.url?.includes('web4.bip.com')) {
                                     const tabId: number = currentTab.id!
                                     chrome.scripting.executeScript({
                                         target: { tabId },
                                         func: insertCSSDirectly,
                                         args: ["toggleNameDescription", css.name]
                                     })
                                 }
                             }}
                             data-localetitle="nmBlurInputDescription"/>
                  </li>
              </ul>
              <div className="reset-button-container">
                  <button 
                      className="reset-button" 
                      onClick={_resetSettings}
                  >
                      {t("resetButton")}
                  </button>
              </div>
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
