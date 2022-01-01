import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class Admins extends Component {
    
    render() {
        var columns= [{name: 'name'}, {name: 'email'},  {name: 'phone'}] 
        return (
            <Col md={12}>
                
            <Card >
                <CardBody>
                    <CardTitle>Admins
                    <ul>
                        <li><Link className='btn btn-success btn-sm' to='/admins/settings/admins/new'>New Admin</Link></li>
                    </ul>
                    </CardTitle>
                    <CardText>
                       <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/admins/admins"} link_endpoint={"/admins/settings/admins"}   {...this.props} />
                    </CardText>
                </CardBody>
            </Card>
        </Col>
        )
    }
}
