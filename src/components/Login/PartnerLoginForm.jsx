import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';
import axios from '../../utils/AxiosInstance'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { Link } from 'react-router-dom'
import ScaleLoader from 'react-spinners/ScaleLoader'
export default class LoginForm extends Component {
    constructor(props){
        super(props)
        this.state = {
        PatnerPassword:false,
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
                    <Input type={this.state.PatnerPassword ? "text" : "password"} name="password" id="password" value={this.props.password} onChange={this.props.onChange} placeholder="Password" />
                    <i
                          className="input-group-text bg-transparent"
                          onClick={() =>
                            this.setState({
                                PatnerPassword: !this.state.PatnerPassword,
                            })
                          }
                        >
                          {this.state.PatnerPassword ? <FaEye /> : <FaEyeSlash />}
                        </i>
                </FormGroup>
                <Row>
                    <Col md={4}>
                        <Button type="submit" color={"success"} disabled={this.props.loading} onClick={this.props.login} className={"form-control"}>{this.props.loading ? <ScaleLoader size={5} height={15} color={"#ffffff"} loading={true}/> : "Login" }</Button>
                    </Col>
                    <Col md={8} className="resetPassword">
                        <p>Forgot your password? <Link to='/partners/forgot_password'>Reset Password</Link></p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="signup">
                        <p>Don't have an account? <Link to='/partners/sign_up'>Sign up</Link> or  <Link to='/partners/confirm_email'>Confirm Your Email</Link></p>
                    </Col>

                </Row>
            </Form>
        )
    }
}
