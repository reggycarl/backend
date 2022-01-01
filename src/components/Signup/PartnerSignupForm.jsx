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
import "react-phone-input-2/lib/style.css";
import Toggle from "react-toggle";
import { FRONTENDURL } from "../misc/Axios";
import "react-toggle/style.css";
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

            {this.props.partner_type_id == 2 ? (
              <Row>
                <FormGroup className="col-md-12">
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
              </Row>
            ) : (
              ""
            )}
            <Row>
              <FormGroup className="col-md-6">
                <Label for="phone">Phone</Label>
                {/* <InputGroup>
                                <div class="input-group-prepend">
                                    <span class="input-group-text">{this.props.selected_company_country_id ? this.props.selected_company_country_id.phone_code : "---"  }</span>
                                </div>
                                <Input type="text" name="phone" id="phone" value={this.props.phone} onChange={this.props.onChange} placeholder="Your Phone Number" />
                                </InputGroup> */}
                <PhoneInput
                  country={"gh"}
                  value={this.props.phone}
                  onChange={(phone) => this.props.onPhoneChange(phone)}
                />
              </FormGroup>
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
            </Row>
            {/* <Row>
                            <FormGroup className='col-md-6'>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" id="username" value={this.props.username} onChange={this.props.onChange} placeholder="Your Prefered Username" />
                            </FormGroup>
                        </Row> */}
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
          <Col md={1}>
            <Toggle
              id="steaman_commerce_partner_terms"
              name="steaman_commerce_partner_terms"
              checked={this.props.steaman_commerce_partner_terms}
              onChange={this.props.handleChangeToggle}
            />
          </Col>
          <Col md={10}>
            <p>
              I Accept Steaman's Partner Terms and Conditions{" "}
              <a href={`${FRONTENDURL}/content/partner-terms`} target="_blank">
                View Terms
              </a>
            </p>
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
              Alreay have an account? <Link to="/partners/">Login</Link>
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
