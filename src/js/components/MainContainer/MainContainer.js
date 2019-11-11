import React, {Component} from 'react';
import {withRouter, Redirect, BrowserRouter as Router, Route, Link} from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Accordion, Card, Button, Row, Col, Container} from 'react-bootstrap'
import {get, head, isEmpty, isEqual} from "lodash";
import {useCookies} from 'react-cookie';

import * as sessionActions from '../../actions-redux/session_actions';
import * as userActions from '../../actions-redux/user_actions';

import Login from '../Login/Login'
import Header from '../Header/Header'
import UsersList from '../List/Users/UsersList'
import ScalesList from '../List/Scales/ScalesList'
import ManageUser from '../Manage/User/ManageUser'

import {COMPONENT_ALIASES} from '../../constants/components'

const components = {...COMPONENT_ALIASES};


class MainContainer extends Component {
    constructor(props) {
        super(props);
        const userIdData = useCookies["userId"];

        this.state = {
            userId: (!userIdData || userIdData === 'undefined') ? null : userIdData,
            current_component: null,
            users: []
            // not
        };

        this.onCardClick = this.onCardClick.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (isEqual(props.users.users.length, 0)) {
            return new Promise(resolve => resolve(props.userActions.getUsersWithScales()))
                .then((response) => {
                    return state;
                });
        } else {
            return state;
        }
    }

    onCardClick(component_name) {
        this.setState({current_component: component_name});
    }

    renderContent(component_name) {
        switch (component_name) {
            case components.USERS_MANAGEMENT:
                return (<ManageUser/>);
            case components.USERS_LIST:
                return (<UsersList/>);
            case components.SCALES_LIST:
                return (<ScalesList/>);
            case components.LOGIN:
                return (<Login/>);
            default:
                return components.USERS_LIST;
        }
    }

    renderAccordion() {
        return (
            <Accordion className="bg-light h-100">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            Пользователи
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <Button onClick={this.onCardClick.bind(this, components.USERS_LIST)}
                                    className="btn btn-block"
                            >
                                Список пользователей</Button>
                        </Card.Body>
                    </Accordion.Collapse>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <Button onClick={this.onCardClick.bind(this, components.USERS_MANAGEMENT)}
                                    className="btn btn-block"
                            >
                                Создать пользователя</Button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            Весы
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <Button onClick={this.onCardClick.bind(this, components.SCALES_LIST)}
                                    className="btn btn-block"
                            >
                                Список весов
                            </Button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }

    render() {
        const state = this.state;
        // if (isEmpty(state.userId)) {
        //     return (<Redirect to="/login"/>);
        // }

        const AccordionPart = this.renderAccordion();
        const Content = this.renderContent(state.current_component);

        return (
            <div className="container-fluid h-100">
                <Header/>
                <Row className="m-1">
                    <Col md={{span: 2}}>
                        {AccordionPart}
                    </Col>
                    <Col>
                        {Content}
                    </Col>
                </Row>
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