import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter, BrowserRouter as Router, Route, Link} from "react-router-dom";
import cookie from "react-cookie";
import {isEqual, isEmpty, isArray, get} from 'lodash'

import * as userActions from "../../../actions-redux/user_actions.js";
import {Container, Table, Button, Col, Row, Form, Collapse, Modal, Dropdown, ButtonGroup} from 'react-bootstrap'

class ScalesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            activeUser: null,
            newScales: {
                scaleLocation: '',
                scaleName: '',
                serialNumber: '',
                description: ''
            },
            errors: {},
            showCreateModal: false
        }

        this.onSetShowModal = this.onSetShowModal.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (!isEqual(props.users.users.length, state.users)) {
            state.users = props.users.users;
        }

        return state;
    }

    onSelectUser(user) {
        this.setState({activeUser: user});
    }

    onSetShowModal(flag) {
        const state = this.state;
        if (!flag) {
            state.newScales = {};
        }
        state.showCreateModal = flag;
        this.setState(state);
    }

    onHandleChange(event) {
        const {newScales} = this.state;
        newScales[event.target.id] = event.target.value;
        this.setState({newScales: newScales});
    }


    renderTopSection() {
        const state = this.state;
        const placeholder = isEmpty(state.activeUser) ? 'Выберите пользователя' : get(state, 'activeUser.user.userName');
        return (
            <>
                <Row>
                    <Col sm={3}>
                        <h2>Пользователи:</h2>
                    </Col>
                    <Col sm={3}>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic-scales">
                                {placeholder}
                            </Dropdown.Toggle>

                            {
                                !(state.users.length > 0) ? (null) : (
                                    <Dropdown.Menu>
                                        {
                                            state.users.map((u, i) => (
                                                <Dropdown.Item key={u.id} eventKey={u.id}
                                                               onSelect={this.onSelectUser.bind(this, u)}>
                                                    {get(u, 'user.userName')}
                                                </Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                )
                            }
                        </Dropdown>
                    </Col>
                    <Col sm={6}>

                        <ButtonGroup>
                            <Button disabled={isEmpty(state.activeUser)} onClick={this.onSetShowModal.bind(this, true)}>Добавить весы</Button>
                            <Button disabled={true}>Редактировать весы</Button>
                            <Button disabled={true}>Удалить весы</Button>
                        </ButtonGroup>
                    </Col>

                </Row>
            </>
        )
    }

    renderContent(user) {
        return (
            <>
                {isEmpty(user) ? null : (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Идентификатор</th>
                            <th>Номер</th>
                            <th>Расположение</th>
                            <th>Описание</th>
                            <th>Последнее обновление</th>
                        </tr>
                        </thead>
                        <tbody>
                        {user.scale.map((s, i) => this.renderScale(s, i))}
                        </tbody>
                    </Table>
                )}
            </>
        )
    }

    renderScale(s, i) {
        return (
            <>
                {isEmpty(s) ? (null) : (
                    <tr key={get(s, 'id')}>
                        <td>{i + 1}</td>
                        <td>{get(s, 'id')}</td>
                        <td>{get(s, 'serialNumber')}</td>
                        <td>{get(s, 'scaleLocation')}</td>
                        <td>{get(s, 'description')}</td>
                        <td>{get(s, 'updatedAt')}</td>
                    </tr>
                )}
            </>
        )
    }

    render() {
        const state = this.state;
        const topPart = this.renderTopSection();
        const content = this.renderContent(state.activeUser);
        return (
            <>
                <Row>

                    <Col sm={9}>
                        <Modal
                            size="lg"
                            show={state.showCreateModal}
                            onHide={() => this.onSetShowModal(false)}
                            aria-labelledby="example-modal-sizes-title-lg"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Создание весов</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group as={Row} controlId="scaleLocation">
                                        <Form.Label sm={3} column={true}>Расположение</Form.Label>
                                        <Col sm={5}>
                                            <Form.Control type="text"
                                                          value={state.newScales.scaleLocation}
                                                          onChange={this.onHandleChange.bind(this)}
                                                          isInvalid={!!state.errors.scaleLocation}
                                                          placeholder="Расположение весов"
                                            />
                                            <Form.Control.Feedback
                                                type="invalid">{state.errors.scaleLocation || null}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="scaleName">
                                        <Form.Label sm={3} column={true}>Название</Form.Label>
                                        <Col sm={5}>
                                            <Form.Control type="text"
                                                          value={state.newScales.scaleName}
                                                          onChange={this.onHandleChange.bind(this)}
                                                          isInvalid={!!state.errors.scaleName}
                                                          placeholder="Название весов"
                                            />
                                            <Form.Control.Feedback
                                                type="invalid">{state.errors.scaleName || null}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="serialNumber">
                                        <Form.Label sm={3} column={true}>Серийный номер</Form.Label>
                                        <Col sm={5}>
                                            <Form.Control type="text"
                                                          value={state.newScales.serialNumber}
                                                          onChange={this.onHandleChange.bind(this)}
                                                          isInvalid={!!state.errors.serialNumber}
                                                          placeholder="Серийный номер"
                                            />
                                            <Form.Control.Feedback
                                                type="invalid">{state.errors.serialNumber || null}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="description">
                                        <Form.Label sm={3} column={true}>Описание</Form.Label>
                                        <Col sm={5}>
                                            <Form.Control type="text"
                                                          value={state.newScales.description}
                                                          onChange={this.onHandleChange.bind(this)}
                                                          isInvalid={!!state.errors.description}
                                                          placeholder="Описание весов"
                                            />
                                            <Form.Control.Feedback
                                                type="invalid">{state.errors.serialNumber || null}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.onSetShowModal.bind(this,false)}>Отмена</Button>
                                <Button variant="primary">Сохранить</Button>
                            </Modal.Footer>
                        </Modal>
                        <Container className="m-1 bg-light p-3">
                            {topPart}
                            {content}
                        </Container>
                    </Col>
                </Row>
            </>
        )
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScalesList));