import {GET_USERS_SUCCESS, GET_USERS_FAILED, PUT_USER_SUCCESS, PUT_USER_FAILED} from '../constants/user_constants';

const initialState = {
    users: []
};

export default function user(state = initialState, action) {
    
    switch (action.type) {
        case GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.users
            }
        case GET_USERS_FAILED:
            return {
                ...state
            }
        default:
            return state
    }
}