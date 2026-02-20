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
                    extensionSettings: "Bip Web Privacy Extension",
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
                    resetButton: "Reset",
                    toggleAll: "Enable/Disable All",
                    notOnBipWeb: "This extension only works on web.bip.com",
                },
            },
            tr: {
                translation: {
                    extensionToggle: "Aç/Kapat",
                    extensionSettings: "Bip Web Privacy Extension",
                    toggleMessages: "Sohbetteki Tüm Mesajlar",
                    blurInputLabel: "Bulanıklık miktarı",
                    toggleMessagesPreview: "Son Mesajlar Önizlemesi",
                    toggleMediaPreview: "Medya önizlemesi",
                    toggleMediaGallery: "Medya galerisi",
                    toggleTextInput: "Metin girişi",
                    toggleProfilePic: "Profil resimleri",
                    ppSmBlurInputLabel: "Küçük boyut bulanıklık miktarı",
                    ppBlurInputLabel: "Normal boyut bulanıklık miktarı",
                    ppLgBlurInputLabel: "Büyük boyut bulanıklık miktarı",
                    toggleName: "Grup/Kullanıcı adları",
                    toggleBlurOnIdle: "Boştayken WhatsApp'ı Bulanıklaştır",
                    itBlurInputLabel: "Boşta Kalma Süresi",
                    wiBlurInputLabel: "Bulanıklık miktarı",
                    resetButton: "Sıfırla",
                    toggleAll: "Tümünü Aç/Kapat",
                    notOnBipWeb: "Bu uzantı yalnızca web.bip.com üzerinde çalışır",
                },
            },
        },
    })
export default i18n
