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
// import './vouchers.scss'
import Dropzone from 'react-dropzone';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
export default class Voucher extends Component {
    state = {
        voucher: {
            code: "",
            description: '',
            amount: 0,
            start_date: moment(),
            end_date: moment(),
        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        voucher_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            voucher: {
                ...this.state.voucher,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeToggle = (component) => {
        this.setState({
          ...this.state,
          voucher: {
            ...this.state.voucher,
            [component.target.id]: component.target.checked,
          },
        });
      };
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            voucher: {
                ...this.state.voucher,
                [selectedOption]: val.value
            },
            [selectedOption]: val
        }
        this.setState({ ...state })
    }
    onDateChanged = (attr_name, momentdate ) => {
        // console.log("ClassName is", momentdate.constructor.name)
        var new_date = new moment();
        if (momentdate.constructor.name == new_date.constructor.name) {
            var new_state = {
                ...this.state,
                voucher: {
                    ...this.state.voucher,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.voucher[attr_name])
            var date = new moment(this.state.voucher[attr_name])
            var new_state = {
                ...this.state,
                voucher: {
                    ...this.state.voucher,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setCountries = (state, voucher) => {
        
        var new_state = {
            ...state,
            voucher: {...voucher,
                start_date: new moment(voucher.start_date),
                end_date: new moment(voucher.end_date),
            },

            
            
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            voucher: {
                ...this.state.voucher,
                [e]: val.floatValue
            }
        })
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            voucher: {
                ...this.state.voucher,
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
                        voucher: {
                            ...this.state.voucher,
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
                axiosInstance.get(`/admins/vouchers/${this.state.voucher_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                        
                    }
                    new_state = self.setCountries(new_state, response.data.voucher)
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
    onValueChange = (e, val) => {
        console.log(val);
        this.setState({
          ...this.state,
          voucher: {
            ...this.state.voucher,
            [e]: val.floatValue,
          },
        });
      };
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
                instance = axiosInstance.post('/admins/vouchers', { voucher: this.state.voucher })
            }
            else {
                
                instance = axiosInstance.put(`/admins/vouchers/${this.state.voucher_id || this.state.voucher.uuid}`, { voucher: this.state.voucher })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setCountries(this.state, response.data.voucher)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/admins/vouchers/${response.data.voucher.uuid}`)
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
                        <CardTitle className='col-md-12'>Voucher
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/admins/vouchers/new'>New Voucher</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                
                                                    <Col md={12}>
                                                    <Row>
                                                   
                                        <FormGroup className='col-md-3'>
                                            <Label for="name">Code</Label>
                                            <Input type="text" name="code" value={this.state.voucher.code} placeholder="Voucher Code" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                            <Label for="sale-price">Single Use</Label>
                            <Col md={12} className="block">
                              <Row>
                                <Toggle
                                  id="single_use"
                                  disabled={this.state.readOnly}
                                  defaultChecked={this.state.voucher.single_use}
                                  checked={this.state.voucher.single_use}
                                  onChange={this.handleChangeToggle}
                                />
                              </Row>
                            </Col>
                          </FormGroup>
                                      
                                        
                                    
                                    
                                        </Row>
                                        <Row>
                                        <FormGroup className='col-md-3'>
                                            <Label for="name">Amount</Label>
                                            <NumberField displayType={"input"} type="name" name='amount' value={this.state.voucher.amount} onValueChange={this.onValueChange.bind(this, "amount")}  readOnly={this.state.readOnly}  />
                                        </FormGroup>
                                        <FormGroup className='col-md-3'>
                                            <Label for="name">Threshold</Label>
                                            <NumberField displayType={"input"} type="name" name='threshold' value={this.state.voucher.threshold} onValueChange={this.onValueChange.bind(this, "threshold")}  readOnly={this.state.readOnly}  />
                                        </FormGroup>
                                        <FormGroup className='col-md-3'>
                                            <Label for="name">Rate(%)</Label>
                                            <NumberField displayType={"input"} type="" name='rate' value={this.state.voucher.rate} onValueChange={this.onValueChange.bind(this, "rate")}  readOnly={this.state.readOnly}  />
                                        </FormGroup>
                                        <FormGroup className='col-md-3'>
                                            <Label for="name">Count (Quantity)</Label>
                                            <NumberField displayType={"input"} type="name" name='count' value={this.state.voucher.count} onValueChange={this.onValueChange.bind(this, "count")}  readOnly={this.state.readOnly}  />
                                        </FormGroup>
                                       
                                        </Row>
                                        <Row>
                                        <FormGroup className='col-md-3'>
                                            <Label for="name">Start Date</Label>
                                            <Datetime type="name" dateFormat="DD-MM-YYYY" name='start_date' timeFormat={false} value={this.state.voucher.start_date} onChange={this.onDateChanged.bind(this, "start_date")} inputProps={{ disabled: this.state.readOnly }} />
                                        </FormGroup>
                                        <FormGroup className='col-md-3'>
                                            <Label for="name">End Date</Label>
                                            <Datetime type="name" dateFormat="DD-MM-YYYY" name='end_date' timeFormat={false} value={this.state.voucher.end_date} onChange={this.onDateChanged.bind(this, "end_date")} inputProps={{ disabled: this.state.readOnly }} />
                                            
                                        </FormGroup>

                                      
                                        </Row>
                                        <Row>
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Description</Label>
                                            <Input type="textarea" rows={10} name="description" value={this.state.voucher.description} placeholder="Voucher Description" onChange={this.onChange} readOnly={this.state.readOnly} /> 
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
