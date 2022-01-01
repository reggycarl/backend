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
  InputGroup,
} from "reactstrap";
import axios from "../../utils/AxiosInstance";
import { Link } from "react-router-dom";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Select from "../Controls/Select";
import ScaleLoader from "react-spinners/ScaleLoader";
import PhoneInput from "react-phone-input-2";
class SignupForm extends Component {
  state = {
    username: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    company_name: "",
    phone: "",
  };

  render() {
    return (
      <Form id={this.props.id} className="col-md-12">
        <Row>
          <Col md={12}>
            <Row>
              <FormGroup className="col-md-6">
                <Label for="exampleEmail">First Name</Label>
                <Input
                  type="text"
                  name="first_name"
                  value={this.props.first_name}
                  onChange={this.props.onChange}
                  id="first_name"
                  placeholder="Your First Name"
                />
              </FormGroup>

              <FormGroup className="col-md-6">
                <Label for="last_name">Last Name</Label>
                <Input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={this.props.last_name}
                  onChange={this.props.onChange}
                  placeholder="Your Last Name"
                />
              </FormGroup>
            </Row>
            <Row>
              {/* <FormGroup className="col-md-6">
                <Label for="exampleEmail">Account Type</Label>
                <Select
                  name="country_id"
                  value={this.props.selected_account_type_id}
                  onChange={this.props.handleChangeSelect.bind(
                    this,
                    "account_type_id"
                  )}
                  options={this.props.account_types}
                  isDisabled={this.state.readOnly}
                />
              </FormGroup> */}
              {this.props.account_type_id == 2 ? (
                <FormGroup className="col-md-6">
                  <Label for="exampleEmail">Company Name</Label>
                  <Input
                    type="text"
                    name="company_name"
                    value={this.props.company_name}
                    onChange={this.props.onChange}
                    id="company_name"
                    placeholder="Your Company Name"
                  />
                </FormGroup>
              ) : (
                ""
              )}
            </Row>
            <Row>
              <FormGroup className="col-md-6">
                <Label for="exampleEmail">Email</Label>
                <Input
                  type="username"
                  name="email"
                  value={this.props.email}
                  onChange={this.props.onChange}
                  id="email"
                  placeholder="Your Email"
                />
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label for="phone">Phone</Label>

                <PhoneInput
                  country={"gh"}
                  value={this.props.phone}
                  countryCodeEditable={false}
                  // disableCountryCode={true}
                  disableDropdown={true}
                  className="test-class"
                  onChange={(phone) => this.props.onPhoneChange(phone)}
                />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup className="col-md-6">
                <Label for="exampleEmail">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={this.props.password}
                  onChange={this.props.onChange}
                  id="password"
                  placeholder="Your Password"
                />
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label for="examplePassword">Confirm Password</Label>
                <Input
                  type="password"
                  name="password_confirmation"
                  id="password_confirmation"
                  value={this.props.password_confirmation}
                  onChange={this.props.onChange}
                  placeholder="Confirm Your Password"
                />
              </FormGroup>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Button
              color={"success"}
              onClick={this.props.signup}
              disabled={this.props.authentication.signing_up}
              className={"form-control"}
            >
              {" "}
              {this.props.authentication.signing_up ? (
                <ScaleLoader
                  size={5}
                  height={15}
                  color={"#ffffff"}
                  loading={true}
                />
              ) : (
                "Create My Account"
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
              Alreay have an account? <Link to="/users">Login</Link>
            </p>
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
