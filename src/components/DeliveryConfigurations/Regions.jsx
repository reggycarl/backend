import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from 'reactstrap/lib/Card'
import CardBody from 'reactstrap/lib/CardBody'
import CardText from 'reactstrap/lib/CardText'
import CardTitle from 'reactstrap/lib/CardTitle'
import Col from 'reactstrap/lib/Col'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import axiosInstance from '../misc/Axios'
export default class Regions extends Component {
    render() {
        var columns= [ {name: 'name'},  {name: 'description'}] 
        return (
        
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>Regions
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/delivery_configurations/regions/new'>New Region</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/admins/regions"} link_endpoint={"/delivery_configurations/regions"}  {...this.props} />
            </CardText>
            </CardBody>
            </Card>
            </Col>
        
        )
    }
}
