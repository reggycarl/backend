import React, { Component } from 'react'
import AuthLayout from '../Layout/AuthLayout'
import _ from 'lodash';
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignupForm from './SignupForm'


import {renderErrorsAsList, getPatnerTypes} from '../misc/functions'
class UserSignup extends Component {

    onChange = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }
    selected_country_id = "selected_country_id";
    state = {
        username: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        last_name: "",
        company_name: "",
        company_country_id: '', 
        phone: "",
        selected_company_country_id: ""
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            [selectedOption]: val.value,
            [`selected_${selectedOption}`]: val
        }
        this.setState({ ...state })
    }
    onPhoneChange = phone => {
        this.setState({
            ...this.state,
            phone: phone
        })
    }
    componentDidMount = () => {
        getPatnerTypes().then(response => {
            console.log("THIS IS THE DATA FOR COUNTRIES", response)
            this.setState({
                ...this.state,
                account_types: response
            })
        })
    }
    signup = (e) => {
        e.preventDefault();
        this.props.actions.signup(this.state.first_name, this.state.last_name, this.state.phone, this.state.email,
            this.state.password, this.state.password_confirmation, this.state.account_type_id);
    }
    render() {
        return (
            <AuthLayout>
                <div className='col-md-8 col-sm-8 authDiv'>
                    <div className='col-md-12 header'><h2> {!_.isEmpty(this.props.authentication.signupSuccessMessage) ? "Account Succesfully Created" :"Create a User Account"}</h2>
                        {!_.isEmpty(this.props.authentication.signupErrorMessage) ?
                            <div class="alert alert-danger " role="alert"> <p>The Following errors occured during signup</p> {renderErrorsAsList(this.props.authentication.signupErrorMessage)}</div> : ""}
                        {!_.isEmpty(this.props.authentication.signupSuccessMessage) ?
                            <div class="alert alert-success " role="alert"> <p>{this.props.authentication.signupSuccessMessage} </p> </div> : ""}
                     </div>
                        {!_.isEmpty(this.props.authentication.signupSuccessMessage) ?  "" : <SignupForm id='SignupBox' {...this.state} onChange={this.onChange} signup={this.signup} handleChangeSelect={this.handleChangeSelect} onPhoneChange= {this.onPhoneChange} account_types={this.state.account_types} /> }
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
)(UserSignup);
