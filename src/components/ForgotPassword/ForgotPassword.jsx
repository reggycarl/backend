import React, { Component } from 'react'
import AuthLayout from '../Layout/AuthLayout'
import _ from 'lodash';
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {baseurl} from '../misc/Axios'
import axios_original from 'axios'
import {toast } from 'react-toastify'
import {Col} from 'reactstrap'
import ForgotPasswordForm from './ForgotPasswordForm'
import { renderErrorsAsList } from '../misc/functions';
class ForgotPassword extends Component {
    state = {
        email: "",
        errors: [],
        message: "",
        confirming: false,
        password_changed: false,
        not_found: false
    }
    resetPassword = (e) => {
        
        e.preventDefault();
        this.setState({
            ...this.state,
            resetting: true
        })
        axios_original.post(baseurl +'/partners/password', { email: this.state.email, redirect_url: "/" }).then(response => {
            if (response.status == 200){
                toast.success(response.data.message)
                this.setState({
                    ...this.state,
                    email: '',
                    message: response.data.message,
                    resetting: false,
                    password_changed: true
                })
            }
               
        }).catch((error) =>{

            toast.error("Confirmation Resend Failed")
            this.setState({...this.state,
            resetting: false,
            errors: error.response.data.errors,
            })

            
        })
    }
    
    onChange = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
            errors: [],
            
        })
    }
    render() {
        return (
            <AuthLayout>
                <div className='row'>
                    <div className='col-md-12 header'><h2>Reset Password</h2>
                    {!_.isEmpty(this.state.errors) ?
                            <div class="alert alert-danger " role="alert">{ renderErrorsAsList( this.state.errors)} </div> : ""}
                        {!_.isEmpty(this.state.message) ?
                            <div class="alert alert-success " role="alert"><Col><p>{this.state.message}</p></Col> </div> : ""}
                            </div>
                    {this.state.password_changed ? <div> {this.state.message} </div> : <ForgotPasswordForm id='ForgotPasswordBox' {...this.state} onChange={this.onChange} reset={this.reset} resetPassword={this.resetPassword} resetting={this.state.resetting} /> }
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
)(ForgotPassword);
