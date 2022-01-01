import "./AuthLayout.scss"

import Logo from '../../assets/images/Steman-Commerce-Full-Logo-small.png'
import StoreFront from '../../assets/images/store-front-medium.jpg'
import {Col} from 'reactstrap'

import React, { Component } from 'react'
import { Link } from "react-router-dom"

export default class AuthLayout extends Component {
    render() {
        return (
            <div className='row  h-100'>
                <div className='col-md-12 loginHeader'>
                </div>
                <Link to ="/">
                <div id='floatingLogo'>
                    <img src={Logo} />
                </div>  
                </Link>
                <Col md={12}>
                    <div id='' className=" justify-content-center row ">
                        {this.props.children}
                    </div>
                </Col>
            </div>
        )
    }
}
