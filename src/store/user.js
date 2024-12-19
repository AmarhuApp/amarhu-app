export const state = () => ({
    user: {
        name: "",
        email: "",
        avatar: "",
    },
});

export const mutations = {
    setUser(state, payload) {
        state.user = payload;
    },
};

export const actions = {
    updateUser({ commit }, user) {
        commit("setUser", user);
    },
};
