import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'


import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectRegions, getRegionsTypes, getGenders, getMaritalStatuses, getCategories, getCountries } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
// import './sizegroups.scss'
import Dropzone from 'react-dropzone';
export default class Region extends Component {
    state = {
        region: {
            photo_id: null,
            description: '',
            link: ''
        },
        countries: [],
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        region_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            region: {
                ...this.state.region,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            region: {
                ...this.state.region,
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
                region: {
                    ...this.state.region,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.region[attr_name])
            var date = new moment(this.state.region[attr_name])
            var new_state = {
                ...this.state,
                region: {
                    ...this.state.region,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setRegions = (state, region) => {
        
        var new_state = {
            ...state,
            region: region,
            country_id: state.countries.find(
                (obj) => obj.value == region.country_id
              ),
            
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            region: {
                ...this.state.region,
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
                axiosInstance.get(`/admins/regions/${this.state.region_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        countries: countries
                        
                        
                    }
                    new_state = self.setRegions(new_state, response.data.region)
                    self.setState({ ...new_state })
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
                instance = axiosInstance.post('/admins/regions', { region: this.state.region })
            }
            else {
                
                instance = axiosInstance.put(`/admins/regions/${this.state.region_id || this.state.region.uuid}`, { region: this.state.region })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setRegions(this.state, response.data.region)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/delivery_configurations/regions/${response.data.region.uuid}`)
                    // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
                }


            })
        }
    }

    handleChangeSelect = (selectedOption, val) => {
        var state = {
          ...this.state,
          region: {
            ...this.state.region,
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
                        <CardTitle className='col-md-12'>Region
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/product_configurations/regions/new'>New Region</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                                    <Col md={12}>
                                                    <Row>
                                        <FormGroup className='col-md-6'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.region.name} placeholder="Region Name" onChange={this.onChange} readOnly={this.state.readOnly} /> 
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
