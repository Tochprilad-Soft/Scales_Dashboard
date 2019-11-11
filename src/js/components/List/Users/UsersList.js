import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter, BrowserRouter as Router, Route, Link} from "react-router-dom";
import cookie from "react-cookie";
import {isEqual, isEmpty, isArray, get} from 'lodash'

import * as userActions from "../../../actions-redux/user_actions.js";
import {Container, Table, Button, Col, Row, Collapse, Modal} from 'react-bootstrap'

class UsersList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            activeUser: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!isEqual(props.users.users.length, state.users)) {
            state.users = props.users.users;
        }

        return state;
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

    renderRow(content, number) {
        if (!isEmpty(content)) {
            let {scale} = content;
            return (
                <>
                    <tr key={content.id} onClick={this.onRowClick.bind(this, content.id)}>
                        <td>{number + 1}</td>
                        <td>{get(content, 'user.companyName')}</td>
                        <td>{get(content, 'user.companyAddress')}</td>
                        <td>{get(content, 'user.userName')}</td>
                        <td>{get(content, 'user.userPnone')}</td>
                        <td>{get(content, 'user.activationCode')}</td>
                        <td>{get(content, 'user.activated') ? 'Активирован' : 'Не активен'}</td>
                        <td><Button disabled={true}>Подробно</Button></td>
                        <td><Button disabled={true}>Редактировать</Button></td>
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
            </tr>
        )
    }

    render() {
        const {state} = this;
        const tableContent = state.users.length > 0 ? state.users.map((c, i) => this.renderRow(c, i)) : this.emptyRow();
        return (
            <>
                <Row>
                    <Col sm={9}>
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