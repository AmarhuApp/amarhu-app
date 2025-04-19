let authReady = false;
let resolveAuth;
const authPromise = new Promise((resolve) => {
    resolveAuth = resolve;
});

export function markAuthReady() {
    authReady = true;
    resolveAuth(); // 🔓 Desbloquea el await de waitForAuth()
}

export function resetAuthReady() {
    authReady = false;
    // No reseteamos el Promise para evitar errores, solo se marca como no listo
}

export function waitForAuth() {
    return authReady ? Promise.resolve() : authPromise;
}

export function isAuthReady() {
    return authReady;
}
