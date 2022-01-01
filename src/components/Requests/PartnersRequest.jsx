import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'
import Datetime from 'react-datetime';
import '../PartnerOrders/node_modules/react-datetime/css/react-datetime.css';
import moment from 'moment';
import axiosInstance from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import { withRouter} from 'react-router-dom'
import { Marker, LoadScript, StandaloneSearchBox } from '@react-google-maps/api'
import { getVehicleTypes, getRequestsTypes, getGenders, getMaritalStatuses, getPaymentMethods } from '../misc/functions'
import { history } from '../../index'
import "./Request.scss"
import RequestMap from './RequestMap';
import { mdiBicycle } from '@mdi/js';
import Loader from 'react-loader-spinner';
import {ActionCable} from 'react-actioncable-provider'
// import CustomMap from './CustomMap'
// import { Map, GoogleApiWrapper, Marker, } from 'google-maps-react';
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DeliveryType from './DeliveryType'
import NumberField from '../Controls/NumberField';
import PhoneInput from 'react-phone-input-2';
class Request extends Component {
    state = {
        request: { 
            from: null,
            from_latitude: null,
            from_longitude: null,
            to_latitude: null,
            to_longitude: null,
            receipient_name: null,
            receipient_number: null,
            delivery_type_id: null,
            price: 0.0,
            
        },
        delivery_types: [],
        initialPosition: {
            long: 0,
            lat: 0
        },
        gettingPrice: false,
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        request_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    static libraries;
    constructor(props) {
        super(props);
        this.fromBox = React.createRef();
        this.toBox = React.createRef();
        this.libraries = ["places"]
      }
    onFromLoad = (ref) => {
        // // console.log("THIS IS REF", ref)
        this.fromBox = ref

    }

    onToLoad = (ref) => {
        // // console.log("THIS IS REF", ref)
        this.toBox = ref

    }
    onFromPlaceChanged = () => {
        var from = this.fromBox.getPlaces()
        console.log("THIS IS FROM LOCATINO", from[0])
        this.setState({
            ...this.state,
            request: {
                ...this.state.request,
                from: from[0].name,
                from_location: from[0].geometry.location,
                from_latitude: from[0].geometry.location.lat(),
                from_longitude: from[0].geometry.location.lng()
            }
        })
    }
    onToPlaceChanged = () => {
       
        var to = this.toBox.getPlaces()
        console.log("This is the Destination", to)
        this.setState({
            ...this.state,
            request: {
                ...this.state.request,
                to: to[0].name,
                to_location: to[0].geometry.location,
                to_latitude: to[0].geometry.location.lat(),
                to_longitude: to[0].geometry.location.lng()
            }
        })
    }
    setRequest = (state, request) => {
        this.setState({
            ...state,
            request: {
                from_location: {
                    // toUrlValue: () => {},
                    // toString: () => {},
                    lng: parseFloat(request.from_longitude), 
                    lat:  parseFloat(request.from_latitude),
                    // equals: ()=> true
                },
                    
                to_location: {
                //     toUrlValue: () => {},
                    // toString: () => {},
                    lng:  parseFloat(request.to_longitude), 
                    lat:  parseFloat(request.to_latitude),
                    // equals: ()=> true
                
                },
                ...state.request,
                ...request
            },
        })
    }
    componentDidMount = ()=> {
        //   this.searchBox = new places.SearchBox(this.searchInput.current);
        //   this.searchBox.addListener('places_changed', this.onPlacesChanged);
        Promise.all([getVehicleTypes()]).then(([delivery_types]) => {
            
            var new_state = {...this.state, 
                delivery_types: delivery_types,
                // payment_methods: payment_methods,
            }
            if (this.state.existing_record){
                axiosInstance.get(`${this.props.authentication.default_path}requests/${this.state.request_uuid}`).then(response => {
                    // console.log(response)
                    this.setRequest(new_state, response.data.request)   
                })
            }
            else{
                this.setState({
                    ...this.state,
                    delivery_types: delivery_types, 
                    // payment_methods: payment_methods,
                })
            }
            
            // // console.log("THIS RESPONSE", response);
        })
        var self = this;
        if ('geolocation' in  navigator){
            // console.log("Found")
            navigator.geolocation.getCurrentPosition(function(position) {
                // console.log("Latitude is :", position.coords.latitude);
                // console.log("Longitude is :", position.coords.longitude);
                self.setState({
                    ...self.state,
                    initialPosition: {
                        ...self.state.initialPosition,
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    }
                })
              });
        }
        else{
            // console.log("cannot use location")
        }
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            request: {
                ...this.state.request,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    computePrice = response => {
        if (this.state.readOnly){

        }
        else{this.setState({
            ...this.state,
            gettingPrice: true
        })
        console.log();
        var distance = response.rows[0].elements[0].distance.value;
        axiosInstance.get(`/users/requests/get_price?distance=${distance}`).then(new_response => {
            console.log("THIS IS PRICE RESPONSE", new_response);
            if (new_response.status == 200){
                this.setState({
                    ...this.state,
                    gettingPrice: false,
                    request: {
                        ...this.state.request,
                        price: new_response.data.price
                    }
                })
            }
        })}
        
        
    }
    

    setDeliveryType = (delivery_type_id) => {
        this.setState({
            ...this.state,
            request: {
                ...this.state.request,
                delivery_type_id: delivery_type_id
            }
        })
    }
    acceptRequest = e => {

        e.preventDefault();
        var self = this;
    
          
            
                
             var   instance = axiosInstance.put(`/partners/requests/${this.state.request_id || this.state.request.uuid}`, { request: this.state.request })
            

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                
                    var new_state = this.setRequest(this.state, response.data.request)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                
               


            }
            )
        
    }
    onReceipientNumberChange = (number) => {
        console.log(number);
        this.setState({
            ...this.state,
            request: {
                ...this.state.request,
                receipient_number: number
            }
        })
    }

    render() {
        
        return (
            <Col md={12}>
                <Card>

                    <CardBody>
                        <CardTitle className='col-md-12'>New Request
                        <ul>
                            {/* <li><Link className='btn btn-success btn-sm' to='/users/requests/new'>New Request</Link></li> */}
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                        <LoadScript
                                libraries={[...this.libraries]} 
                                    googleMapsApiKey="AIzaSyB7FJchvzi_cpHSAQgs-aHQ5Kpuxy41G-g">  
                            <Row>
                            <Col md={6}>
                                <Form className='row'>
                                
                                        <FormGroup className='col-md-12' >
                                            <Row>
                                                <Col md={2}>
                                                    <Label for="exampleEmail">From</Label>
                                                </Col>
                                                <Col md={10}>
                                                    
                                                {this.state.readOnly ? 
                                                <Input type="text" name="from" id='from'  placeholder="Pick up Point"  readOnly={this.state.readOnly}  value={this.state.readOnly ? this.state.request.from : null}/>
                                                 : 
                                                <StandaloneSearchBox
                                                onLoad={this.onFromLoad}
                                                // ref={this.fromBox}
                                                onPlacesChanged={
                                                    // this.onPlacesChanged.bind(this, "to", this.getPlaces())
                                                    this.onFromPlaceChanged
                                                }>
                                                    <Input type="text" name="from" id='from'  placeholder="Pick up Point"  readOnly={this.state.readOnly}  value={this.state.readOnly ? this.state.request.from : null}/>
                                               
                                            </StandaloneSearchBox> }
                                                
                                                </Col>  
                                            
                                            </Row>
                                        </FormGroup>
                                        
                                        <FormGroup className='col-md-12' >
                                            <Row>
                                                <Col md={2}>
                                                    <Label for="exampleEmail">To</Label>
                                                </Col>
                                                <Col md={10}>
                                                {this.state.readOnly ? 
                                                 <Input type="text" name="to"  placeholder="Delivery Point"  readOnly={this.state.readOnly} value={this.state.readOnly ? this.state.request.to : null}/>
                                                :
                                                <StandaloneSearchBox
                                                onLoad={this.onToLoad}
                                                onPlacesChanged={
                                                    this.onToPlaceChanged
                                                }>
                                                <Input type="text" name="to"  placeholder="Delivery Point"  readOnly={this.state.readOnly} value={this.state.readOnly ? this.state.request.to : null}/>
                                            </StandaloneSearchBox>    } 
                                                </Col>  
                                            </Row>
                                        </FormGroup>
                                        <FormGroup className='col-md-12' >
                                            <Row>
                                                <Col md={2}>
                                                    <Label for="exampleEmail">Recepient Name</Label>
                                                </Col>
                                                <Col md={10}>
                                                <Input type="text" name="receipient_name" value={this.state.request.receipient_name} placeholder="Receipient Name" onChange={this.onChange} readOnly={this.state.readOnly} />
                                                </Col>  
                                            </Row>
                                        </FormGroup>
                                        <FormGroup className='col-md-12' >
                                            <Row>
                                                <Col md={2}>
                                                    <Label for="exampleEmail">Recepient Number</Label>
                                                </Col>
                                                <Col md={10}>
                                                <PhoneInput
                                                country={'gh'}
                                                value={this.state.request.receipient_number}
                                                countryCodeEditable={false}
                                                // disableCountryCode={true}
                                                disableDropdown={true}
                                                disabled={this.state.readOnly}
                                                className='test-class'
                                                onChange={(phone) => this.onReceipientNumberChange(phone)}
                                                />
                                                </Col>  
                                            </Row>
                                        </FormGroup>
                                        <FormGroup className='col-md-12' >
                                            <Row>
                                                <Col md={2}>
                                                    <Label for="exampleEmail">Type</Label>
                                                </Col>
                                                <Col md={10}>
                                                <DeliveryType readOnly = {this.state.readOnly} setDeliveryType={this.setDeliveryType}  delivery_types ={this.state.delivery_types} request={this.state.request} />
                                                </Col>  
                                            </Row>
                                        </FormGroup>
                                        <FormGroup className='col-md-12' >
                                            <Row>
                                                <Col md={2}>
                                                    <Label for="exampleEmail">Price</Label>
                                                </Col>
                                                <Col md={10}>
                                                <Col id='priceBox'>
                                                {this.state.gettingPrice ? <Col className='spinner'><Loader
                                                
                                                        type="TailSpin"
                                                        color="#000"
                                                        height={40}
                                                        width={40}
                                                    />  
                                                    <p>Computing Price</p>
                                                    </Col>: 
                                                <h1>{"GHS " } <NumberField  thousandSeparator={true} displayType={"text"} value={this.state.request.price} /></h1>  }
                                                </Col>
                                                </Col>  
                                            </Row>
                                        </FormGroup>
                                        {/* <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Type</Label>
                                            <Select
                                                name="type_id"
                                                value={this.state.type_id}
                                                // onChange={this.handleChangeSelect.bind(this, "type_id")}
                                                options={this.state.request_types}
                                                isDisabled={this.state.readOnly}
                                            />
                                        </FormGroup> */}
                                        
                                    </Form>
                                    <Col md={12}>
                                    <Row>
                                        {this.state.readOnly ?
                                        
                                        <Button onClick={this.acceptRequest} color="success" size='lg' className='form-control' >Accept Request </Button> :  "" 
                                        // <Button onClick={this.requestDelivery} color="primary" size='lg' className='form-control' disabled={this.state.gettingPrice}> Accept  Delivery </Button> 
                                        }
                                    </Row>
                                </Col>
                                </Col>
                                {/* <ActionCable
                                    // key={conversation.id}  
                                    channel={{ channel: 'RequestUpdatesChannel', request_uuid: this.state.request.uuid }}

                                    onReceived={(msg)=> {
                                         console.log(`THIS IS MESSAGE ${msg}`); 
                                    }}
                                    onConnected={()=>{
                                        console.log("CONNECTED TO WEBSOCKET")
                                    }}
                                    onRejected = {()=> {
                                        console.log("CONNECTION DISCONNECTED");
                                    }}
                                /> */}
                                <Col md={6} className='mapContainer'>

                                    <RequestMap computePrice={this.computePrice} initialPosition={{...this.state.initialPosition}} request={this.state.request} directionsCallback={this.directionsCallback} response={this.state.response} />
                                    
                                </Col>
                                </Row>
                               
                                
                                </LoadScript>
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)(Request));