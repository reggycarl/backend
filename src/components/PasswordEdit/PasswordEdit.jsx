import React, { Component } from 'react'

import PasswordEditForm from './PasswordEditForm'

import {toast } from 'react-toastify'
import axios_original from 'axios'
import {baseurl} from '../misc/Axios'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import qs from 'query-string'

import AuthLayout from '../Layout/AuthLayout'

import { Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { renderErrorsAsList } from '../misc/functions';


class PasswordEdit extends Component {

    state = {
        password: "",
        password_confirmation: "",
        current_password: "",
        not_found: false,
        password_changed: false
      
    }
    componentDidMount = () => {
        const params = new URLSearchParams(window.location.search)
        var show_confirmed = false;
        var reset_password_token = null;
        if (params.has('reset_password_token')){
           reset_password_token  =  params.get("reset_password_token") 
        }

        this.setState({
            ...this.state, 
            reset_password_token: reset_password_token
        })

        // axios_original.get(baseurl +"/partners/validate_token?auth_token="+reset_password_token+"&redirect_url=/sdfsdfs").then(response => {
        // console.log("THIS IS RESPONSE AFTER MOUNT", response)
        // })
    }

    onChange = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
            not_found: false
        })
    }
    componentWillMount = () => {
        // axios_original.get(baseurl + "/auth/validate_token?auth_token=" +this.state.auth_token)
    }

    password_edit = e => {
        e.preventDefault();
        this.setState({
            ...this.state,
            loading: true
        })
        axios_original.put(baseurl+'/partners/password', { password: this.state.password, password_confirmation: this.state.password_confirmation, reset_password_token: this.state.reset_password_token, client_reset_password_token: this.state.reset_password_token}).then(response => { //token: this.state.reset_password_token
            if (response.status == 200){
                toast.success(response.data.message)
                this.setState({
                    ...this.state,
                    email: '',
                    message: response.data.message,
                    loading: false,
                    password_changed: true
                })
            }
               
        }).catch((error) =>{
            var not_found = false;
            console.log(error)
            console.log("RESPONSE CODE", error.response.data.errors)
            if (error.response.status == 401){
                not_found = true
            }
            toast.error(<ul>{renderErrorsAsList(error.response.data.errors.full_messages)}</ul>)
            this.setState({...this.state,
            resetting: false,
            loading: false,
            not_found: not_found},
            )
        })
        
        // this.props.actions.password_edit(this.state.email, this.state.password);
    }


    render() {
        return (
            <AuthLayout>
                {this.state.show_confirmed ? this.showConfirmed()  :<div className='row'>
                
                 <div className='col-md-12 header'><h2>Change Password </h2>
                        {!_.isEmpty(this.state.errors) ?
                            <div className="alert alert-danger " role="alert">{this.state.errors} </div> : ""}
                            {this.state.not_found  ? <div class="alert alert-danger " role="alert">Requested Path Not Found</div>  : "" }
                            
                            {this.state.password_changed ? <div className="alert alert-success">Password Successfully Changed. Click on the Button Below to login</div> : "" }
                            </div>
                    
                            {this.state.password_changed ? <Col><Link to='/' className="btn btn-success">Login</Link>  </Col>:<PasswordEditForm id='password_editBox' {...this.state} loading={this.state.loading} onChange={this.onChange} password_edit={this.password_edit} /> }
                        
                
                                    
                        </div>   }
            </AuthLayout>
        )
    }

    showConfirmed () {
        return <div className='row'>
            <div className='col-md-12 header'>
                <h2>Account Successfully Confirmed</h2>
            </div>
            <Col md={12}>
                <p>
                    Click on the button below to password_edit to your account
                </p>
                {/* <Button color='success'>PasswordEdit</Button> */}
                <Link to='/' className='btn btn-success' onClick={() => {
                    window.location.replace(window.location.protocol + '//' + window.location.host 
                    )
                }}>PasswordEdit</Link>
                
            </Col>
            
        </div>
    }
}
const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordEdit);

