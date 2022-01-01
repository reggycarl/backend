import React from "react";
import { FaSearch } from "react-icons/fa";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Input } from "reactstrap";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import Axios from "axios";
import { Link, withRouter } from "react-router-dom";
import Select from "../Controls/Select";
import { getOrderStatuses } from "../misc/functions";
import axiosInstance, { baseurl } from "../misc/Axios";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Alert from "reactstrap/lib/Alert";
import _ from "lodash";
class ChangeStatusModal extends React.Component {
  state = {
    order_statuses: [],
    order: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.isOpen,
    };
    this.toggle = this.toggle.bind(this);
  }
  handleChangeSelect = (selectedOption, val) => {
    this.setState({
      ...this.state,
      order: {
        ...this.state.order,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    })
  }

  onChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };
  cancel = () => {
    axiosInstance.baseurl = baseurl;
    axiosInstance
      .delete(baseurl + `${this.props.action_url}?reason=${this.state.reason}`)
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
  changeStatus = e => {
    e.preventDefault();
    this.props.changeStatus(this.state.order.status_id)
  }
  
  componentDidMount = () => {
    getOrderStatuses().then((response) => {
      console.log("THESE ARE RESPONSES", response);
      this.setState({
        ...this.state,
        order_statuses: response,
      });
    });
  };

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
            Change Order Status
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
                <Label>Status</Label>
              </FormGroup>
              <Col md={12}>
                <Select
                  name="country_id"
                  value={this.state.status_id}
                  onChange={this.handleChangeSelect.bind(this, "status_id")}
                  options={this.state.order_statuses}
                  isDisabled={this.state.readOnly}
                />
              </Col>
              &nbsp;
              <Col md={12}>
                <Button
                  className="form-control"
                  color="success"
                  onClick={this.changeStatus}
                  disabled ={!(this.state.order && this.state.order.status_id != null) || this.props.changingStatus}
                >
                  Change Status
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
  connect(mapStateToProps, mapDispatchToProps)(ChangeStatusModal)
);
