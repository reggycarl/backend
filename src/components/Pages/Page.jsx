import React, { Component } from 'react'
import { Card, CardTitle, CardBody, Row, Col, CardText, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap'
import Select from '../Controls/Select'
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import axiosInstance, { baseurl } from '../misc/Axios'
import SubmitButton from '../Controls/SubmitButton'
import {Link} from 'react-router-dom'
import { getIndirectPages, getPagesTypes, getGenders, getMaritalStatuses } from '../misc/functions'
import { history } from '../../index'
import NumberField from '../Controls/NumberField';
import './page.scss'
import Dropzone from 'react-dropzone';
import { Editor } from '@tinymce/tinymce-react';
export default class Page extends Component {
    state = {
        page: {
            cover_photo_id: null,
            title: '',
            content: '',
            url: "",

        },
        editing: false,
        readOnly: this.props.match.params.id != "" && this.props.match.params.id != null,
        page_uuid: this.props.match.params.id,
        existing_record: this.props.match.params.id != "" && this.props.match.params.id != null,
    }
    onChange = e => {
        console.log(e.target.name)
        this.setState({
            ...this.state,
            page: {
                ...this.state.page,
                [e.target.name]: e.target.value
            }
        }
        )
    }
    handleChangeSelect = (selectedOption, val) => {
        var state = {
            ...this.state,
            page: {
                ...this.state.page,
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
                page: {
                    ...this.state.page,
                    [attr_name]: momentdate,
                }
            };
            this.setState({ ...new_state });
        }
        else {
            console.log(this.state.page[attr_name])
            var date = new moment(this.state.page[attr_name])
            var new_state = {
                ...this.state,
                page: {
                    ...this.state.page,
                    [attr_name]: date,

                }
            };
            this.setState({ ...new_state });
        }
    }

    setPages = (state, page) => {
        console.log("THIS IS STATE", state)
        var new_state = {
            ...state,
            page: page,
            // type_id: state.page_types.
            // parent_id: state.pages.find(obj => obj.value == page.parent_id)

        }
        return new_state;
    }
    onValueChange = (e, val)=>{
        console.log(val);
        
        this.setState({
            ...this.state,
            page: {
                ...this.state.page,
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
                        page: {
                            ...this.state.page,
                            cover_photo_id:  response.data.photo.id,
                            cover_photo: response.data.photo
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
                axiosInstance.get(`/admins/pages/${this.state.page_uuid}`).then((response) => {
                    var new_state = {
                        ...this.state,
                        existing_record: true,
                        readOnly: true,
                        
                    }
                    new_state = self.setPages(new_state, response.data.page)
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
        axiosInstance.delete(`/admins/pages/${this.state.page_uuid}`).then(response => {
            this.props.history.push(`/appearances/pages`);
        })
    }
    handleEditorChange = (attr, val, e) => {
        console.log("EVENT", e);
        console.log("VAL", val);
        console.log("ATTR", attr);
        this.setState({
          ...this.state,
          page: {
            ...this.state.page,
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
                instance = axiosInstance.post('/admins/pages', { ...this.state })
            }
            else {
                
                instance = axiosInstance.put(`/admins/pages/${this.state.page_id || this.state.page.uuid}`, { page: this.state.page })
            }

            instance.then((response) => {
                console.log("RESPONSE", response)

                // console.log("Setting state")
                if (this.state.existing_record == true) {
                    var new_state = this.setPages(this.state, response.data.page)
                    console.log("THIS IS NEW STATE", new_state)
                    this.setState({ ...new_state, readOnly: true })
                }
                else {
                    this.props.history.push(`/appearances/pages/${response.data.page.uuid}`)
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
                        <CardTitle className='col-md-12'>Page
                        <ul>
                            <li><Link className='btn btn-success btn-sm' to='/appearances/pages/new'>New Page</Link></li>
                        </ul></CardTitle>
                        <CardText className='col-md-12'>
                            <Form className='row'>
                                <Col md={12}>
                                <Row>
                    
                    <Dropzone readOnly={this.state.readOnly} onDrop={ this.readOnly ? null : this.onDrop.bind(null, "photo")}>
                                                        {({ getRootProps, getInputProps }) => (

                                                            <Col id='photoBox' {...getRootProps()} className={`${this.state.readOnly ? "" : "dropZone"}  col-md-12`} >
                                                              <input {...getInputProps()} />
                                                                
                                                                {this.state.page.cover_photo ? <img src={this.state.page.cover_photo.image_url} /> : null}
                                                            </Col>

                                                        )}
                                                    </Dropzone>
                  </Row>
                                <Row>
                                <FormGroup className='col-md-12'>
                                            <Label for="name">Title</Label>
                                            <Input type="text" name="title" value={this.state.page.title} placeholder="Page Title" onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                        
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Content</Label>
                                            <Editor
                          initialValue={this.state.page.content}
                          apiKey="gf24erovj899rh2ynuu6qrkowdve3c4pih2o7l9a06rgfl5d"
                          value={this.state.page.content}
                          disabled={this.state.readOnly}
                          name="content"
                          init={{
                            height: 600,
                            menubar: false,
                            plugins: [
                              "advlist autolink lists link image charmap print preview anchor",
                              "searchreplace visualblocks code fullscreen",
                              "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar:
                              "undo redo | formatselect | bold italic underline | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help",
                          }}
                          onEditorChange={this.handleEditorChange.bind(this, 
                            "content"
                          )}
                        />
                                        </FormGroup>
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Link</Label>
                                            <Input type="text" name="url" value={this.state.page.url} placeholder="sample-page-url" onChange={this.onChange} readOnly={this.state.readOnly} />
                                        </FormGroup>
                                    
                                        <FormGroup className='col-md-12'>
                                            <Label for="name">Keywords</Label>
                                            <Input type="textarea" name="keywords" value={this.state.page.keywords} placeholder="Page Keywords" onChange={this.onChange} readOnly={this.state.readOnly} />
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
