import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'


import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import {  getProductTaxGroups } from '../misc/functions'
import './product_taxes.scss'
import Dropzone from 'react-dropzone';
import NumberField from '../Controls/NumberField';
export default class ProductTax extends Component {
    state = {
        product_tax: {
            name: "",
            description: '',
            rate: 0
        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        product_tax_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            product_tax: {
                ...this.state.product_tax,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            product_tax: {
                ...this.state.product_tax,
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
                product_tax: {
                    ...this.state.product_tax,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.product_tax[attr_name])
            var date = new moment(this.state.product_tax[attr_name])
            var new_state = {
                ...this.state,
                product_tax: {
                    ...this.state.product_tax,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setProductTaxes = (state, product_tax) => {
        
        var new_state = {
            ...state,
            product_tax: product_tax,
          
            
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            product_tax: {
                ...this.state.product_tax,
                [e]: val.floatValue
            }
        })
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            product_tax: {
                ...this.state.product_tax,
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
                        product_tax: {
                            ...this.state.product_tax,
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
        
        // Promise.all([]).then(() => {
            console.log("ID", this.props.match.params.id)
            if (self.state.existing_record == true) {
                console.log("FECHING EXISTING RECORD")
                axiosInstance.get(`/admins/product_taxes/${this.state.product_tax_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                        
                        
                    }
                    new_state = self.setProductTaxes(new_state, response.data.product_tax)
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
                instance = axiosInstance.post('/admins/product_taxes', { product_tax: this.state.product_tax })
            }
            else {
                
                instance = axiosInstance.put(`/admins/product_taxes/${this.state.product_tax_id || this.state.product_tax.uuid}`, { product_tax: this.state.product_tax })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setProductTaxes(this.state, response.data.product_tax)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/product_configurations/product_taxes/${response.data.product_tax.uuid}`)
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
                        <CardTitle className='col-md-12'>ProductTax
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/product_configurations/product_taxes/new'>New ProductTax</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                
                                                    <Col md={12}>
                                                    <Row>
                                                   
                                        <FormGroup className='col-md-4'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.product_tax.name} placeholder="ProductTax Name" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>
                                        </Row>
                                        <Row>
                                                   
                                        <FormGroup className="col-md-2">
                      <Label for="exampleEmail">Rate</Label>
                      <NumberField
                        name="rate"
                        thousandSeparator={true}
                        displayType={"input"}
                        className={"right"}
                        value={this.state.product_tax.rate}
                        onValueChange={this.onValueChange.bind(
                          this,
                          "rate"
                        )}
                        readOnly={this.state.readOnly}
                      />
                      
                    </FormGroup>
                    </Row>
                      <Row>
                                                   
                                                   <FormGroup className='col-md-12'>
                                                       <Label for="name">Description</Label>
                                                       <Input type="textarea" rows={5} name="description" value={this.state.product_tax.description} placeholder="ProductTax Description" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                                   </FormGroup>
                                                   </Row>
                                        <Row>
                                        
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
