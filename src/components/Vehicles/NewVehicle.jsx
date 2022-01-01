import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import axiosInstance from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getVehicleTypes, getVehiclesTypes, getGenders, getMaritalStatuses } from '../misc/functions'
import { history } from '../../index'
export default class NewVehicle extends Component {
    state = {
        vehicle: {
            code: '',
            name: '',
        },

        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        vehicle_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            vehicle: {
                ...this.state.vehicle,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            vehicle: {
                ...this.state.vehicle,
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
                vehicle: {
                    ...this.state.vehicle,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.vehicle[attr_name])
            var date = new moment(this.state.vehicle[attr_name])
            var new_state = {
                ...this.state,
                vehicle: {
                    ...this.state.vehicle,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setVehicles = (state, vehicle) => {
        console.log("THIS IS STATE", state)
        var new_state = {
            ...state,
            vehicle: vehicle,
            // type_id: state.vehicle_types.
            type_id: state.vehicle_types.find(obj => obj.value == vehicle.type_id)

        }
        return new_state;
    }
    componentDidMount = () => {
        var self = this
        
        Promise.all([getVehicleTypes()]).then(([vehicle_types,]) => {
            console.log("ID", this.props.match.params.id)
            console.log("VEHICLE TYPES", vehicle_types)
            if (self.state.existing_record == true) {
                console.log("FECHING EXISTING RECORD")
                axiosInstance.get(`/partners/vehicles/${this.state.vehicle_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        vehicle_types: vehicle_types
                    }
                    new_state = self.setVehicles(new_state, response.data.vehicle)
                    self.setState({ ...new_state })
                })
            }
            else {
                self.setState({
                    ...this.state,
                    vehicle_types: vehicle_types,
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
                instance = axiosInstance.post('/partners/vehicles', { ...this.state })
            }
            else {
                
                instance = axiosInstance.put(`/partners/vehicles/${this.state.vehicle_id || this.state.vehicle.uuid}`, { vehicle: this.state.vehicle })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setVehicles(this.state, response.data.vehicle)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/partners/vehicles/${response.data.vehicle.uuid}`)
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
                        <CardTitle className='col-md-12'>New Vehicle
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/partners/vehicles/new'>New Vehicle</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                
                                <Col md={9}>
                                    <Row>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Registration</Label>
                                            <Input type="text" name="registration_number" value={this.state.vehicle.registration_number} placeholder="Vehicle Registration" onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Type</Label>
                                            <Select
                                                name="type_id"
                                                value={this.state.type_id}
                                                onChange={this.handleChangeSelect.bind(this, "type_id")}
                                                options={this.state.vehicle_types}
                                                isDisabled={this.state.readOnly}
                                            />
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Make</Label>
                                            <Input type="text" name="make" placeholder="Vehicle Make" value={this.state.vehicle.make} onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Model</Label>
                                            <Input type="text" name="model" placeholder="Vehicle Model" value={this.state.vehicle.model} onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">Color</Label>
                                            <Input type="text" name="color" placeholder="Vehicle Color" value={this.state.vehicle.color} onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                        <FormGroup className='col-md-6'>
                                            <Label for="exampleEmail">VIN</Label>
                                            <Input type="text" name="vin" placeholder="Vehicle VIN" value={this.state.vehicle.vin} onChange={this.onChange} readOnly={this.state.readOnly} />
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
