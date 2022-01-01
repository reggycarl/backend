import React, { Component } from 'react'
import './Dashboard.scss'
import { Row, Col, Card, CardTitle, CardText } from "reactstrap"
import NoDataYet from '../Layout/NoDataYet'
import { Fragment } from 'react'
import axiosInstance from '../misc/Axios'
import NumberField from '../Controls/NumberField'
export default class Dashboard extends Component {
    state = {
        live_products_count: 0,
        pending_products_count: 0,
        total_products: 0,
        orders_pending_confirmation: 0
    }
    componentDidMount = () => {
        this.setState({
            ...this.state,
            loading: true
        })
        setTimeout(() => {
            Promise.all([axiosInstance.get("/admins/dashboard/live_products_count"), axiosInstance.get("/admins/dashboard/pending_products_count"), axiosInstance.get("/admins/dashboard/total_products_count"), axiosInstance.get("/admins/dashboard/orders_pending_confirmation_count")]).then(([live_products_count_response, pending_products_count_response, total_products_count_response, orders_pending_confirmation_count_response])=>{
           
            if(live_products_count_response.status == 200){
                this.setState({
                    ...this.state,
                    live_products_count: live_products_count_response.data.data
                })
            }
            if(pending_products_count_response.status == 200){
                this.setState({
                    ...this.state,
                    pending_products_count: pending_products_count_response.data.data
                })
            }
            if(total_products_count_response.status == 200){
                this.setState({
                    ...this.state,
                    total_products_count: total_products_count_response.data.data
                })
            }
            if(orders_pending_confirmation_count_response.status == 200){
                this.setState({
                    ...this.state,
                    orders_pending_confirmation_count: orders_pending_confirmation_count_response.data.data
                })
            }
           
        })
    }, 1000)
    }
    render() {
        var dashInfo = [{name: "Live Products", value: this.state.live_products_count || 0}, {name: "Pending Products", value: this.state.pending_products_count},{name: "Total Products", value: this.state.total_products_count || 0} , {name: "Order Pending Confirmation ", value: this.state.orders_pending_confirmation_count}]
        return (
            <Col className='dashboardContent'>
                <Row>
                    {dashInfo.map((info, i)=> {
                        return <Col md={3} className='infoBox'>
                            
                        <Col className='inner'>
                            <Row>
                        <Col className="h-100 value">
                            <NumberField  value = {info.value} decimalScale={info.decimalScale || 0}/>
                            </Col>
                            </Row>
                                <Col className='bottom'>
                                    {info.name}
                                </Col>
                        </Col>
    
                        </Col>
                    })}
                    
                    
                </Row>
                <Row>
                    <Col md={12}>
                        <Card body>
                            <CardTitle>Performance Over Time</CardTitle>
                            <CardText>
                                
                            </CardText>
                        </Card>
                        
                    </Col>
                    {/* <Col md={4}>
                        <Card body>
                            <CardTitle>Revenue </CardTitle>
                            <CardText>
                                <NoDataYet />
                            </CardText>
                        </Card>
                    </Col> */}
                </Row>
            </Col>
        )
    }
}
