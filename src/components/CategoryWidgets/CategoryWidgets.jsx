import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class CategoryWidgets extends Component {
    componentDidMount = () => {
        console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [   {name: 'description'}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>CategoryWidgets
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/appearances/category_widgets/new'>New CategoryWidget</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/admins/category_widgets"} link_endpoint={"/appearances/category_widgets"}  {...this.props} />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
