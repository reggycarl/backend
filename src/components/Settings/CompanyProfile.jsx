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
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
} from "reactstrap";
import Select from "../Controls/Select";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import moment from "moment";
import axiosInstance, { baseurl } from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link, withRouter } from "react-router-dom";

import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import "./company_profile.scss";
import Dropzone from "react-dropzone";
import PhoneInput from "react-phone-input-2";
import { getBanks, getCompanyTypes, getCountries } from "../misc/functions";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "reactstrap/lib/Button";
import Table from "reactstrap/lib/Table";
class CompanyProfile extends Component {
  state = {
    activeTab: "1",
    company: {
      photo_id: null,
      description: "",
      link: "",
      phone: "",
      users: [],
    },

    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    company_uuid: this.props.match.params.id,
    existing_record:
      (this.props.authentication.user.company_id != "" &&
        this.props.authentication.user.company_id != null) ||
      (this.props.match.params.id && this.props.match.params.id != null),
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      company: {
        ...this.state.company,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      company: {
        ...this.state.company,
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
        company: {
          ...this.state.company,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.company[attr_name]);
      var date = new moment(this.state.company[attr_name]);
      var new_state = {
        ...this.state,
        company: {
          ...this.state.company,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setCompanyProfile = (state, company) => {
    var new_state = {
      ...state,
      company: company,
      type_id: state.types.find((obj) => obj.value == company.type_id),
      country_id: state.countries.find(
        (obj) => obj.value == company.country_id
      ),
      bank_id: state.banks.find((obj) => obj.value == company.bank_id),
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      company: {
        ...this.state.company,
        [e]: val.floatValue,
      },
    });
  };
  toggleTab = (val) => {
    this.setState({
      ...this.state,
      activeTab: val,
    });
  };
  onPhoneChange = (phone) => {
    this.setState({
      ...this.state,
      company: {
        ...this.state.company,
        phone: phone,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      company: {
        ...this.state.company,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };

  componentDidMount = () => {
    var self = this;

    Promise.all([getCompanyTypes(), getCountries(), getBanks()]).then(
      ([types, countries, banks]) => {
        if (self.state.existing_record == true) {
          console.log("ID", this.props.match.params.id);
          console.log("FECHING EXISTING RECORD");
          axiosInstance
            .get(
              this.props.authentication.default_path == "/partners/"
                ? `/partners/companies`
                : `/admins/partners/companies/${this.state.company_uuid}`
            )
            .then((response) => {
              var new_state = {
                ...this.state,
                existing_record: true,
                types: types,
                countries: countries,
                banks: banks,
                readOnly: true,
              };
              new_state = self.setCompanyProfile(
                new_state,
                response.data.company
              );
              self.setState({ ...new_state });
            });
        } else {
          self.setState({
            ...this.state,
            types: types,
            countries: countries,
            banks: banks,
          });
        }
      }
    );
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
            company: {
              ...this.state.brand,
              logo_id: response.data.photo.id,
              logo: response.data.photo,
            },
          });
        });
      });
    }
  };
  approveCompany = (e) => {
    e.preventDefault();
    axiosInstance
      .post(`admins/partners/companies/${this.state.company_uuid}/approve`)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            company: response.data.company,
          });
        }
      });
  };
  onSubmit = (e) => {
    var link =
      this.props.authentication.default_path == "/partners/"
        ? "/partners/companies"
        : "/admins/partners/companies";
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
        instance = axiosInstance.post(link, { ...this.state });
      } else {
        instance = axiosInstance.put(`${link}/${this.state.company_uuid}`, {
          company: this.state.company,
        });
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setCompanyProfile(
            this.state,
            response.data.company
          );
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(`${link}${response.data.company.uuid}`);
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  };
  handleChangeToggle = (component) => {
    this.setState({
      ...this.state,
      company: {
        ...this.state.company,
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
              Company Profile
              <ul>
                {this.props.authentication.default_path == "/admins/" ? (
                  <li>
                    <Link
                      className="btn btn-success btn-sm"
                      to={`${this.props.authentication.default_path}partners/companies/new`}
                    >
                      New Business
                    </Link>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={this.state.activeTab == "1" ? "active" : ""}
                      onClick={() => {
                        this.toggleTab("1");
                      }}
                    >
                      Basic Information
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={this.state.activeTab == "2" ? "active" : ""}
                      onClick={() => {
                        this.toggleTab("2");
                      }}
                    >
                      Payment Information
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={this.state.activeTab == "3" ? "active" : ""}
                      onClick={() => {
                        this.toggleTab("3");
                      }}
                    >
                      Users
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col md={3}>
                        <Dropzone
                          disabled={this.state.readOnly}
                          onDrop={
                            this.readOnly
                              ? null
                              : this.onDrop.bind(null, "logo")
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Col
                              id="companyPhotoBox"
                              {...getRootProps()}
                              className={`${
                                this.state.readOnly ? "" : "dropZone"
                              }  col-md-12`}
                            >
                              <input {...getInputProps()} />

                              {this.state.company.logo ? (
                                <img src={this.state.company.logo.image_url} />
                              ) : null}
                            </Col>
                          )}
                        </Dropzone>
                      </Col>
                      <Col md={9}>
                        <Row>
                          <FormGroup className="col-md-4">
                            <Label for="name">Business Number</Label>
                            <Input
                              type="text"
                              name="name"
                              value={this.state.company.number}
                              placeholder="Business Number"
                              readOnly={true}
                            />
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup className="col-md-8">
                            <Label for="name">Business Name</Label>
                            <Input
                              type="text"
                              name="name"
                              value={this.state.company.name}
                              placeholder="Business Name Name"
                              onChange={this.onChange}
                              readOnly={this.state.readOnly}
                            />
                          </FormGroup>
                        </Row>
                        <Row>
                          <FormGroup className="col-md-4">
                            <Label for="exampleEmail">Business Type</Label>
                            <Select
                              name="type_id"
                              value={this.state.type_id}
                              onChange={this.handleChangeSelect.bind(
                                this,
                                "type_id"
                              )}
                              options={this.state.types}
                              isDisabled={this.state.readOnly}
                            />
                          </FormGroup>
                          <FormGroup className="col-md-3">
                            <Label for="disabled">Disabled</Label>
                            <Col md={12} className="block">
                              <Row>
                                <Toggle
                                  id="disabled"
                                  defaultChecked={this.state.company.disabled}
                                  checked={this.state.company.disabled}
                                  disabled={this.state.readOnly}
                                  onChange={this.handleChangeToggle}
                                />
                              </Row>
                            </Col>
                          </FormGroup>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="col-md-12">
                          <Label for="name">Contact Phone</Label>
                          <PhoneInput
                            country={"gh"}
                            value={this.state.company.phone}
                            disabled={this.state.readOnly}
                            readOnly={this.state.readOnly}
                            placeholder="233 241 234 567"
                            // countryCodeEditable={false}
                            // disableDropdown={true}
                            className=""
                            onChange={(phone) => this.onPhoneChange(phone)}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="name">Email</Label>
                          <Input
                            type="text"
                            name="email"
                            value={this.state.company.email}
                            placeholder="company@email.com"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="name">Address Line 1</Label>
                          <Input
                            type="text"
                            name="address_line_1"
                            value={this.state.company.address_line_1}
                            placeholder=""
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="name">Address Line 2</Label>
                          <Input
                            type="text"
                            name="address_line_2"
                            value={this.state.company.address_line_2}
                            placeholder=""
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="name">City / Town</Label>
                          <Input
                            type="text"
                            name="city"
                            value={this.state.company.city}
                            placeholder=""
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="exampleEmail">Country</Label>
                          <Select
                            name="type_id"
                            value={this.state.country_id}
                            onChange={this.handleChangeSelect.bind(
                              this,
                              "country_id"
                            )}
                            options={this.state.countries}
                            isDisabled={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="name">Postal / Zip Code</Label>
                          <Input
                            type="text"
                            name="postal_code"
                            value={this.state.company.postal_code}
                            placeholder=""
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="col-md-12">
                          <Label for="name">Business Reg. No. </Label>
                          <Input
                            type="text"
                            name="registration_number"
                            value={this.state.company.registration_number}
                            placeholder=""
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="name">
                            Tax Identification No. (TIN){" "}
                          </Label>
                          <Input
                            type="text"
                            name="tax_identification_number"
                            value={this.state.company.tax_identification_number}
                            placeholder=""
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Bank / Mobile Network</Label>
                      <Select
                        name="bank_id"
                        value={this.state.bank_id}
                        onChange={this.handleChangeSelect.bind(this, "bank_id")}
                        options={this.state.banks}
                        isDisabled={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-6">
                      <Label for="name">Account Name</Label>
                      <Input
                        type="text"
                        name="account_name"
                        value={this.state.company.account_name}
                        placeholder=""
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="name">Account / Wallet Number</Label>
                      <Input
                        type="text"
                        name="account_number"
                        value={this.state.company.account_number}
                        placeholder=""
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                  </TabPane>
                  <TabPane tabId="3">
                    <Table bordered="true" striped="true">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.company.users.map((user, i) => {
                          return (
                            <tr>
                              <td>{i + 1}</td>
                              <td>{user.full_name}</td>
                              <td>{user.email}</td>
                              <td>{user.phone}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </TabPane>
                </TabContent>

                <Col md={12}>
                  {/* <Row> */}
                  <SubmitButton
                    onClick={this.onSubmit}
                    readOnly={this.state.readOnly}
                    editing={this.state.editing}
                    existing_record={this.state.existing_record}
                  />
                  &nbsp;
                  {this.props.authentication.default_path == "/admins/" ? (
                    <Button
                      color="success"
                      disabled={this.state.company.approved}
                      onClick={this.approveCompany}
                    >
                      {this.state.company.approved ? "Approved" : "Approve"}
                    </Button>
                  ) : (
                    ""
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CompanyProfile)
);
