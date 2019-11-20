import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter, BrowserRouter as Router, Route, Link} from "react-router-dom";
import cookie from "react-cookie";
import {isEqual, isEmpty, isArray, get} from 'lodash'

import * as userActions from "../../../actions-redux/user_actions.js";
import {Container, Table, Button, Col, Row, Collapse, Modal} from 'react-bootstrap'
import {DEACTIVATE_ACTIVATION_CODE_SUCCESS, DEACTIVATE_ACTIVATION_CODE_FAILED} from '../../../constants/user_constants'

class UsersList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            activeUser: null,
            showDeactivateModal: false
        }

        this.onSetShowModal = this.onSetShowModal.bind(this);
        this.onDeactivateScale = this.onDeactivateScale.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        state.users = props.users.users;

        return state;
    }

    onSetShowModal(flag, user) {
        this.setState({showDeactivateModal: flag, activeUser: user});
    }

    onRowClick(userId) {
        const $this = this;
        let {state} = $this;

        if (isEmpty(state.activeUser) || !isEqual(userId, state.activeUser)) {
            $this.setState({activeUser: userId});
        } else {
            $this.setState({activeUser: null});
        }
    }

    onDeactivateScale() {
        const $this = this;
        const {state} = $this;
        if(!isEmpty(state.activeUser)) {
            return new Promise(resolve => resolve($this.props.userActions.deactivateCode(get(state, 'activeUser.activationCode'))))
                .then((data) => {
                    if (isEqual(get(data, 'type'), DEACTIVATE_ACTIVATION_CODE_SUCCESS)) {
                        $this.setState({activeUser: null, showDeactivateModal: false})
                    }
                })
        }
    }

    renderRow(content, number) {
        if (!isEmpty(content)) {
            let {scale} = content;
            return (
                <>
                    <tr key={content.id} onClick={this.onRowClick.bind(this, get(content, 'user'))}>
                        <td>{number + 1}</td>
                        <td>{get(content, 'user.companyName')}</td>
                        <td>{get(content, 'user.companyAddress')}</td>
                        <td>{get(content, 'user.userName')}</td>
                        <td>{get(content, 'user.userPnone')}</td>
                        <td>{get(content, 'user.activationCode')}</td>
                        <td>{get(content, 'user.activated') ? 'Активирован' : 'Не активен'}</td>
                        <td><Button disabled={true}>Редактировать</Button></td>
                        <td><Button disabled={!get(content, 'user.activated', false)}
                                    onClick={this.onSetShowModal.bind(this, true, get(content, 'user'))}>Деактивировать</Button>
                        </td>
                    </tr>
                    {
                        // !isEqual(this.state.activeUser, content.id) ? (null) : (this.renderScales(scale, content.id))
                    }
                </>
            )
        } else {
            return this.emptyRow();
        }
    }

    renderScales(scales, id) {
        if (isArray(scales)) {
            return (
                <>
                    {
                        !isArray(scales) ? (null) : (
                            <>
                                <tr key={101} variant="dark">
                                    <td></td>
                                    <td></td>
                                    <td>#</td>
                                    <td>Идентификатор</td>
                                    <td>Номер</td>
                                    <td>Расположение</td>
                                    <td>Описание</td>
                                    <td>Последнее обновление</td>
                                </tr>
                                {
                                    scales.map((s, i) => (
                                        <tr key={get(s, 'id')} variant="dark">
                                            <td></td>
                                            <td></td>
                                            <td>{i + 1}</td>
                                            <td>{get(s, 'id')}</td>
                                            <td>{get(s, 'serialNumber')}</td>
                                            <td>{get(s, 'scaleLocation')}</td>
                                            <td>{get(s, 'description')}</td>
                                            <td>{get(s, 'updatedAt')}</td>
                                        </tr>
                                    ))
                                }
                            </>
                        )
                    }
                </>
            )
        } else {
            return null;
        }
    }

    emptyRow() {
        return (
            <tr>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
            </tr>
        )
    }

    render() {
        const {state} = this;
        const tableContent = state.users.length > 0 ? state.users.map((c, i) => this.renderRow(c, i)) : this.emptyRow();
        return (
            <>
                <Row>
                    <Col sm={10}>
                        <Modal
                            size="lg"
                            show={state.showDeactivateModal}
                            onHide={() => this.onSetShowModal(false, null)}
                            aria-labelledby="example-modal-sizes-title-lg"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Деактивация кода</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Modal.Title>Вы уверены, что хотите деативировать код для
                                    пользователя {get(state, 'activeUser.userName')}</Modal.Title>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary"
                                        onClick={this.onSetShowModal.bind(this, false, null)}>Отмена</Button>
                                <Button variant="primary" onClick={this.onDeactivateScale}>Деактивировать</Button>
                            </Modal.Footer>
                        </Modal>
                        <Container className="m-1 bg-light p-3">
                            <h2>Список пользователей</h2>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Компания</th>
                                    <th>Адрес</th>
                                    <th>Ф.И.О.</th>
                                    <th>Телефон</th>
                                    <th>Код активации</th>
                                    <th>Состояние</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableContent}
                                </tbody>
                            </Table>
                        </Container>
                    </Col>
                </Row>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersList));