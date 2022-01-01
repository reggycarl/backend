import React, { Component } from 'react'
import "./MainLogin.scss"


import { LOGIN } from '../../actions'
import axios from 'axios';
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import qs from 'query-string'
import PartnerLogin from '../Login/PartnerLogin'
import UserLogin from '../Login/UserLogin'

import AuthLayout from '../Layout/AuthLayout'

import { Col, Button, Row } from 'reactstrap';
import { Link } from 'react-router-dom';



class Login extends Component {

    state = {
        email: "",
        password: "",
        
    }
    componentDidMount = () => {
        console.log("THESE ARE THE PROPS", this.props)
        const params = new URLSearchParams(window.location.search)
        var show_confirmed = false;
        if (params.has('account_confirmation_success')){
           show_confirmed =  params.get("account_confirmation_success") == "true" ? true : false;
        }

        this.setState({
            ...this.state, 
            show_confirmed: show_confirmed
        })
    }

    onChange = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }
    login = e => {
        e.preventDefault();
        console.log("LOGGINSING");
        this.props.actions.login(this.state.email, this.state.password);
    }


    render() {
        console.log("VAL OF LOCATION", this.props.location.pathname)
        if(this.props.location.pathname == "/partners/"){
            return <PartnerLogin />
        }
        else if (this.props.location.pathname == "/users/"){
            return <UserLogin />
        }
        else{
            return this.renderMainLogin();
        }
        
    }

    renderMainLogin(){
        return <AuthLayout>
        <div className='row'>
        
         <div className='col-md-12 header'><h2 className='centered'>Welcome to <br />Steaman Express</h2>
                {!_.isEmpty(this.props.authentication.loginErrorMessage) ?
                    <div class="alert alert-danger " role="alert">{this.props.authentication.loginErrorMessage} </div> : ""}</div>
                </div>  
        <Col md={12}>
            <Row className='justify-content-center '>
                <Col md={6}>
                <Row >
                <Col md={5}>
                    <Link to='/users/' className='btn btn-primary btn-lg form-control login-btn'> Login as a User </Link>
                </Col>
                <Col md={2}>

                </Col>
                <Col md={5}>
                    <Link to='/partners/' className='btn btn-primary  btn-lg form-control login-btn'> Login as a Partner </Link>
                </Col>
                </Row>
                </Col>
            </Row>
        </Col>
    </AuthLayout>
    }

    showConfirmed () {
        return <div className='row'>
            <div className='col-md-12 header'>
                <h2>Account Successfully Confirmed</h2>
            </div>
            <Col md={12}>
                <p>
                    Click on the button below to login to your account
                </p>
                {/* <Button color='success'>Login</Button> */}
                <Link to='/' className='btn btn-success' onClick={() => {
                    window.location.replace(window.location.protocol + '//' + window.location.host 
                    )
                }}>Login</Link>
                
            </Col>
            
        </div>
    }
}
const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

