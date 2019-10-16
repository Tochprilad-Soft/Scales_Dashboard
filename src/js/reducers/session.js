import {POST_SESSION_SUCCESS, POST_SESSION_FAILED} from '../constants/session_constants'

const initialState = {
    sessionInfo: null
};

export default function session(state = initialState, action) {
    switch (action.type) {
        case POST_SESSION_SUCCESS:
            return {
                ...state,
                sessionInfo: action.token
            }
        case POST_SESSION_FAILED:
            return {
                ...state,
                sessionInfo: {}
            }
        default:
            return state
    }
}