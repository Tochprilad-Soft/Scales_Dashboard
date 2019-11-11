import {
    GET_USERS_SUCCESS,
    GET_USERS_FAILED,
    PUT_USER_SUCCESS,
    PUT_USER_FAILED,
    POST_USER_SUCCESS,
    POST_USER_FAILED,
    POST_SCALE_SUCCESS,
    POST_SCALE_FAILED
} from '../constants/user_constants';

const initialState = {
    users: [],
    errors: {},
    errorMessage: null
};

export default function user(state = initialState, action) {

    switch (action.type) {
        case GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.users,
                errorMessage: null
            };
        case GET_USERS_FAILED:
            return {
                ...state,
                errorMessage: action.errorMessage
            };
        case POST_USER_SUCCESS:
            return {
                ...state,
                users: action.users,
                errorMessage: null
            };
        case POST_USER_FAILED:
            return {
                ...state,
                errorMessage: action.errorMessage
            };
        case POST_SCALE_SUCCESS:
            return {
                ...state,
                user: action.users,
                errorMessage: null
            };
        default:
            return state
    }
}