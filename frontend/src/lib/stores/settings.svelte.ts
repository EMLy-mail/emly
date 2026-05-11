import { browser } from "$app/environment";
import type { EMLy_GUI_Settings } from "$lib/types";
import { SettingsKVHelper } from "$lib/utils/settingsKVHelper";
import { applyTheme, getStoredTheme } from "$lib/utils/theme";
import { setLocale } from "$lib/paraglide/runtime";

const kvHelper = new SettingsKVHelper();

const defaults: EMLy_GUI_Settings = {
    selectedLanguage: "it",
    useBuiltinPreview: true,
    useBuiltinPDFViewer: true,
    previewFileSupportedTypes: ["jpg", "jpeg", "png"],
    enableAttachedDebuggerProtection: true,
    useDarkEmailViewer: true,
    enableUpdateChecker: false,
    reduceMotion: false,
    theme: "dark",
    enableLinkClickConfirmation: false,
    enableTabMode: false,
    fixEmailTextContrast: false,
};

class SettingsStore {
    settings = $state<EMLy_GUI_Settings>({ ...defaults });
    hasHydrated = $state(false);

    constructor() {
        if (browser) {
            this.load();
        }
    }

    async load() {
        await kvHelper.init();
        const stored = await kvHelper.getAllSettings();
        if (Object.keys(stored).length > 0) {
            this.settings = { ...this.settings, ...stored };
        }

        // Sync tema con emly_theme (localStorage) per FOUC prevention in app.html
        const storedTheme = getStoredTheme();
        if (!this.settings.theme || this.settings.theme !== storedTheme) {
            this.settings.theme = storedTheme;
        }
        this.settings.useDarkEmailViewer = this.settings.theme === "dark";
        applyTheme(this.settings.theme);

        if (this.settings.selectedLanguage) {
            setLocale(this.settings.selectedLanguage);
        }

        this.hasHydrated = true;
    }

    async save() {
        if (!browser) return;
        await kvHelper.setAllSettings($state.snapshot(this.settings) as EMLy_GUI_Settings);
    }

    update(newSettings: Partial<EMLy_GUI_Settings>) {
        this.settings = { ...this.settings, ...newSettings };

        if (newSettings.theme && this.settings.theme) {
            applyTheme(this.settings.theme);
        }

        void this.save();
    }

    reset() {
        this.settings = { ...defaults };
        if (this.settings.theme) {
            applyTheme(this.settings.theme);
        }
        void this.save();
    }
}

export const settingsStore = new SettingsStore();
