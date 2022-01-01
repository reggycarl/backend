import React, { Component } from 'react'
import './CurrentUser.scss'
import { Row, Col } from 'reactstrap'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UserImg from '../../assets/images/user-placeholder.png'
class CurrentUser extends Component {
    render() {
        return (
            // <div id='currentUser'>
                <Col id = "currentUser" md={12}>
                    
                        <p  className='userInfo'>
                            <span id='userName' className='inline' >{this.props.authentication.user.first_name.trim()}</span> &nbsp;<span id='userImg' className='inline'>
                            <img src={UserImg} /></span>       
                        </p>
                        
                    
                </Col>
            // </div >
        )
    }
}

const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentUser);

