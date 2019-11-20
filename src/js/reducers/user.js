import {
    GET_USERS_SUCCESS,
    GET_USERS_FAILED,
    PUT_USER_SUCCESS,
    PUT_USER_FAILED,
    POST_USER_SUCCESS,
    POST_USER_FAILED,
    POST_SCALE_SUCCESS,
    POST_SCALE_FAILED,
    DEACTIVATE_ACTIVATION_CODE_SUCCESS,
    DEACTIVATE_ACTIVATION_CODE_FAILED
} from '../constants/user_constants';
import {isEqual, isArray, get, head, set} from 'lodash'

const initialState = {
    users: [],
    errors: {},
    errorMessage: null
};

export default function user(state = initialState, action) {
    let {users} = state;
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
            const userId = get(action.scale, 'userId');
            users = users.map((u, i) => {
                if (isEqual(u.id, userId)) {
                    if (isArray(u.scale)) {
                        u.scale.push(action.scale)
                    } else {
                        u.scale = [action.scale]
                    }
                }
                return u;
            });

            return {
                ...state,
                user: users,
                errorMessage: null
            };
        case DEACTIVATE_ACTIVATION_CODE_SUCCESS:
            users = users.map((u, i) => {
                if (isEqual(u.id, get(action, 'user.id'))) {
                    set(u, 'user', get(action, 'user'));
                }
                return  u;
            });
            return {
                ...state,
                user: users,
                errorMessage: null
            }
        default:
            return state
    }
}