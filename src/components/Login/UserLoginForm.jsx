import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';
import axios from '../../utils/AxiosInstance'
import { Link } from 'react-router-dom'
import ScaleLoader from 'react-spinners/ScaleLoader'
export default class LoginForm extends Component {
    state = {
        username: "",
        password: "",
    }

    render() {



        return (
            <Form id={this.props.id} className='col-md-12' onSubmit={this.props.login}>
                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input type="username" name="email" value={this.props.email} onChange={this.props.onChange} id="username" placeholder="Username / Email" />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="password" name="password" id="password" value={this.props.password} onChange={this.props.onChange} placeholder="Password" />
                </FormGroup>
                <Row>
                    <Col md={4}>
                        <Button type="submit" color={"success"} disabled={this.props.loading} onClick={this.props.login} className={"form-control"}>{this.props.loading ? <ScaleLoader size={5} height={15} color={"#ffffff"} loading={true}/> : "Login" }</Button>
                    </Col>
                    <Col md={8} className="resetPassword">
                        <p>Forgot your password? <Link to='/users/forgot_password'>Reset Password</Link></p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="signup">
                        <p>Don't have an account? <Link to='/users/sign_up'>Sign up</Link> or  <Link to='/users/confirm_email'>Confirm Your Email</Link></p>
                    </Col>

                </Row>
            </Form>
        )
    }
}
