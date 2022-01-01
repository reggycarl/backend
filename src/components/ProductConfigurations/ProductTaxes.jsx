import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class ProductTaxes extends Component {
    componentDidMount = () => {
        console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [   {name: 'name'},{ name: "rate", number: true}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>ProductTaxes
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/product_configurations/product_taxes/new'>New ProductTax</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/admins/product_taxes"} link_endpoint={"/product_configurations/product_taxes"}  {...this.props} />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
