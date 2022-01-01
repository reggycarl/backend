import React, { Component } from 'react'
import {Col, Card, CardBody, CardTitle, CardText} from 'reactstrap'
import ReactWillPaginateTable from '../../lib/ReactWillPaginateTable'
import {Link} from 'react-router-dom'
import axiosInstance from '../misc/Axios'
export default class Notifications extends Component {
    componentDidMount = () => {
        console.log("PROPS ARE", this.props)
    }
    render() {
        var columns= [{name: 'Subject'}, {name: 'message'}] 
        return (
            <Col md={12}>
                
                <Card >
                    <CardBody>
                        <CardTitle>Notifications
                        <ul>
                            {/* <li><Link className='btn btn-success btn-sm' to='/partners/notifications/new'>New Notification</Link></li> */}
                        </ul>
                        </CardTitle>
                        <CardText>
                           <ReactWillPaginateTable  axiosInstance={axiosInstance} columns={columns} endpoint={"/partners/notifications"}  {...this.props} />
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
