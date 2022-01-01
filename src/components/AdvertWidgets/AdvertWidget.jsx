import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectAdvertWidgets, getAdvertWidgetsTypes, getGenders, getMaritalStatuses } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
import './advert_widget.scss'
import Dropzone from 'react-dropzone'
export default class AdvertWidget extends Component {
    state = {
        advert_widget: {
            photo_id: null,
            title: '',
            content: '',
            url: "",

        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        advert_widget_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            advert_widget: {
                ...this.state.advert_widget,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            advert_widget: {
                ...this.state.advert_widget,
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
                advert_widget: {
                    ...this.state.advert_widget,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.advert_widget[attr_name])
            var date = new moment(this.state.advert_widget[attr_name])
            var new_state = {
                ...this.state,
                advert_widget: {
                    ...this.state.advert_widget,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setAdvertWidgets = (state, advert_widget) => {
        console.log("THIS IS STATE", state)
        var new_state = {
            ...state,
            advert_widget: advert_widget,
            // type_id: state.advert_widget_types.
            // parent_id: state.advert_widgets.find(obj => obj.value == advert_widget.parent_id)

        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            advert_widget: {
                ...this.state.advert_widget,
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
                        advert_widget: {
                            ...this.state.advert_widget,
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
                axiosInstance.get(`/admins/advert_widgets/${this.state.advert_widget_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                    }
                    new_state = self.setAdvertWidgets(new_state, response.data.advert_widget)
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
        axiosInstance.delete(`/admins/advert_widgets/${this.state.advert_widget_uuid}`).then(response => {
            this.props.history.push(`/appearances/advert_widgets`);
        })
    }
    handleEditorChange = (attr, val, e) => {
        console.log("EVENT", e);
        console.log("VAL", val);
        console.log("ATTR", attr);
        this.setState({
          ...this.state,
          advert_widget: {
            ...this.state.advert_widget,
            [attr]: val
          }
        })
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
                instance = axiosInstance.post('/admins/advert_widgets', { ...this.state })
            }
            else {
                
                instance = axiosInstance.put(`/admins/advert_widgets/${this.state.advert_widget_id || this.state.advert_widget.uuid}`, { advert_widget: this.state.advert_widget })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setAdvertWidgets(this.state, response.data.advert_widget)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/appearances/advert_widgets/${response.data.advert_widget.uuid}`)
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
                        <CardTitle className='col-md-12'>AdvertWidget
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/appearances/advert_widgets/new'>New AdvertWidget</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                <Row>
                    
                    <Dropzone readOnly={this.state.readOnly} onDrop={ this.readOnly ? null : this.onDrop.bind(null, "photo")}>
                                                        {({ getRootProps, getInputProps }) => (

                                                            <Col id='photoBox' {...getRootProps()} className={`${this.state.readOnly ? "" : "dropZone"}  col-md-12`} >
                                                              <input {...getInputProps()} />
                                                                
                                                                {this.state.advert_widget.photo ? <img src={this.state.advert_widget.photo.image_url} /> : null}
                                                            </Col>

                                                        )}
                                                    </Dropzone>
                  </Row>
                                <Row>
                                <FormGroup className='col-md-12'>
                                            <Label for="name">Name</Label>
                                            <Input type="text" name="name" value={this.state.advert_widget.name} placeholder="AdvertWidget Name" onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                        
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Description</Label>
                                            <Input type="textarea" name="description" value={this.state.advert_widget.description} placeholder="AdvertWidget Description" onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Link</Label>
                                            <Input type="text" name="link" value={this.state.advert_widget.link} placeholder="/sample-advert_widget-link" onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Position</Label>
                                            <Input type="text" name="position" value={this.state.advert_widget.position} placeholder="1, 2, 3..." onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                    
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Keywords</Label>
                                            <Input type="textarea" name="keywords" value={this.state.advert_widget.keywords} placeholder="AdvertWidget Keywords" onChange={this.onChange} readOnly={this.state.readOnly} />
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
