import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class Drivers extends Component {
    componentDidMount = () => {
        console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [{name: 'Subject'}, {name: 'message'}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>Drivers
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/partners/drivers/new'>New Driver</Link></li>
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/partners/drivers"}  {...this.props} />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
