import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
} from "reactstrap";
import axios from "../../utils/AxiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
export default class PasswordEditForm extends Component {
  state = {
    username: "",
    password: "",
  };
  render() {
    return (
      <Form
        id={this.props.id}
        className="col-md-12"
        onSubmit={this.password_edit}
      >
        <FormGroup>
          <Label for="examplePassword">New Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={this.props.password}
            onChange={this.props.onChange}
            placeholder="Password"
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Confirm New Password</Label>
          <Input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            value={this.props.password_confirmation}
            onChange={this.props.onChange}
            placeholder="Password"
          />
        </FormGroup>
        <Row>
          <Col md={4}>
            <Button
              color={"success"}
              disabled={this.props.loading}
              onClick={this.props.password_edit}
              className={"form-control"}
            >
              {this.props.loading ? (
                <ScaleLoader
                  size={5}
                  height={15}
                  color={"#ffffff"}
                  loading={true}
                />
              ) : (
                "Change Password"
              )}
            </Button>
          </Col>
          <Col md={8} className="resetPassword">
            <p>
              Forgot your password?{" "}
              <Link to="/forgot_password">Reset Password</Link>
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="signup">
            <p>
              Don't have an account? <Link to="/sign_up">Sign up</Link> or{" "}
              <Link to="/confirm_email">Confirm Your Email</Link>
            </p>
          </Col>
        </Row>
      </Form>
    );
  }
}
