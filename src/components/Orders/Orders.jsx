import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link, withRouter} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import { bindActionCreators } from 'redux'


class Orders extends Component {
    componentDidMount = () => {
        // console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [{name: "number"},{name: 'customer_name'},{name: "customer_phone"}, {name: "created_at"}, { name: "status", field: "status_name"}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>Orders
                        <ul>
                             {false ? <li><Link className='btn btn-success btn-sm' to='/partners/orders/new'>Orders</Link></li> : ""}
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={`${this.props.authentication.default_path}orders`} link_endpoint={`${this.props.authentication.default_path}orders`}{...this.props}  />
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
)(Orders));