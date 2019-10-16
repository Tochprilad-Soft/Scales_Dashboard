import axios from 'axios/index';
import _ from 'lodash';
import {
    POST_SESSION_SUCCESS, POST_SESSION_FAILED
} from '../constants/session_constants';

export function createSession(sessionData) {
    return(dispatch) => {
        if ((_.isEmpty(sessionData) || _.isEmpty(sessionData.email) || _.isEmpty(sessionData.password))) {
            return dispatch(
                {type: POST_SESSION_FAILED, errorMessage: 'Empty username or password'})
        }

        return axios({
            method: 'post',
            url: `/sessions`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: sessionData
        }).then(response => {
            return dispatch({type: POST_SESSION_SUCCESS, sessionData: response.data})
        }).catch((err) => {
            let errorMessage = (err.response)
                ? err.response.data.message
                : err.message;

            if (!errorMessage || errorMessage.includes('internal server error')) {
                errorMessage = 'Something went wrong. Please, try one more time';
            }

            return dispatch({type: POST_SESSION_FAILED, errorMessage: errorMessage})
        })
    }
}