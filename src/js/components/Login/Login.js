import React, {Component} from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Button, Form, FormGroup, FormControl, ControlLabel, Container, Row} from "react-bootstrap";
import {isEmail} from 'validator';
import {isEmpty, isEqual} from 'lodash'

import * as sessionActions from "../../actions-redux/session_actions";

class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: {
                email: null,
                password: null
            },
            redirect: false,
            signUpRedirect: false,
            isValid: false
        };

        this.validateForm = this.validateForm.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    validateForm() {
        let errors = {
            email: null,
            password: null
        }, isValid = true;

        if (isEmpty(this.state.email)) {
            errors.email = 'Email is required';
        }
        if (!isEmail(this.state.email)) {
            errors.email = 'Wrong email format';
        }

        if (isEmpty(this.state.password)) {
            errors.password = 'Password if required'
        }

        for (let error in errors) {
            if (isEmpty(errors[error])) {
                delete errors[error];
            } else {
                isValid = false;
            }
        }

        if (!isValid) {
            this.setState({errors: errors, isValid: isValid, redirect: isValid});
        } else {
            // this.onLogin()
        }
    }

    render() {
        const state = this.state;

        return (
            <div className="container-fluid h-100">
                <Row className="m-1">
                    <Container className="p-5">
                        <Form>
                            <FormGroup controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={state.email}
                                    onChange={this.handleChange.bind(this)}
                                    isInvalid={!!state.errors.email}
                                />
                                <Form.Control.Feedback
                                    type="invalid">{state.errors.email || null}</Form.Control.Feedback>
                            </FormGroup>
                            <FormGroup controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    value={state.password}
                                    onChange={this.handleChange.bind(this)}
                                    type="password"
                                    isInvalid={!!state.errors.password}
                                />
                                <Form.Control.Feedback
                                    type="invalid">{state.errors.password || null}</Form.Control.Feedback>
                                <Button variant="link" onClick={this.redirectToRegistration}> Don't have account?</Button>
                            </FormGroup>

                            <Button
                                onClick={this.validateForm}
                            >
                                Login
                            </Button>
                        </Form>
                    </Container>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        session: state.sessionInfo
    };
}


function mapDispatchToProps(dispatch) {
    return {
        sessionActions: bindActionCreators(sessionActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));