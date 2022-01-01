import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'


import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectCities, getCitiesTypes, getGenders, getMaritalStatuses, getCategories, getCountries, getRegions } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
// import './sizegroups.scss'
import Dropzone from 'react-dropzone';
export default class City extends Component {
    state = {
        city: {
            photo_id: null,
            description: '',
            link: ''
        },
        regions: [],
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        city_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            city: {
                ...this.state.city,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            city: {
                ...this.state.city,
                [selectedOption]: val.value
            },
            [selectedOption]: val
        }
        this.setState({ ...state })
    }
    onDateChanged = (momentdate, attr_name) => {
        // console.log("ClassName is", momentdate.constructor.name)
        var new_date = new moment();
        if (momentdate.constructor.name == new_date.constructor.name) {
            var new_state = {
                ...this.state,
                city: {
                    ...this.state.city,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.city[attr_name])
            var date = new moment(this.state.city[attr_name])
            var new_state = {
                ...this.state,
                city: {
                    ...this.state.city,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setCities = (state, city) => {
        console.log("THIS IS STATE", state);
        var new_state = {
            ...state,
            city: city,
            country_id: state.countries.find(
                (obj) => obj.value == city.country_id
              ),
              region_id: state.regions.find(
                (obj) => obj.value == city.region_id
              ),   
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            city: {
                ...this.state.city,
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
                axiosInstance.get(`/admins/cities/${this.state.city_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        countries: countries,
                        city: response.data.city
                        
                        
                    }
                    getRegions(new_state.city.country_uuid).then((regionsData)=> {
                        console.log("THIS IS NEW STATE BEFORE", new_state)
                        new_state = {
                            ...new_state,
                            regions: regionsData
                        }
                        console.log("THIS IS NEW STATE AFTER", new_state)
                        new_state = self.setCities(new_state, response.data.city)
                        self.setState({ ...new_state });
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
                instance = axiosInstance.post('/admins/cities', { city: this.state.city })
            }
            else {
                
                instance = axiosInstance.put(`/admins/cities/${this.state.city_id || this.state.city.uuid}`, { city: this.state.city })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setCities(this.state, response.data.city)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/delivery_configurations/cities/${response.data.city.uuid}`)
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
        var state = {
          ...this.state,
          city: {
            ...this.state.city,
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
                        <CardTitle className='col-md-12'>City
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/delivery_configurations/cities/new'>New City</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                                    <Col md={12}>
                                                    <Row>
                                        <FormGroup className='col-md-6'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.city.name} placeholder="City Name" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>

                                        </Row>
                                        <Row>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Country</Label>
                                            <Select
                                                name="country_id"
                                                value={this.state.country_id}
                                                onChange={this.handleChangeSelect.bind(this, "country_id")}
                                                options={this.state.countries}
                                                isDisabled={this.state.readOnly}
                                            /> 
                                        </FormGroup>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Region</Label>
                                            <Select
                                                name="region_id"
                                                value={this.state.region_id}
                                                onChange={this.handleChangeSelect.bind(this, "region_id")}
                                                options={this.state.regions}
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
