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
import { Link , withRouter} from "react-router-dom";
import {
  getCompanies,
  
} from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import "./users.scss";
import Dropzone from "react-dropzone";
import PhoneInput from "react-phone-input-2";
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
class User extends Component {
  state = {
    user: {
      photo_id: null,
      description: "",
      link: "",
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    user_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      user: {
        ...this.state.user,
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
        user: {
          ...this.state.user,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.user[attr_name]);
      var date = new moment(this.state.user[attr_name]);
      var new_state = {
        ...this.state,
        user: {
          ...this.state.user,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setUser = (state, user) => {
    var new_state = {
      ...state,
      user: user,
      company_id: state.companies.find(
        (obj) => obj.value == user.company_id
      ),
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      user: {
        ...this.state.user,
        [e]: val.floatValue,
      },
    });
  };
  onPhoneChange = phone => {
    this.setState({
        ...this.state,
        user: {
            ...this.state.user,
            phone: phone
        }
        
    })
}
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      user: {
        ...this.state.user,
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
            user: {
              ...this.state.user,
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
    var link = this.props.authentication.default_path == "/partners/" ? "/partners/users/" : "/admins/partners/users/"
    Promise.all([getCompanies(this.props.authentication.default_path == "/partners/")]).then(([companies]) => {
    console.log("ID", this.props.match.params.id);
    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance
        .get(`${link}${this.state.user_uuid}`)
        .then((response) => {
          var new_state = {
            ...this.state,
            existing_record: true,
            readOnly: true,
            companies: companies
          };
          new_state = self.setUser(new_state, response.data.user);
          self.setState({ ...new_state });
        });
    } else {
      self.setState({
        ...this.state,
        companies: companies
      });
    }

    })
  };

  onSubmit = (e) => {
    var link = this.props.authentication.default_path == "/partners/" ? "/partners/users/" : "/admins/partners/users/"
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
          user: this.state.user,
        });
      } else {
        instance = axiosInstance.put(
          `${link}${this.state.user_id || this.state.user.uuid}`,
          { user: this.state.user }
        );
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setUser(this.state, response.data.user);
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `${this.props.authentication == '/partners/' ? "/partners/settings/users/" : "/admins/partners/users/"}${response.data.user.uuid}`
          );
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  };

  render() {
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle className="col-md-12">
              User
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/partners/settings/users/new"
                  >
                    New User
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="row">
                <Col md={12}>
                {this.props.authentication.default_path == "/admins/" ?<Row>
                       <FormGroup className="col-md-6">
                        <Label for="exampleEmail">Company</Label>
                                            <Select
                                                name="company_id"
                                                value={this.state.company_id}
                                                onChange={this.handleChangeSelect.bind(this, "company_id")}
                                                options={this.state.companies}
                                                isDisabled={this.state.readOnly}
                                            />
                        </FormGroup> 
                      </Row>: "" }
                  <Row>
                    <Col md={12}>
                      <Row>
                        <FormGroup className="col-md-6">
                          <Label for="name">First Name</Label>
                          <Input
                            type="text"
                            name="first_name"
                            value={this.state.user.first_name}
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
                            value={this.state.user.last_name}
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
                            value={this.state.user.email}
                            placeholder="user@email.com"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-6">
                          <Label for="name">Phone</Label>
                          <PhoneInput
                                    country={'gh'}
                                    value={this.state.user.phone}
                                    disabled={this.state.readOnly}
                                    readOnly={this.state.readOnly}
                                    countryCodeEditable={false}
                                    disableDropdown={true}
                                    className='test-class'
                                    onChange={(phone) => this.onPhoneChange(phone)}
                                    />
                        </FormGroup>
                      </Row>
                      
                    </Col>
                  </Row>

                  <Row></Row>
                </Col>

                <Col md={12}>
                  {/* <Row> */}
                  <SubmitButton
                    onClick={this.onSubmit}
                    readOnly={this.state.readOnly}
                    editing={this.state.editing}
                    existing_record={this.state.existing_record}
                  />
                  {/* </Row> */}
                </Col>
              </Form>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}



const mapStateToProps = state => ({ authentication: state.authentication })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)(User));
