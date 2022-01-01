import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'


import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectCountries, getCountriesTypes, getGenders, getMaritalStatuses, getCategories } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
import './countries.scss'
import Dropzone from 'react-dropzone';
export default class Country extends Component {
    state = {
        country: {
            photo_id: null,
            description: '',
            link: ''
        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        country_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            country: {
                ...this.state.country,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            country: {
                ...this.state.country,
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
                country: {
                    ...this.state.country,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.country[attr_name])
            var date = new moment(this.state.country[attr_name])
            var new_state = {
                ...this.state,
                country: {
                    ...this.state.country,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setCountries = (state, country) => {
        
        var new_state = {
            ...state,
            country: country,
            
            
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            country: {
                ...this.state.country,
                [e]: val.floatValue
            }
        })
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            country: {
                ...this.state.country,
                [selectedOption]: val.value
            },
            [selectedOption]: val
        }
        this.setState({ ...state })
    }
    onDrop = (name, acceptedFiles) => {
        console.log(name);
        console.log(acceptedFiles);
        if (this.state.readOnly != true) {
            acceptedFiles.map((file, i) => {
                var formData = new FormData();
                formData.append("file", file)
                axiosInstance.post("/photos", formData).then(response => {
                    this.setState({
                        ...this.state,
                        country: {
                            ...this.state.country,
                            photo_id:  response.data.photo.id,
                            photo: response.data.photo
                        }
                    })
                })
            })
        }
    }
    componentDidMount = () => {
        var self = this
        
        // Promise.all([getCategories()]).then(([categories]) => {
            console.log("ID", this.props.match.params.id)
            if (self.state.existing_record == true) {
                console.log("FECHING EXISTING RECORD")
                axiosInstance.get(`/admins/countries/${this.state.country_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                        
                    }
                    new_state = self.setCountries(new_state, response.data.country)
                    self.setState({ ...new_state })
                })
            }
            else {
                self.setState({
                    ...this.state,
                    
                })
            }

        // })
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
                instance = axiosInstance.post('/admins/countries', { country: this.state.country })
            }
            else {
                
                instance = axiosInstance.put(`/admins/countries/${this.state.country_id || this.state.country.uuid}`, { country: this.state.country })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setCountries(this.state, response.data.country)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/product_configurations/countries/${response.data.country.uuid}`)
                    // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
                }


            })
        }
    }


    render() {
        return (
            <Col md={12}>
                <Card>

                    <CardBody>
                        <CardTitle className='col-md-12'>Country
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/product_configurations/countries/new'>New Country</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                
                                                    <Col md={12}>
                                                    <Row>
                                                   
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.country.name} placeholder="Country Name" onChange={this.onChange} readOnly={this.state.readOnly} /> 
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
