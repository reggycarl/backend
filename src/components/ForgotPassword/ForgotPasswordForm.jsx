import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';
import axios from '../../utils/AxiosInstance'
import { Link } from 'react-router-dom'
import ScaleLoader from 'react-spinners/ScaleLoader'
export default class LoginForm extends Component {
    

    

    render() {

        return (
            <Form id={this.props.id} className='col-md-12'>
                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input type="username" name="email" value={this.props.email} onChange={this.props.onChange} id="email" placeholder="Your Email Address" />
                </FormGroup>

                <Row>
                    <Col md={4}>
                        <Button color={"success"} onClick={this.props.confirm == true ? this.props.confirmEmail : this.props.resetPassword} className={"form-control"} disabled={this.props.confirming || this.props.resetting}> {this.props.confirming || this.props.resetting ?  <ScaleLoader size={5} height={15} color={"#ffffff"} loading={true}/> : (this.props.confirm ? "Confirm Email" :"Reset Password" ) }</Button>
                    </Col>
                    <Col md={4}>
                        <Link to='/' className="btn btn-secondary form-control"  >Cancel</Link>
                    </Col>

                </Row>
                <Row>
                    <Col md={12} className="signup">
                        <p>Don't have an account? <Link to='/sign_up'>Sign up</Link></p>
                    </Col>

                </Row>
            </Form>
        )
    }
}
