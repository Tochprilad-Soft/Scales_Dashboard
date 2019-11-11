import axios from 'axios/index';
import _ from 'lodash';

import {
    GET_USERS_SUCCESS,
    GET_USERS_FAILED,
    PUT_USER_SUCCESS,
    PUT_USER_FAILED,
    POST_USER_SUCCESS,
    POST_USER_FAILED,
    POST_SCALE_SUCCESS,
    POST_SCALE_FAILED
} from '../constants/user_constants'
import {get} from 'lodash'

export function getUsersWithScales() {
    return (dispatch) => {
        return axios({
            method: 'get',
            url: `http://127.0.0.1:8008/user/all`
        }).then((response) => {
            dispatch({type: GET_USERS_SUCCESS, users: response.data});
        }).catch((err) => {
            let errorMessage = (err.response) ? err.response.data.message : err.message;
            return dispatch({type: GET_USERS_FAILED, errorMessage: errorMessage});
        })
    }
}

export function createUser(params) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: 'http://127.0.0.1:8008/user',
            data: params
        }).then((response) => {
            return  axios({
                method: 'get',
                url: `http://127.0.0.1:8008/user/all`
            });
        }).then((response) => {
            return dispatch({type: POST_USER_SUCCESS, users: response.data})
        }).catch((err) => {
            let errorMessage = (err.response) ? err.response.data.message : err.message;
            return dispatch({type: POST_USER_FAILED, errorMessage: errorMessage});
        })
    }
}

export function createScaleForUser(params) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: `http:127.0.0.1:8008/sca les`,
            data: params
        }).then((response) => {
            return axios({
                method: 'get',
                url: `http://127.0.0.1:8008/scales/all/${get(response, 'data.userId')}`
            })
        }).then((response) => {
            dispatch({type: POST_SCALE_SUCCESS, scale: response.data})
        }).catch((err) => {
            let errorMessage = (err.response) ? err.response.data.message : err.message;
            return dispatch({type: POST_SCALE_FAILED, errorMessage: errorMessage});
        })
    }
}



