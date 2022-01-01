import React, { Component } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  CardText,
  Form,
  FormGroup,
  Input,
  Label,
  FormText,
  Button,
} from "reactstrap";
import Select from "../Controls/Select";

import moment from "moment";
import axiosInstance, { baseurl } from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link, withRouter } from "react-router-dom";
import { getCompanies } from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
// import "./admins.scss";
import Dropzone from "react-dropzone";
import PhoneInput from "react-phone-input-2";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Toggle from "react-toggle";
import "react-toggle/style.css";
class Admin extends Component {
  state = {
    admin: {
      first_name: null,
      last_name: "",
      email: "",
      phone: "",
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    admin_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      admin: {
        ...this.state.admin,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      admin: {
        ...this.state.admin,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };
  onDateChanged = (momentdate, attr_name) => {
    // console.log("ClassName is", momentdate.constructor.name)
    var new_date = new moment();
    if (momentdate.constructor.name == new_date.constructor.name) {
      var new_state = {
        ...this.state,
        admin: {
          ...this.state.admin,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.admin[attr_name]);
      var date = new moment(this.state.admin[attr_name]);
      var new_state = {
        ...this.state,
        admin: {
          ...this.state.admin,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setAdmin = (state, admin) => {
    var new_state = {
      ...state,
      admin: admin,
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      admin: {
        ...this.state.admin,
        [e]: val.floatValue,
      },
    });
  };
  onPhoneChange = (phone) => {
    this.setState({
      ...this.state,
      admin: {
        ...this.state.admin,
        phone: phone,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      admin: {
        ...this.state.admin,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };
  onDrop = (name, acceptedFiles) => {
    console.log(name);
    console.log(acceptedFiles);
    if (this.state.readOnly != true) {
      acceptedFiles.map((file, i) => {
        var formData = new FormData();
        formData.append("file", file);
        axiosInstance.post("/photos", formData).then((response) => {
          this.setState({
            ...this.state,
            admin: {
              ...this.state.admin,
              photo_id: response.data.photo.id,
              photo: response.data.photo,
            },
          });
        });
      });
    }
  };
  componentDidMount = () => {
    var self = this;
    var link = "/admins/admins/";

    // Promise.all([getCompanies()]).then(([companies]) => {
    console.log("ID", this.props.match.params.id);
    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance.get(`${link}${this.state.admin_uuid}`).then((response) => {
        var new_state = {
          ...this.state,
          existing_record: true,
          readOnly: true,
        };
        new_state = self.setAdmin(new_state, response.data.admin);
        self.setState({ ...new_state });
      });
    } else {
      self.setState({
        ...this.state,
      });
    }

    // })
  };
  reset_password = (e) => {
    e.preventDefault();
    var link = `/admins/admins/${this.state.admin_uuid}/reset_password`;
    axiosInstance.post(link).then((response) => {
      console.log(response);
    });
  };

  onSubmit = (e) => {
    var link = "/admins/admins/";
    e.preventDefault();
    var self = this;
    if (self.state.readOnly == true && self.state.existing_record == true) {
      self.setState({
        ...self.state,
        readOnly: false,
      });
    } else {
      var instance;
      if (self.state.existing_record != true) {
        instance = axiosInstance.post(`${link}`, {
          admin: this.state.admin,
        });
      } else {
        instance = axiosInstance.put(
          `${link}${
            this.state.admin_id ||
            this.state.admin_uuid ||
            this.state.admin.uuid
          }`,
          { admin: this.state.admin }
        );
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setAdmin(this.state, response.data.admin);
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `/admins/settings/admins/${response.data.admin.uuid}`
          );
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  };
  handleChangeToggle = (component) => {
    this.setState({
      ...this.state,
      admin: {
        ...this.state.category,
        [component.target.id]: component.target.checked,
      },
    });
  };

  render() {
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle className="col-md-12">
              Admins
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/admins/settings/admins/new"
                  >
                    New Admin
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="row">
                <Col md={12}>
                  <Row>
                    <Col md={12}>
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="name">First Name</Label>
                          <Input
                            type="text"
                            name="first_name"
                            value={this.state.admin.first_name}
                            placeholder="First Name"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-6">
                          <Label for="name">Last Name</Label>
                          <Input
                            type="text"
                            name="last_name"
                            value={this.state.admin.last_name}
                            placeholder="Last Name"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="name">Email</Label>
                          <Input
                            type="text"
                            name="email"
                            value={this.state.admin.email}
                            placeholder="admin@email.com"
                            onChange={this.onChange}
                            readOnly={
                              this.state.readOnly || this.state.existing_record
                            }
                          />
                        </FormGroup>
                        <FormGroup className="col-md-6">
                          <Label for="name">Phone</Label>
                          <PhoneInput
                            country={"gh"}
                            value={this.state.admin.phone}
                            disabled={this.state.readOnly}
                            readOnly={this.state.readOnly}
                            countryCodeEditable={false}
                            disableDropdown={true}
                            className="test-class"
                            onChange={(phone) => this.onPhoneChange(phone)}
                          />
                        </FormGroup>
                      </Row>
                      <Row></Row>
                    </Col>
                  </Row>

                  <Row>
                    <FormGroup className="col-md-2">
                      <Label for="sale-price">Full Access</Label>
                      <Col md={12} className="block">
                        <Row>
                          <Toggle
                            id="full_access"
                            defaultChecked={this.state.admin.full_access}
                            checked={this.state.admin.full_access}
                            disabled={this.state.readOnly}
                            onChange={this.handleChangeToggle}
                          />
                        </Row>
                      </Col>
                    </FormGroup>
                  </Row>
                </Col>

                <Col md={12}>
                  {/* <Row> */}
                  <SubmitButton
                    onClick={this.onSubmit}
                    readOnly={this.state.readOnly}
                    editing={this.state.editing}
                    existing_record={this.state.existing_record}
                  />
                  &nbsp;
                  {this.state.readOnly && this.state.existing_record ? (
                    <Button
                      onClick={this.reset_password}
                      readOnly={this.state.readOnly}
                      editing={this.state.editing}
                      existing_record={this.state.existing_record}
                    >
                      Reset Password{" "}
                    </Button>
                  ) : (
                    " "
                  )}
                </Col>
              </Form>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Admin));
