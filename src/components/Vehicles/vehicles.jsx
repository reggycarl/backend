import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class Vehicles extends Component {
    componentDidMount = () => {
        console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [{name: 'registration_number'}, {name: 'make'}, {name: "model"}, {name: "color"},  {name: "type_name"}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>All Fleet
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/partners/vehicles/new'>New Vehicle</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/partners/vehicles"}  {...this.props} />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
