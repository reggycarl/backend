import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class Sizes extends Component {
    componentDidMount = () => {
        console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [   {name: 'name'},{ name: "group"}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>Sizes
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/product_configurations/sizes/new'>New Size</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/admins/sizes"} link_endpoint={"/product_configurations/sizes"}  {...this.props} />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
