import React, { Component } from 'react'
import AuthLayout from '../Layout/AuthLayout'
import axios_original from 'axios';
import _ from 'lodash'
import ForgotPasswordForm from '../ForgotPassword/ForgotPasswordForm'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toast } from 'react-toastify'

import {baseurl} from "../misc/Axios"

class ConfirmEmail extends Component {

    
    state = {
        email: "",
        errors: [],
        message: "",
        confirming: false
    }
    confirmEmailAddress = (e) => {
        console.log("CONFIRMING EMAIL")
        e.preventDefault();
        this.setState({
            ...this.state,
            confirming: true
        })
        axios_original.post(baseurl +'/partners/confirmation', { email: this.state.email }).then(response => {
            if (response.status == 200){
                toast.success(response.data.message)
                this.setState({
                    ...this.state,
                    email: '',
                    message: response.data.message,
                    confirming: false
                })
            }
            
            
        }).catch((error, errordata) =>{
            
            // toast.error("Confirmation Resend Failed")
            console.log("THIS IS THE CODE:", error.response.code)
            this.setState({...this.state,
                confirming: false,
            errors: error.response.data.errors})
            
        })
    }
    componentDidMount = () => {
        console.log("THIS IS BASEURL ", baseurl)
    }
    onChange = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
            errors: []
        })
    }

    render() {
        return (
            <AuthLayout>
                <div className='row'>
                    <div className='col-md-12 header'><h2>Confirm Email</h2>
                        {!_.isEmpty(this.state.errors) ?
                            <div class="alert alert-danger " role="alert">{this.state.errors} </div> : ""}
                        {!_.isEmpty(this.state.message) ?
                            <div class="alert alert-success " role="alert">{this.state.message} </div> : ""}</div>
                    <ForgotPasswordForm id='ForgotPasswordBox' confirm={true} {...this.state} confirming ={this.state.confirming} onChange={this.onChange} confirmEmail={this.confirmEmailAddress} />
                </div>
            </AuthLayout>
        )
    }
}

const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfirmEmail);
