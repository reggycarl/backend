import React, { Component } from 'react'
import PartnerDashboard from './PartnerDashboard'
import AdminDashboard from './AdminDashboard'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { Link, withRouter } from "react-router-dom";
 class Dashboard extends Component {
    render() {
        
           if ( this.props.authentication.default_path == "/partners/"){
               return <PartnerDashboard />
           }
           else if(this.props.authentication.default_path == "/admins/"){
               return <AdminDashboard />
           }
           else {
               return ""
           }
        
    }
}



const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));