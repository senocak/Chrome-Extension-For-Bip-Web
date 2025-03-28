import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    extensionToggle: "Toggle",
                    extensionSettings: "Settings",
                    toggleMessages: "All Messages in Chat",
                    blurInputLabel: "Blur amount",
                    toggleMessagesPreview: "Last Messages Preview",
                    toggleMediaPreview: "Media preview",
                    toggleMediaGallery: "Media gallery",
                    toggleTextInput: "Text input",
                    toggleProfilePic: "Profile pictures",
                    ppSmBlurInputLabel: "Small size blur amount",
                    ppBlurInputLabel: "Normal size blur amount",
                    ppLgBlurInputLabel: "Large size blur amount",
                    toggleName: "Group/Users names",
                    toggleBlurOnIdle: "Blur WhatsApp on Idle",
                    itBlurInputLabel: "Idle Timeout",
                    wiBlurInputLabel: "Blur amount",
                },
            },
            ar: {
                translation: {
                    hello_world: "مرحباً بالعالم!",
                },
            },
        },
    });

export default i18n;