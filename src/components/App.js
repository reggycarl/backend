import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.scss';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from './Login/AdminLogin'
import PartnerLogin from './Login/PartnerLogin'
import UserLogin from './Login/UserLogin'
import MainLogin from'./MainLogin/MainLogin'

import ConfirmingSpinner from '../components/ConfirmingSpinner/ConfirmingSpinner'
import axios from '../components/misc/Axios'
import confidentSfx from '../sfx/confident.mp3'
// import Signup from '../components/Signup'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import * as actions from '.././actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Layout from '../components/Layout/Layout'
import UserSignup from './Signup/UserSignup';
import ForgotPassword from './ForgotPassword/ForgotPassword'
import ConfirmEmail from './ConfirmEmail/ConfirmEmail';
import PasswordEdit from './PasswordEdit/PasswordEdit'
import PartnerSignup from './Signup/PartnerSignup';
import { ActionCableConsumer } from 'react-actioncable-provider';
class App extends Component {
  
  state = {
    confirmingLoggedIn: false
  }
  componentDidMount = () => {

    if (this.isLoggedIn == false) {
      axios.get("/").then(response => {
        console.log(response)
      }).catch(errors => {
        console.log(errors)
      })
    }
    else {
      this.setState({
        ...this.state,
        confirmingLoggedIn: false,
      })
    }
  }
  notification_received = (msg) => {
    var audio = new Audio(confidentSfx);
    audio.play();
    console.log("SOMETHING RECEIVED", msg)
    toast.success(<p>{msg.msg} <br />
    <a href={msg.link} className='btn btn-xs btn-primary form-control'>View</a></p>, {autoClose: false})
  }
  getLayoutOrRedirect = () => {
    console.log(this.props.authentication)
    return <>
    {this.props.authentication.default_path == "/admins/" ? <ActionCableConsumer
            channel={{ channel: 'AdminNotificationsChannel', id: this.props.authentication.user.uuid }}
            onReceived={this.notification_received}
            onConnected={()=>{
                console.log("WEBCONNECTED TO WEBSOCKET")
            }}
            onRejected = {()=> {
                console.log("WEBCONNECTION DISCONNECTED");
            }}
        />: ""} <Layout /> </>
  }
  isLoggedIn = () => {
    console.log("IS LOGGED IN", this.props.authentication.loggedIn)
    if (this.props.authentication.loggedIn == "true" || this.props.authentication.loggedIn == true) {
      return true
    }
    return false
  }
  isAdmin = () => {
    if (window.location.pathname == "/admins"){
      return true;
    }
    else{
      return false;
    }
  }

  render() {
    
    return (
      <Router>
        <div className="App container-fluid h-100">
          <div className='row h-100'>
            <div className='col-md-12'>
              <ToastContainer autoClose={2000}/>
              <Switch>
                
                <Route exact path="/partners/sign_up">
                  <PartnerSignup />
                </Route>
                
                <Route exact path="/partners/forgot_password" location={this.props.location}>
                  <ForgotPassword />
                </Route>
                <Route exact path="/partners/confirm_email" location={this.props.location}>
                  <ConfirmEmail />
                </Route>
                <Route exact path="/partners/password_edit" location={this.props.location}>
                  <PasswordEdit />
                </Route>
                
               
                
                
                {this.isLoggedIn() == false ? this.isAdmin() == true ? <AdminLogin location={this.props.location} /> : <PartnerLogin location={this.props.location} /> : (this.state.confirmingLoggedIn == true ? <ConfirmingSpinner /> :
                  this.getLayoutOrRedirect())
                }
                <Route exact path="/admins/">
                  <AdminLogin location={this.props.location} />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}



const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
