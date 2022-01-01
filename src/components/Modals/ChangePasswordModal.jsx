import React from "react";
import { FaSearch } from "react-icons/fa";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Input } from "reactstrap";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import Axios from "axios";
import { Link, withRouter } from "react-router-dom";

import axiosInstance, { baseurl } from "../misc/Axios";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Alert from "reactstrap/lib/Alert";
import _ from "lodash";
class ChangePasswordModal extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.isOpen,
      size_groups: [],
      account: {
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      },
    };

    this.toggle = this.toggle.bind(this);
  }

  onChange = (e) => {
    this.setState({
      ...this.state,
      account: {
        ...this.state.account,
        [e.target.name]: e.target.value,
      },
    });
  };
  changePassword = () => {
    axiosInstance.baseurl = baseurl;
    axiosInstance
      .put(
        baseurl +
          `${
            this.props.authentication.default_path == "/admins/"
              ? "/management"
              : "/partners"
          }/password`,
        {
          // current_password: this.state.account.current_password,
          password_confirmation: this.state.account.new_password_confirmation,
          password: this.state.account.new_password,
        }
      )
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log("THIS IS ERROR", error.response.data);
          this.setState({
            ...this.state,
            errors: error.response.data.errors,
          });
        }
      );
  };
  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          modalTransition={{ timeout: 100 }}
          backdropTransition={{ timeout: 100 }}
          size={"lg"}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>
            Change My Password
          </ModalHeader>
          <ModalBody>
            {!_.isEmpty(this.state.errors) ? (
              <Col md={12}>
                <Alert color="danger">
                  <h6>The Following Error Occurred</h6>
                  <ul>
                    {this.state.errors.map((err) => {
                      return <li>{err}</li>;
                    })}
                  </ul>
                </Alert>
              </Col>
            ) : (
              ""
            )}
            <form className="form-horizontal" onSubmit={this.onSubmit}>
              {/* <FormGroup className="col-md-12">
                <Label>Current Password</Label>

                <Input
                  type="password"
                  name="current_password"
                  placeholder="Current Password"
                  onChange={this.onChange}
                  value={this.state.account.current_password}
                  readOnly={this.state.readonly}
                />
              </FormGroup> */}
              <FormGroup className="col-md-12">
                <Label>New Password</Label>
                <Input
                  type="password"
                  name="new_password"
                  placeholder="New Password"
                  onChange={this.onChange}
                  value={this.state.account.new_password}
                  readOnly={this.state.readonly}
                />
              </FormGroup>
              <FormGroup className="col-md-12">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  name="new_password_confirmation"
                  placeholder="Confirm New Password"
                  onChange={this.onChange}
                  value={this.state.account.new_password_confirmation}
                  readOnly={this.state.readonly}
                />
              </FormGroup>
              <Col md={12}>
                <Button
                  className="form-control"
                  color="success"
                  onClick={this.changePassword}
                >
                  Change Password
                </Button>
              </Col>
            </form>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" className onClick={this.props.toggle.bind(this.props.parentForm)}>OK</Button>{' '} */}
            <Button
              color="secondary"
              onClick={this.props.toggle.bind(this.props.parentForm)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChangePasswordModal)
);
