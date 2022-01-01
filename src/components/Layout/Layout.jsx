import React, { Component, Suspense, Fragment } from 'react'
import AppNavbar from '../AppNavbar/MainAppbar'

import Login from '../Login/AdminLogin'
import { Row, Col } from 'reactstrap'

import DashboardTop from './DashboardTop'
import "./Layout.scss"
import PageLoader from '../PageLoader/'
import Sidebar from '../Sidebar/Sidebar'
import MainContainer from './MainContainer'
import PrintDialog from '../PrintDialog'
import Routes from './Routes'

import * as actions from '../../actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import {history} from '../../index'
import { withRouter } from 'react-router-dom'
import { ActionCableConsumer } from 'react-actioncable-provider'
class Layout extends Component {
    notification_received = (msg => {
        console.log(msg)
    })
    render() {  
        return (
            
            <Row className='h-100'>
                
                 <Fragment>
                    <Sidebar />
                <MainContainer>
                    <AppNavbar />
                    <Row>
                         <DashboardTop  /> 
                        <Suspense fallback={<PageLoader />}>
                            <Col md={12} className={'content'}>
                                <Routes />
                            </Col>
                        </Suspense>
                    </Row>
                </MainContainer>
           
            </Fragment>
            
        </Row>

        )
    }
}
const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout));