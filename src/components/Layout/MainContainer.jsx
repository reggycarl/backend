import React, { Component } from 'react'
import { Col } from 'reactstrap'
export default class MainContainer extends Component {
    render() {

        return <Col>
            {this.props.children}
        </Col>
    }
}
