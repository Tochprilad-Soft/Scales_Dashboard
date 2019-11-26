import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Nav, Row, Col, Image, ProgressBar, OverlayTrigger, Tooltip, Spinner} from 'react-bootstrap';
import {isEqual, get, isEmpty} from "lodash";
import {useCookies} from 'react-cookie';

import logo from '../../../style/img/ic_launcher.png'
import * as sessionActions from "../../actions-redux/session_actions";
import * as userActions from "../../actions-redux/user_actions";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentLocation: '/',
            logOut: false
        };

        this.onLogOut = this.onLogOut.bind(this);
        this.renderNavigationSection = this.renderNavigationSection.bind(this);
    }

    onLogOut() {
        cookie.remove('userId');
        this.setState({logOut: true});
    }

    renderNavigationSection() {
        const {props} = this;
        const {edited, callback} = props;

        if (isEqual(props.location.pathname, '/')) {
            return (
                <Nav>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    </Nav.Item>
                    
                    <Nav.Item>
                        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1" onClick={this.onLogOut}>Log out</Nav.Link>
                    </Nav.Item>
                </Nav>
            )
        } else {
            return (
                <Nav>
                    <Nav.Item>
                        <Nav.Link disabled={!edited} onClick={callback}>Save changes</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/">Account</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1" onClick={this.onLogOut}>Log out</Nav.Link>
                    </Nav.Item>
                </Nav>
            )
        }
    }

    render() {
        const {state} = this;
        const {props} = this;

        if(state.logOut) {
            return <Redirect to='/login'/>
        }

        const navigationSection = null;//this.renderNavigationSection();

        return (
            <Row className="navbar navbar-light bg-light">
                <Col md={{span: 2}}>
                    <Image src={logo}/>
                </Col>
                <Col md={{span: 3}}>
                    {navigationSection}
                </Col>
            </Row>
        )
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));