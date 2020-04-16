import { combineReducers } from 'redux';

import * as types from '../actions/types';
import { actions } from '../actions/actions';

/*
function visibilityFilter(state = '', action) {
    switch (action.type) {
        case types.SET_FILTER:
            return action.value;
        default:
            return state;
    }
}

function movies(state = [], action) {
    switch (action.type) {
        case types.SET_MOVIES: {
            return action.value;
        }
        default: {
            return state;
        }
    }
}

const moviesApp = combineReducers({
    visibilityFilter,
    movies
  });

export default moviesApp;
*/

const initialState = {
    movies: [],
    user: {
        Username: '',
        Password: '',
        Email: '',
        Birthday: ''
    },
    username: '',
    token: '',
    filter: ''
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_MOVIES: {
            return {
                ...state,
                movies: action.value
            };
        }
        case types.SET_USER: {
            return {
                ...state,
                user: action.value
            };
        }
        case types.SET_USERNAME: {
            return {
                ...state,
                username: action.value
            }
        }
        case types.SET_TOKEN: {
            return {
                ...state,
                token: action.value
            }
        }
        case types.SET_FILTER: {
            return {
                ...state,
                filter: action.value
            }
        }
        default: {
            return state;
        }
    }
}
