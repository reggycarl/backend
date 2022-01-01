import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'


import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectPickupLocations, getPickupLocationsTypes, getGenders, getMaritalStatuses, getCities, getCountries, getRegions } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
// import './sizegroups.scss'
import Dropzone from 'react-dropzone';
export default class PickupLocation extends Component {
    state = {
        pickup_location: {
            photo_id: null,
            description: '',
            link: ''
        },
        regions: [],
        cities: [],
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        pickup_location_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            pickup_location: {
                ...this.state.pickup_location,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    // handleChangeSelect = (selectedOption, val) => {
    //     var state = {
    //         ...this.state,
    //         pickup_location: {
    //             ...this.state.pickup_location,
    //             [selectedOption]: val.value
    //         },
    //         [selectedOption]: val
    //     }
    //     this.setState({ ...state })
    // }
    onDateChanged = (momentdate, attr_name) => {
        // console.log("ClassName is", momentdate.constructor.name)
        var new_date = new moment();
        if (momentdate.constructor.name == new_date.constructor.name) {
            var new_state = {
                ...this.state,
                pickup_location: {
                    ...this.state.pickup_location,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.pickup_location[attr_name])
            var date = new moment(this.state.pickup_location[attr_name])
            var new_state = {
                ...this.state,
                pickup_location: {
                    ...this.state.pickup_location,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setPickupLocations = (state, pickup_location) => {
        console.log("THIS IS STATE", state);
        var new_state = {
            ...state,
            pickup_location: pickup_location,
            country_id: state.countries.find(
                (obj) => obj.value == pickup_location.country_id
              ),
              region_id: state.regions.find(
                (obj) => obj.value == pickup_location.region_id
              ),   
              city_id: state.cities.find(
                (obj) => obj.value == pickup_location.city_id
              ),   
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            pickup_location: {
                ...this.state.pickup_location,
                [e]: val.floatValue
            }
        })
    }
   
   
    componentDidMount = () => {
        var self = this
        
        Promise.all([getCountries()]).then(([countries]) => {
            console.log("ID", this.props.match.params.id)
            if (self.state.existing_record == true) {
                console.log("FECHING EXISTING RECORD")
                axiosInstance.get(`/admins/pickup_locations/${this.state.pickup_location_uuid}?&with_country_and_region=true`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        countries: countries,
                        pickup_location: response.data.pickup_location
                        
                    }
                    getRegions(new_state.pickup_location.country_uuid).then((regionsData)=> {
                        console.log("THIS IS NEW STATE BEFORE", new_state)
                        new_state = {
                            ...new_state,
                            regions: regionsData
                        }
                        getCities(new_state.pickup_location.region_uuid).then( citiesData => {
                            new_state = {
                                ...new_state,
                                cities: citiesData
                            }
                        new_state = self.setPickupLocations(new_state, response.data.pickup_location)
                        self.setState({ ...new_state });
                        })
                    });
                    
                    
                })
            }
            else {
                self.setState({
                    ...this.state,
                    countries: countries
                })
            }

        })
    }

    onSubmit = e => {
        e.preventDefault();
        var self = this;
        if (self.state.readOnly == true && self.state.existing_record == true) {
            self.setState({
                ...self.state,
                readOnly: false
            })
        }

        else {
            var instance;
            if (self.state.existing_record != true) {
                instance = axiosInstance.post('/admins/pickup_locations', { pickup_location: this.state.pickup_location })
            }
            else {
                
                instance = axiosInstance.put(`/admins/pickup_locations/${this.state.pickup_location_id || this.state.pickup_location.uuid}`, { pickup_location: this.state.pickup_location })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setPickupLocations(this.state, response.data.pickup_location)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/delivery_configurations/pickup_locations/${response.data.pickup_location.uuid}`)
                    // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
                }


            })
        }
    }

    handleChangeSelect = (selectedOption, val) => {
        if (selectedOption ==  'country_id'){
            getRegions(val.uuid).then(response=> {
                this.setState({
                    ...this.state,
                    region_id: null,
                    regions: response
                })
            })
        }
        if (selectedOption ==  'region_id'){
            getCities(val.uuid).then(response=> {
                this.setState({
                    ...this.state,
                    city_id: null,
                    cities: response
                })
            })
        }
        var state = {
          ...this.state,
          pickup_location: {
            ...this.state.pickup_location,
            [selectedOption]: val.value,
          },
          [selectedOption]: val,
        };
        this.setState({ ...state });
      };


    render() {
        return (
            <Col md={12}>
                <Card>

                    <CardBody>
                        <CardTitle className='col-md-12'>PickupLocation
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/delivery_configurations/pickup_locations/new'>New PickupLocation</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                                    <Col md={12}>
                                                    <Row>
                                        <FormGroup className='col-md-9'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.pickup_location.name} placeholder="Pickup Location Name" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>

                                        </Row>
                                        <Row>
                                        <FormGroup className='col-md-9'>
                                            <Label for="name">Address</Label>
                                            <Input type="textarea" rows={5} name="address" value={this.state.pickup_location.address} placeholder="Pickup Location Address" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>

                                        </Row>

                                        <Row>
                                        <FormGroup className='col-md-4'>
                                            <Label for="name">GPS Code</Label>
                                            <Input type="text" name="gps_code" value={this.state.pickup_location.gps_code} placeholder="PickupLocation GPS Code" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>
                                        <FormGroup className='col-md-8'>
                                            <Label for="name">Contact Information</Label>
                                            <Input type="text" name="contact_information" value={this.state.pickup_location.contact_information} placeholder="Contact Name - Contact Phone Number" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>

                                        </Row>
                                        <Row>
                                        <FormGroup className='col-md-4'>
                                            <Label for="exampleEmail">Country</Label>
                                            <Select
                                                name="country_id"
                                                value={this.state.country_id}
                                                onChange={this.handleChangeSelect.bind(this, "country_id")}
                                                options={this.state.countries}
                                                isDisabled={this.state.readOnly}
                                            /> 
                                        </FormGroup>
                                        <FormGroup className='col-md-4'>
                                            <Label for="exampleEmail">Region</Label>
                                            <Select
                                                name="region_id"
                                                value={this.state.region_id}
                                                onChange={this.handleChangeSelect.bind(this, "region_id")}
                                                options={this.state.regions}
                                                isDisabled={this.state.readOnly}
                                            /> 
                                        </FormGroup>
                                        <FormGroup className='col-md-4'>
                                            <Label for="exampleEmail">City</Label>
                                            <Select
                                                name="city_id"
                                                value={this.state.city_id}
                                                onChange={this.handleChangeSelect.bind(this, "city_id")}
                                                options={this.state.cities}
                                                isDisabled={this.state.readOnly}
                                            /> 
                                        </FormGroup>
                                        </Row>
                                                    </Col>
                
                  </Row>
                                
                                    <Row>
                                        
                                        
                                    </Row>
                                </Col>

                                <Col md={12}>
                                    {/* <Row> */}
                                        <SubmitButton onClick={this.onSubmit} readOnly={this.state.readOnly} editing={this.state.editing} existing_record={this.state.existing_record} />
                                    {/* </Row> */}
                                </Col>
                            </Form>
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
