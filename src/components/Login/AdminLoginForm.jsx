import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';
import axios from '../../utils/AxiosInstance'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import ScaleLoader from 'react-spinners/ScaleLoader'
export default class LoginForm extends Component {
    constructor(props){
        super(props)
        this.state = {
        AdminPassword:false,
        }
    }
    state = {
        username: "",
        password: "",
    }


    render() {



        return (
            <Form id={this.props.id} className='col-md-12' onSubmit={this.props.login}>
                <FormGroup className="col-md-12 input-group with-focus margin-top-10">
                    <Label for="exampleEmail" className="input-group">Email</Label>
                          <i className="input-group-text bg-transparent">
                            <FaEnvelope />
                          </i>
                    <Input type="username" name="email" value={this.props.email} onChange={this.props.onChange} id="username" placeholder="Username / Email" />
                </FormGroup>
                <FormGroup className="col-md-12 input-group with-focus margin-top-10">

                    <Label for="examplePassword" className="input-group">Password</Label>
                    <i className="input-group-text bg-transparent">
                            <FaLock/>
                          </i>
                    <Input type={this.state.AdminPassword ? "text" : "password"} name="password" id="password" value={this.props.password} onChange={this.props.onChange} placeholder="Password" />
                    <i
                          className="input-group-text bg-transparent"
                          onClick={() =>
                            this.setState({
                                AdminPassword: !this.state.AdminPassword,
                            })
                          }
                        >
                          {this.state.AdminPassword ? <FaEye /> : <FaEyeSlash />}
                        </i>
                </FormGroup>
                <Row>
                    <Col md={12}>
                        <Button type="submit" color={"success"} disabled={this.props.loading} onClick={this.props.login} className={"form-control"}>{this.props.loading ? <ScaleLoader size={5} height={15} color={"#ffffff"} loading={true}/> : "Login" }</Button>
                    </Col>
                    
                </Row>
                
            </Form>
        )
    }
}
