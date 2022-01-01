import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class SizeGroups extends Component {
    componentDidMount = () => {
        console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [   {name: 'name'}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>SizeGroups
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/product_configurations/size_groups/new'>New SizeGroup</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/admins/size_groups"} link_endpoint={"/product_configurations/size_groups"}  {...this.props} />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
