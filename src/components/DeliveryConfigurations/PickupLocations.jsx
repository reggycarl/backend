import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import CardText from 'reactstrap/lib/CardText';
import CardTitle from 'reactstrap/lib/CardTitle';
import Col from 'reactstrap/lib/Col';
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable';
import axiosInstance from '../misc/Axios';
export default class PickupLocations extends Component {
    
    render() {
        var columns= [ {name: 'name'},  {name: 'region_name', field: "region_name"}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>Pickup Locations
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/delivery_configurations/pickup_locations/new'>New PickupLocation</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/admins/pickup_locations"}  options={"?with_country_and_region=true"}  link_endpoint={"/delivery_configurations/pickup_locations"}  {...this.props} />
            </CardText>
            </CardBody>
            </Card>
            </Col>
        )
    }
}
