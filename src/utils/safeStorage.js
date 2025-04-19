export const safeSession = {
    get(key) {
        if (typeof window !== "undefined" && window.sessionStorage) {
            return sessionStorage.getItem(key);
        }
        return null;
    },
    set(key, value) {
        if (typeof window !== "undefined" && window.sessionStorage) {
            sessionStorage.setItem(key, value);
        }
    },
    remove(key) {
        if (typeof window !== "undefined" && window.sessionStorage) {
            sessionStorage.removeItem(key);
        }
    },
    clear() {
        if (typeof window !== "undefined" && window.sessionStorage) {
            sessionStorage.clear();
        }
    }
};
