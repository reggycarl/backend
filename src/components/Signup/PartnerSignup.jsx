import React, { Component } from "react";
import AuthLayout from "../Layout/AuthLayout";
import _ from "lodash";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PartnerSignupForm from "./PartnerSignupForm";

import { Col } from "reactstrap";

import { renderErrorsAsList, getPatnerTypes } from "../misc/functions";
class ForgotPassword extends Component {
  onChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };
  onPhoneChange = (phone) => {
    this.setState({
      ...this.state,
      phone: phone,
    });
  };

  handleChangeToggle = (component) => {
    console.log("TOGGLEING", component.target.name);
    this.setState({
      ...this.state,
      [component.target.name]: component.target.checked,
    });
  };
  selected_country_id = "selected_country_id";
  state = {
    username: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    company_name: "",
    company_country_id: "",
    phone: "",
    partner_type_id: 2,
    selected_partner_type_id: "",
    steaman_commerce_partner_terms: false,
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      [selectedOption]: val.value,
      [`selected_${selectedOption}`]: val,
    };
    this.setState({ ...state });
  };
  componentDidMount = () => {
    getPatnerTypes().then((response) => {
      console.log("THIS IS THE DATA FOR PARTNER TYPES", response);
      this.setState({
        ...this.state,
        partner_types: response,
      });
    });
  };
  signup = (e) => {
    e.preventDefault();
    this.props.actions.partner_signup(
      this.state.first_name,
      this.state.last_name,
      this.state.username,
      this.state.email,
      this.state.phone,
      this.state.company_name,
      this.state.password,
      this.state.password_confirmation,
      this.state.partner_type_id,
      this.state.steaman_commerce_partner_terms
    );
  };
  render() {
    return (
      <AuthLayout>
        <div className="row authDiv">
          <div className="col-md-12 header">
            <h2 className="col-md-12">
              {" "}
              {!_.isEmpty(this.props.authentication.signupSuccessMessage)
                ? "Account Succesfully Created"
                : "Create a Partner Account"}
            </h2>

            {!_.isEmpty(this.props.authentication.signupErrorMessage) ? (
              <Col md={12}>
                <div class="alert alert-danger " role="alert">
                  {" "}
                  <p>The Following errors occured during signup</p>{" "}
                  {renderErrorsAsList(
                    this.props.authentication.signupErrorMessage
                  )}
                </div>
              </Col>
            ) : (
              ""
            )}
            {!_.isEmpty(this.props.authentication.signupSuccessMessage) ? (
              <div class="alert alert-success " role="alert">
                {" "}
                <p>{this.props.authentication.signupSuccessMessage} </p>{" "}
              </div>
            ) : (
              ""
            )}
          </div>
          <Col md={12}>
            {!_.isEmpty(this.props.authentication.signupSuccessMessage) ? (
              ""
            ) : (
              <PartnerSignupForm
                id="SignupBox"
                {...this.state}
                onPhoneChange={this.onPhoneChange}
                handleChangeToggle={this.handleChangeToggle}
                onChange={this.onChange}
                signup={this.signup}
                handleChangeSelect={this.handleChangeSelect}
                countries={this.state.countries}
              />
            )}
          </Col>
        </div>
      </AuthLayout>
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
