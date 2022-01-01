import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'

import moment from 'moment';
import axiosInstance from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getMobileNetworks, getPaymentModes } from '../misc/functions'
import { history } from '../../index'
import PhoneInput from 'react-phone-input-2'
export default class PaymentMethod extends Component {
    state = {
        payment_method: {
            payment_mode_id: '',
            mobile_network_id: '',
            wallet_number: '', 
        },

        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        payment_method_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            payment_method: {
                ...this.state.payment_method,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            payment_method: {
                ...this.state.payment_method,
                [selectedOption]: val.value
            },
            [selectedOption]: val
        }
        this.setState({ ...state })
    }
    onWalletNumberChange = (number) => {
        console.log(number);
        this.setState({
            ...this.state,
            payment_method: {
                ...this.state.payment_method,
                number: number
            }
        })
    }
    onDateChanged = (momentdate, attr_name) => {
        // console.log("ClassName is", momentdate.constructor.name)
        var new_date = new moment();
        if (momentdate.constructor.name == new_date.constructor.name) {
            var new_state = {
                ...this.state,
                payment_method: {
                    ...this.state.payment_method,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.payment_method[attr_name])
            var date = new moment(this.state.payment_method[attr_name])
            var new_state = {
                ...this.state,
                payment_method: {
                    ...this.state.payment_method,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setPaymentMethods = (state, payment_method) => {
        console.log("THIS IS STATE", state)
        var new_state = {
            ...state,
            payment_method: payment_method,
            // type_id: state.payment_method_types.
            payment_mode_id: state.payment_modes.find(obj => obj.value == payment_method.payment_mode_id),
            mobile_network_id: state.mobile_networks.find(obj => obj.value == payment_method.mobile_network_id)

        }
        return new_state;
    }
    componentDidMount = () => {
        var self = this
        
        Promise.all([getPaymentModes(), getMobileNetworks()]).then(([payment_modes, mobile_networks]) => {
            // console.log("ID", this.props.match.params.id)
            console.log("MOBILE NETWORKS MODES", mobile_networks)
            if (self.state.existing_record == true) {
                console.log("FECHING EXISTING RECORD")
                axiosInstance.get(`/partners/payment_methods/${this.state.payment_method_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        payment_modes: payment_modes,
                        mobile_networks: mobile_networks,
                    }
                    new_state = self.setPaymentMethods(new_state, response.data.payment_method)
                    self.setState({ ...new_state })
                })
            }
            else {
                self.setState({
                    ...this.state,
                    payment_modes: payment_modes,
                    mobile_networks: mobile_networks
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
                instance = axiosInstance.post('/partners/payment_methods', { ...this.state })
            }
            else {
                
                instance = axiosInstance.put(`/partners/payment_methods/${this.state.payment_method_id || this.state.payment_method.uuid}`, { payment_method: this.state.payment_method })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setPaymentMethods(this.state, response.data.payment_method)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/partners/payment_methods/${response.data.payment_method.uuid}`)
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
                        <CardTitle className='col-md-12'>New PaymentMethod
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/partners/payment_methods/new'>New PaymentMethod</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                
                                <Col md={9}>
                                    <Row>
                                        <FormGroup className='col-md-3'>
                                            <Label for="exampleEmail">Type</Label>
                                            <Select
                                                name="payment_mode_id"
                                                value={this.state.payment_mode_id}
                                                onChange={this.handleChangeSelect.bind(this, "payment_mode_id")}
                                                options={this.state.payment_modes}
                                                isDisabled={this.state.readOnly}
                                            />
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Mobile Network</Label>
                                            <Select
                                                name="mobile_network_id"
                                                value={this.state.mobile_network_id}
                                                onChange={this.handleChangeSelect.bind(this, "mobile_network_id")}
                                                options={this.state.mobile_networks}
                                                isDisabled={this.state.readOnly}
                                            /> 
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <FormGroup className='col-md-6'>
                                            
                                            <Label for="number">Wallet Number</Label>
                                            <PhoneInput
                                                country={'gh'}
                                                value={this.state.payment_method.number}
                                                countryCodeEditable={false}
                                                // disableCountryCode={true}
                                                disableDropdown={true}
                                                disabled={this.state.readOnly}
                                                className='test-class'
                                                onChange={(phone) => this.onWalletNumberChange(phone)}
                                                />
                                        </FormGroup>
                                    </Row>
                                
                                </Col>
                                
                                <Col md={12}>
                                    <Row>
                                        <SubmitButton onClick={this.onSubmit} readOnly={this.state.readOnly} editing={this.state.editing} existing_record={this.state.existing_record} />
                                    </Row>
                                </Col>
                            </Form>
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
