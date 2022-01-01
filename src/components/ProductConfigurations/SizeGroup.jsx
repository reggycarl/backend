import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'


import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectSizeGroups, getSizeGroupsTypes, getGenders, getMaritalStatuses, getCategories } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
import './sizegroups.scss'
import Dropzone from 'react-dropzone';
export default class SizeGroup extends Component {
    state = {
        size_group: {
            photo_id: null,
            description: '',
            link: ''
        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        size_group_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            size_group: {
                ...this.state.size_group,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            size_group: {
                ...this.state.size_group,
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
                size_group: {
                    ...this.state.size_group,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.size_group[attr_name])
            var date = new moment(this.state.size_group[attr_name])
            var new_state = {
                ...this.state,
                size_group: {
                    ...this.state.size_group,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setSizeGroups = (state, size_group) => {
        
        var new_state = {
            ...state,
            size_group: size_group,
            
            
        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            size_group: {
                ...this.state.size_group,
                [e]: val.floatValue
            }
        })
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            size_group: {
                ...this.state.size_group,
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
                        size_group: {
                            ...this.state.size_group,
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
                axiosInstance.get(`/admins/size_groups/${this.state.size_group_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                        
                    }
                    new_state = self.setSizeGroups(new_state, response.data.size_group)
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
                instance = axiosInstance.post('/admins/size_groups', { size_group: this.state.size_group })
            }
            else {
                
                instance = axiosInstance.put(`/admins/size_groups/${this.state.size_group_id || this.state.size_group.uuid}`, { size_group: this.state.size_group })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setSizeGroups(this.state, response.data.size_group)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/product_configurations/size_groups/${response.data.size_group.uuid}`)
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
                        <CardTitle className='col-md-12'>SizeGroup
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/product_configurations/size_groups/new'>New SizeGroup</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                    
                                <Row>
                                
                                                    <Col md={12}>
                                                    <Row>
                                                   
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.size_group.name} placeholder="SizeGroup Name" onChange={this.onChange} readOnly={this.state.readOnly} /> 
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
