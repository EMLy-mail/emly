import { Dexie } from "dexie"
import type { EMLy_GUI_Settings } from "$lib/types";

const LOCALSTORAGE_KEY = "emly_gui_settings";

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

export class SettingsKVHelper {
    private db: Dexie;
    private settingsTable: Dexie.Table<any, string>;

    constructor() {
        // Nome DB aggiornato: il vecchio usava chiavi inline {key,value}, incompatibili con out-of-line.
        // init() migra i dati da localStorage se il nuovo DB è vuoto.
        this.db = new Dexie("EMLy_GUI_Settings_DB_v2");
        this.db.version(1).stores({ settings: "" }); // out-of-line keys: il valore in IndexedDB è il dato grezzo
        this.settingsTable = this.db.table("settings");
    }

    /**
     * Inizializza il DB se vuoto:
     * 1) Prova a migrare le impostazioni dal localStorage
     * 2) Se anche il localStorage è vuoto, inizializza con i default
     * @returns "migrated" | "defaults" | "existing" | "error"
     */
    async init(): Promise<"migrated" | "defaults" | "existing" | "error"> {
        try {
            const count = await this.settingsTable.count();
            if (count > 0) return "existing";

            // Strategia 1: migrazione da localStorage
            const raw = localStorage.getItem(LOCALSTORAGE_KEY);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw) as Partial<EMLy_GUI_Settings>;
                    const entries = Object.entries(parsed) as [keyof EMLy_GUI_Settings, any][];
                    if (entries.length > 0) {
                        await this.db.transaction("rw", this.settingsTable, async () => {
                            for (const [key, value] of entries) {
                                await this.settingsTable.put(value, key);
                            }
                        });
                        console.info("[SettingsKVHelper] Migrated settings from localStorage.");
                        return "migrated";
                    }
                } catch {
                    console.warn("[SettingsKVHelper] localStorage parse failed, falling back to defaults.");
                }
            }

            // Strategia 2: default
            const defaultEntries = Object.entries(defaults) as [keyof EMLy_GUI_Settings, any][];
            await this.db.transaction("rw", this.settingsTable, async () => {
                for (const [key, value] of defaultEntries) {
                    await this.settingsTable.put(value, key);
                }
            });
            console.info("[SettingsKVHelper] Initialized with default settings.");
            return "defaults";
        } catch (err) {
            console.error("[SettingsKVHelper] init() failed:", err);
            return "error";
        }
    }

    async setSetting<K extends keyof EMLy_GUI_Settings>(key: K, value: EMLy_GUI_Settings[K]): Promise<boolean> {
        try {
            await this.settingsTable.put(value, key);
            return true;
        } catch (err) {
            console.error(`[SettingsKVHelper] setSetting("${key}") failed:`, err);
            return false;
        }
    }

    async getSetting<K extends keyof EMLy_GUI_Settings>(key: K): Promise<EMLy_GUI_Settings[K] | undefined> {
        try {
            const value = await this.settingsTable.get(key);
            return value as EMLy_GUI_Settings[K] | undefined;
        } catch (err) {
            console.error(`[SettingsKVHelper] getSetting("${key}") failed:`, err);
            return undefined;
        }
    }

    async getAllSettings(): Promise<Partial<EMLy_GUI_Settings>> {
        try {
            const [keys, values] = await Promise.all([
                this.settingsTable.toCollection().primaryKeys() as Promise<string[]>,
                this.settingsTable.toArray()
            ]);
            const result: Partial<EMLy_GUI_Settings> = {};
            keys.forEach((key, i) => {
                result[key as keyof EMLy_GUI_Settings] = values[i];
            });
            return result;
        } catch (err) {
            console.error("[SettingsKVHelper] getAllSettings() failed:", err);
            return {};
        }
    }

    async setAllSettings(settings: EMLy_GUI_Settings): Promise<boolean> {
        try {
            await this.db.transaction("rw", this.settingsTable, async () => {
                for (const [key, value] of Object.entries(settings) as [keyof EMLy_GUI_Settings, any][]) {
                    await this.settingsTable.put(value, key);
                }
            });
            return true;
        } catch (err) {
            console.error("[SettingsKVHelper] setAllSettings() failed:", err);
            return false;
        }
    }

    async deleteSetting(key: keyof EMLy_GUI_Settings): Promise<boolean> {
        try {
            await this.settingsTable.delete(key);
            return true;
        } catch (err) {
            console.error(`[SettingsKVHelper] deleteSetting("${key}") failed:`, err);
            return false;
        }
    }

    async clearSettings(): Promise<boolean> {
        try {
            await this.settingsTable.clear();
            return true;
        } catch (err) {
            console.error(`[SettingsKVHelper] clearSettings() failed:`, err);
            return false;
        }
    }
}
