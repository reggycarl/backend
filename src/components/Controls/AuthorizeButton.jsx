import React, { Component } from 'react'
import { Button, Col } from 'reactstrap'

export default class AuthorizeButton extends Component {
    render() {
        return (
            <Col md={1}>
                <Button color="success" >Authorize</Button>
            </Col>
        )
    }
}
