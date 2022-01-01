import React, { Component } from 'react'
import {Col} from 'reactstrap'
import './NoDataYet.scss'

export default class NoDataYet extends Component {
    render() {
        return (
            <Col className='ndy-container'>
            <p><b>No Data Yet</b></p>
            </Col>
        )
    }
}
