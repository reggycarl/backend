import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectMainSliders, getMainSlidersTypes, getGenders, getMaritalStatuses } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
import './main_slider.scss'
import Dropzone from 'react-dropzone';
export default class MainSlider extends Component {
    state = {
        main_slider: {
            photo_id: null,
            description: '',
            link: ''

        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        main_slider_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            main_slider: {
                ...this.state.main_slider,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            main_slider: {
                ...this.state.main_slider,
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
                main_slider: {
                    ...this.state.main_slider,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.main_slider[attr_name])
            var date = new moment(this.state.main_slider[attr_name])
            var new_state = {
                ...this.state,
                main_slider: {
                    ...this.state.main_slider,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setMainSliders = (state, main_slider) => {
        console.log("THIS IS STATE", state)
        var new_state = {
            ...state,
            main_slider: main_slider,
            // type_id: state.main_slider_types.
            // parent_id: state.main_sliders.find(obj => obj.value == main_slider.parent_id)

        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            main_slider: {
                ...this.state.main_slider,
                [e]: val.floatValue
            }
        })
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
                        main_slider: {
                            ...this.state.main_slider,
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
        
        // Promise.all().then(() => {
            console.log("ID", this.props.match.params.id)
            
            if (self.state.existing_record == true) {
                console.log("FECHING EXISTING RECORD")
                axiosInstance.get(`/admins/main_sliders/${this.state.main_slider_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                    }
                    new_state = self.setMainSliders(new_state, response.data.main_slider)
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
    delete = (e) => {
        e.preventDefault();
        axiosInstance.delete(`/admins/main_sliders/${this.state.main_slider_uuid}`).then(response => {
            this.props.history.push(`/appearances/main_sliders`);
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
                instance = axiosInstance.post('/admins/main_sliders', { ...this.state })
            }
            else {
                
                instance = axiosInstance.put(`/admins/main_sliders/${this.state.main_slider_id || this.state.main_slider.uuid}`, { main_slider: this.state.main_slider })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setMainSliders(this.state, response.data.main_slider)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/appearances/main_sliders/${response.data.main_slider.uuid}`)
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
                        <CardTitle className='col-md-12'>MainSlider
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/appearances/main_sliders/new'>New MainSlider</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                <Row>
                    
                    <Dropzone readOnly={this.state.readOnly} onDrop={ this.readOnly ? null : this.onDrop.bind(null, "photo")}>
                                                        {({ getRootProps, getInputProps }) => (

                                                            <Col id='photoBox' {...getRootProps()} className={`${this.state.readOnly ? "" : "dropZone"}  col-md-12`} >
                                                              <input {...getInputProps()} />
                                                                
                                                                {this.state.main_slider.photo ? <img src={this.state.main_slider.photo.image_url} /> : null}
                                                            </Col>

                                                        )}
                                                    </Dropzone>
                  </Row>
                                <Row>
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Description</Label>
                                            <Input type="textarea" name="description" value={this.state.main_slider.description} placeholder="Slider Description" onChange={this.onChange} readOnly={this.state.readOnly} /> 
                                        </FormGroup>
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Link</Label>
                                            <Input type="text" name="link" value={this.state.main_slider.link} placeholder="Slider Link" onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                    
                                    
                                        </Row>
                                    <Row>
                                        
                                        
                                    </Row>
                                    
                                    
                                    
                                
                                </Col>
                                
                                <Col md={12}>
                                    {/* <Row> */}
                                        <SubmitButton onClick={this.onSubmit} readOnly={this.state.readOnly} editing={this.state.editing} existing_record={this.state.existing_record} />
                                    {/* </Row> */}
                                    &nbsp;
                                    {this.state.readOnly ? <Button color='danger' onClick={this.delete}>
                                                                Delete
                                    </Button>: ""}
                                </Col>
                            </Form>
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
