export const safeStorage = {
    set(key, value) {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(key, value);
        }
    },
    get(key) {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            return sessionStorage.getItem(key);
        }
        return null;
    },
    remove(key) {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(key);
        }
    },
    clear() {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
        }
    }
};
