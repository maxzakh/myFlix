import * as types from './types';

function setMovies(value) {
    return {
        type: types.SET_MOVIES,
        value
    };
}

function setUser(value) {
    return {
        type: types.SET_USER,
        value
    };
}

function setUsername(value) {
    return {
        type: types.SET_USERNAME,
        value
    };
}

function setToken(value) {
    return {
        type: types.SET_TOKEN,
        value
    };
}

function setFilter(value) {
    return {
        type: types.SET_FILTER,
        value
    };
}

export const actions = {
    setMovies,
    setUser,
    setUsername,
    setToken,
    setFilter
};
