import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link, withRouter} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
import * as actions from '../../actions'
import { connect } from 'react-redux'

import _ from 'lodash'

import { bindActionCreators } from 'redux'
 class Partners extends Component {
    componentDidMount = () => {
        
    }
    render() {
        var columns= [{name: 'name'},{name: "address"}, {name: "Date Created", field: "created_at", date: true},] 
        return (
            <Col md={12}>
                <Card >
                    <CardBody>
                        <CardTitle>Partner Businesses
                        <ul>
                            { this.props.authentication.default_path == "/admins/" ? <li><Link className='btn btn-success btn-sm' to={`${this.props.authentication.default_path}partners/companies/new`}>New Business</Link></li> : ""}
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={`/admins/partners/companies`} {...this.props}  />
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
)(Partners));