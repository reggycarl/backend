import React, { Component } from 'react'
import {Col} from 'reactstrap';
import './index.scss';
export default class index extends Component {
    render() {
        return (
            <Col className="loaderWrapper">
                Loading...
            </Col>
        )
    }
}
