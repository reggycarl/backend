import React, { Component } from "react";
import "./Login.scss";
import PartnerLoginForm from "./PartnerLoginForm";

import { LOGIN } from "../../actions";
import axios from "axios";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import qs from "query-string";
import { Redirect } from "react-router-dom";

import AuthLayout from "../Layout/AuthLayout";

import { Col, Button, Row } from "reactstrap";
import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };
  componentDidMount = () => {
    console.log(this.props);
    const params = new URLSearchParams(window.location.search);
    var show_confirmed = false;
    if (params.has("account_confirmation_success")) {
      show_confirmed =
        params.get("account_confirmation_success") == "true" ? true : false;
    }

    this.setState({
      ...this.state,
      show_confirmed: show_confirmed,
    });
  };

  onChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };
  login = (e) => {
    e.preventDefault();
    console.log("LOGGINSING");
    this.props.actions.partner_login(this.state.email, this.state.password);
  };

  render() {
    return (
      <AuthLayout>
        {this.state.show_confirmed ? (
          this.showConfirmed()
        ) : (
          <div className="col-md-4 col-sm-4 authDiv">
            <div className="col-md-12 header">
              <h2>Partner Login</h2>
              {!_.isEmpty(this.props.authentication.loginErrorMessage) ? (
                <div class="alert alert-danger " role="alert">
                  {this.props.authentication.loginErrorMessage}{" "}
                </div>
              ) : (
                ""
              )}
            </div>
            <Col md={12}>
              <PartnerLoginForm
                id="loginBox"
                {...this.state}
                loading={this.props.authentication.loading}
                onChange={this.onChange}
                login={this.login}
              />
            </Col>

            {/* <Col md={6}>

                        </Col> */}
          </div>
        )}
      </AuthLayout>
    );
  }

  showConfirmed() {
    return (
      <div className="row">
        <div className="col-md-12 header">
          <h2>Account Successfully Confirmed</h2>
        </div>
        <Col md={12}>
          <p>Click on the button below to login to your account</p>
          {/* <Button color='success'>Login</Button> */}
          <Link
            to="/"
            className="btn btn-success"
            onClick={() => {
              window.location.replace(
                window.location.protocol + "//" + window.location.host
              );
            }}
          >
            Login
          </Link>
        </Col>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
