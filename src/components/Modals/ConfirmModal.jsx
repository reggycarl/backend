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
class ConfirmModal extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.isOpen,
    };
    this.toggle = this.toggle.bind(this);
  }

  onChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };
  confirm = () => {
    // axiosInstance.baseurl = baseurl;
    axiosInstance
      .put(baseurl + `/v1/${this.props.action_url}`, {
        notes: this.state.notes,
      })
      .then(
        (response) => {
          console.log(response);
          this.props.setObject(response.data);
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
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.props.toggle.bind(this.props.parentForm)}>
            Confirm {this.props.object_name}
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
                <Label>Confirmed by</Label>
                <Input
                  type="text"
                  name="reason"
                  placeholder="Confirmed By"
                  value={`${this.props.authentication.user.first_name} ${this.props.authentication.user.last_name}`}
                  readOnly={true}
                />
              </FormGroup>
              <FormGroup className="col-md-12">
                <Label>Confirmation Notes</Label>
                <Input
                  type="textarea"
                  rows={5}
                  name="notes"
                  placeholder="Confirmation Notes"
                  onChange={this.onChange}
                  value={this.state.notes}
                  readOnly={this.state.readonly}
                />
              </FormGroup>
              <Col md={12}>
                <Button
                  className="form-control"
                  color="success"
                  onClick={this.confirm}
                >
                  Confirm {this.props.object_name}
                </Button>
              </Col>
            </form>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" className onClick={this.props.toggle.bind(this.props.parentForm)}>OK</Button>{' '} */}
            {/* <Button
              color="secondary"
              onClick={this.props.toggle.bind(this.props.parentForm)}
            >
              Cancel
            </Button> */}
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
  connect(mapStateToProps, mapDispatchToProps)(ConfirmModal)
);
