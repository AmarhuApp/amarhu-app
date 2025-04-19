// src/utils/safeSession.js
export const safeSession = {
    get(key) {
        if (typeof window !== "undefined" && window.sessionStorage) {
            try {
                return window.sessionStorage.getItem(key);
            } catch (e) {
                console.warn("❌ No se pudo acceder a sessionStorage:", e);
                return null;
            }
        }
        return null;
    },

    set(key, value) {
        if (typeof window !== "undefined" && window.sessionStorage) {
            try {
                window.sessionStorage.setItem(key, value);
            } catch (e) {
                console.warn("❌ No se pudo escribir en sessionStorage:", e);
            }
        }
    },

    remove(key) {
        if (typeof window !== "undefined" && window.sessionStorage) {
            try {
                window.sessionStorage.removeItem(key);
            } catch (e) {
                console.warn("❌ No se pudo eliminar de sessionStorage:", e);
            }
        }
    },

    clear() {
        if (typeof window !== "undefined" && window.sessionStorage) {
            try {
                window.sessionStorage.clear();
            } catch (e) {
                console.warn("❌ No se pudo limpiar sessionStorage:", e);
            }
        }
    },
};
