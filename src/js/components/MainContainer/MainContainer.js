import React, {Component} from 'react';
import {withRouter, Redirect, BrowserRouter as Router, Route, Link} from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Accordion, Card, Button, Row, Col, Container} from 'react-bootstrap'
import {get, head, isEmpty, isEqual} from "lodash";
import {useCookies} from 'react-cookie';

import * as sessionActions from '../../actions-redux/session_actions';
import * as userActions    from '../../actions-redux/user_actions';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        const userIdData = useCookies["userId"];

        this.state = {
            userId: (!userIdData || userIdData === 'undefined') ? null : userIdData,
            current_component: null
            // not
        };

    }

    render() {
        const state = this.state;
        if (isEmpty(state.userId)) {
            return (<Redirect to="/login"/>);
        }

        return (
            <div className="container-fluid h-100">
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sessions: state.sessions,
        users: state.user
    };
}


function mapDispatchToProps(dispatch) {
    return {
        sessionActions: bindActionCreators(sessionActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContainer));