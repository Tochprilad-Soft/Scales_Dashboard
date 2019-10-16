import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import babelPolyfill from "babel-polyfill";

import axios from 'axios';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import configureStore from './store/configureStore';

const store = configureStore();

import Login from './components/Login/Login'
import MainContainer from './components/MainContainer/MainContainer'
import cookie from "react-cookie";
import {CookiesProvider, useCookies} from 'react-cookie';
import {isEmpty} from "lodash";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CookiesProvider>
                <Provider store={store}>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={MainContainer}/>
                            <Route path="/login" component={Login}/>
                        </Switch>
                    </BrowserRouter>
                </Provider>
            </CookiesProvider>
        );
    }
}

export {App};