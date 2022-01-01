import React, { Component } from 'react'
import { Col } from 'reactstrap'
import './DashboardTop.scss';
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
class DashboardTop extends Component {
    isHomePage = () => {
        
        if (window.location.pathname == '/' ) {
            
            return true
        }
        // else if(!_.isEmpty(this.props.authentication.default_app)){
        //     var app = this.props.authentication.default_app;
        //     // this.props.history.push(app.home)
        //     return false
        // }
        console.log("Home with empty default app ---")
        return false
    }
    render() {
        return (
            <Col md={12} className='dashboardTop' >
                {this.isHomePage() == true  ? <Col md={12} className="welcomeMessage"><h1>Welcome, {this.props.authentication.user.first_name}!</h1>
                    <p>You have 0 message and 0 notifications</p>
                </Col> : ''}
            </Col>
        )
    }
}

const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTop);
