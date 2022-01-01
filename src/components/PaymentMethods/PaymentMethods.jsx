import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link, withRouter} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
import * as actions from '../../actions'
import { connect } from 'react-redux'

import _ from 'lodash'

import { bindActionCreators } from 'redux'
 class PaymentMethods extends Component {
    componentDidMount = () => {
        // console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [{name: "type"},{name: 'number'},{ name: "mobile_network"}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>Payment Methods
                        <ul>
                            { this.props.authentication.default_path == "/partners/" ? <li><Link className='btn btn-success btn-sm' to='/partners/payment_methods/new'>New Payment Method</Link></li> : ""}
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={`${this.props.authentication.default_path}payment_methods`} {...this.props}  />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}

const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentMethods));