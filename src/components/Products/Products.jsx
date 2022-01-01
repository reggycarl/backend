import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link, withRouter} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
import * as actions from '../../actions'
import { connect } from 'react-redux'

import _ from 'lodash'

import { bindActionCreators } from 'redux'
 class Products extends Component {
    componentDidMount = () => {
        
    }
    render() {
        var columns= [{name: "sku"},{name: 'name'},{name: "regular_price"}, {name: "sale_price"}, {name: "Inventory", field: "quantity"},{name: "date", field: "created_at", date: true}, { name: "status", field: "active", boolean: true, options: ["Active", "Inactive"]}] 
        if(this.props.authentication.default_path == "/admins/"){
            columns = [ ...columns, { name: "company_name"}]
        }
        return (
            <Col md={12}>
                <Card >
                    <CardBody>
                        <CardTitle>Products
                        <ul>
                            { this.props.authentication.default_path == "/partners/" ? <li><Link className='btn btn-success btn-sm' to={`${this.props.authentication.default_path}products/new`}>New Product</Link></li> : ""}
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable show_edit_actions={true} disable_link={true} isEditting ={true}  axiosInstance={axiosInstance} columns={columns} endpoint={`${this.props.authentication.default_path}products`} link_endpoint={`${this.props.authentication.default_path}products`} additional_params={!_.isEmpty(this.props.authentication.user) ? `current_company_id=${this.props.authentication.user.current_company_id}` : ""}  {...this.props}  />
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
)(Products));