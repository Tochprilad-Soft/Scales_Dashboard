import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter, BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import {isEmpty, isEqual, isObject, head, get} from 'lodash';
import {isUUID} from 'validator'
import cookie from "react-cookie";
import uuidv4 from 'uuid/v4'

import {Container, Table, Button, Col, Row, Form, Collapse, Modal, Dropdown, ButtonGroup} from 'react-bootstrap'

import * as userActions from "../../../actions-redux/user_actions.js";
import {POST_USER_SUCCESS, POST_USER_FAILED} from '../../../constants/user_constants'


class ManageUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            companyName: '',
            companyAddress: '',
            userName: '',
            userPhone: '',
            email: '',
            activationCode: '',
            showSuccess: false
        };

        this.onHandleChange = this.onHandleChange.bind(this);
        this.onCreateUser = this.onCreateUser.bind(this);
    }

    onHandleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    onCreateUser() {
        let errors = {}, isValid = true;
        const $this = this;
        const {state} = $this;
        const emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (isEmpty(state.companyName)) {
            errors.companyName = 'Укажите название компании';
        }
        if (isEmpty(state.companyAddress)) {
            errors.companyAddress = 'Укажите адресс компании';
        }
        if (isEmpty(state.userName)) {
            errors.userName = 'Укажите Ф.И.О. пользователя';
        }
        if (isEmpty(state.userPhone)) {
            errors.userPhone = 'Укажите телефонный номер пользователя';
        }
        if (isEmpty(state.email)) {
            errors.email = 'Укажите адрес электронной почты';
        } else if (!emailRegexp.test(state.email)) {
            errors.email = `Эл. почта: ${state.email} имеет не верный формат`
        }

        for (let error in errors) {
            if (isEmpty(errors[error])) {
                delete errors[error];
            } else {
                isValid = false;
            }
        }

        state.errors = errors;
        if (!isValid) {
            $this.setState(state);
        } else {
            const userInfo = {
                companyName: state.companyName,
                companyAddress: state.companyAddress,
                userName: state.userName,
                userPhone: state.userPhone,
                email: state.email,
                phoneId: uuidv4()
            };

            return new Promise(resolve => resolve($this.props.userActions.createUser(userInfo)))
                .then((data) => {
                    if (data && isEqual(data.type, POST_USER_SUCCESS)) {
                        $this.setState({
                            companyName: '',
                            companyAddress: '',
                            userName: '',
                            userPhone: '',
                            email: '',
                            errors: {},
                            showSuccess: true
                        });
                    } else {
                        $this.setState({errors: data.errors});
                    }
                });
        }
    }

    onSetShowModal(flag) {
        const state = this.state;
        state.showSuccess = flag;
        this.setState(state);
    }

    render() {
        const state = this.state;

        return (
            <>
                <Container className="m-1 bg-light p-3">
                    <Modal
                        size="lg"
                        show={state.showSuccess}
                        onHide={() => this.onSetShowModal(false)}
                        aria-labelledby="example-modal-sizes-title-lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Создание пользователя</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Modal.Title>Пользователь успешно создан</Modal.Title>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.onSetShowModal.bind(this,false)}>Ок</Button>
                        </Modal.Footer>
                    </Modal>
                    <Form>
                        <Form.Row>
                            <Form.Label>Создание пользователя</Form.Label>
                        </Form.Row>
                        <Form.Group as={Row} controlId="companyName">
                            <Form.Label sm={2} column={true}>Название компании</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="text"
                                              value={state.companyName}
                                              onChange={this.onHandleChange.bind(this)}
                                              isInvalid={!!state.errors.companyName}
                                              placeholder="Укажите название компании"/>
                                <Form.Control.Feedback
                                    type="invalid">{state.errors.companyName || null}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="companyAddress">
                            <Form.Label sm={2} column={true}>Адрес компании</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="text"
                                              value={state.companyAddress}
                                              onChange={this.onHandleChange.bind(this)}
                                              isInvalid={!!state.errors.companyAddress}
                                              placeholder="Укажите адрес компании"/>
                                <Form.Control.Feedback
                                    type="invalid">{state.errors.companyAddress || null}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="userName">
                            <Form.Label sm={2} column={true}>Имя пользователя</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="text"
                                              value={state.userName}
                                              onChange={this.onHandleChange.bind(this)}
                                              isInvalid={!!state.errors.userName}
                                              placeholder="Укажите Ф.И.О. пользователя"/>
                                <Form.Control.Feedback
                                    type="invalid">{state.errors.userName || null}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="userPhone">
                            <Form.Label sm={2} column={true}>Телефонный номер</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="text"
                                              value={state.userPhone}
                                              onChange={this.onHandleChange.bind(this)}
                                              isInvalid={!!state.errors.userPhone}
                                              placeholder="Укажите номер телефонна"/>
                                <Form.Control.Feedback
                                    type="invalid">{state.errors.userPhone || null}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="email">
                            <Form.Label sm={2} column={true}>Электронная почта</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="text"
                                              value={state.email}
                                              onChange={this.onHandleChange.bind(this)}
                                              isInvalid={!!state.errors.email}
                                              placeholder="Укажите электронную почту"/>
                                <Form.Control.Feedback
                                    type="invalid">{state.errors.email || null}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Button variant="primary"
                                onClick={this.onCreateUser}
                        >
                            Создать пользователя
                        </Button>
                    </Form>
                </Container>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.user
    };
}


function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageUser));