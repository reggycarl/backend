import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'


import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectBrands, getBrandsTypes, getGenders, getMaritalStatuses, getCategories } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
import './brands.scss'
import Dropzone from 'react-dropzone';
export default class Brand extends Component {
    state = {
        brand: {
            photo_id: null,
            description: '',
            link: ''
        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        brand_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            brand: {
                ...this.state.brand,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            brand: {
                ...this.state.brand,
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
                brand: {
                    ...this.state.brand,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.brand[attr_name])
            var date = new moment(this.state.brand[attr_name])
            var new_state = {
                ...this.state,
                brand: {
                    ...this.state.brand,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setBrands = (state, brand) => {
        
        var new_state = {
            ...state,
            brand: brand,
            
            
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            brand: {
                ...this.state.brand,
                [e]: val.floatValue
            }
        })
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            brand: {
                ...this.state.brand,
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
                        brand: {
                            ...this.state.brand,
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
                axiosInstance.get(`/admins/brands/${this.state.brand_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                        
                    }
                    new_state = self.setBrands(new_state, response.data.brand)
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
                instance = axiosInstance.post('/admins/brands', { brand: this.state.brand })
            }
            else {
                
                instance = axiosInstance.put(`/admins/brands/${this.state.brand_id || this.state.brand.uuid}`, { brand: this.state.brand })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setBrands(this.state, response.data.brand)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/product_configurations/brands/${response.data.brand.uuid}`)
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
                        <CardTitle className='col-md-12'>Brand
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/appearances/brands/new'>New Brand</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                <Col md={3}>
                                    <Row>
                    
                    <Dropzone disabled={this.state.readOnly} onDrop={ this.readOnly ? null : this.onDrop.bind(null, "photo")}>
                                                        {({ getRootProps, getInputProps }) => (

                                                            <Col id='photoBox' {...getRootProps()} className={`${this.state.readOnly ? "" : "dropZone"}  col-md-12`} >
                                                              <input {...getInputProps()} />
                                                                
                                                                {this.state.brand.photo ? <img src={this.state.brand.photo.image_url} /> : null}
                                                            </Col>

                                                        )}
                                                    </Dropzone>
                                                    </Row>
                                                    </Col>
                                                    <Col md={9}>
                                                    <Row>
                                                   
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.brand.name} placeholder="Brand Name" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Description</Label>
                                            <Input type="textarea" name="description" value={this.state.brand.description} placeholder="Brand Description" onChange={this.onChange} readOnly={this.state.readOnly} /> 
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
