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
import { Link } from "react-router-dom";
import { getPointsConfigurationGroups } from "../misc/functions";
import Dropzone from "react-dropzone";
import NumberField from "../Controls/NumberField";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
export default class PointsConfiguration extends Component {
  state = {
    points_configuration: {
      name: "",
      description: "",
      rate: 0,
      start_date: moment(),
      end_date: moment(),
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    points_configuration_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      points_configuration: {
        ...this.state.points_configuration,
        [e.target.name]: e.target.value,
      },
    });
  };
  onDateChanged = (attr_name, momentdate) => {
    // console.log("ClassName is", momentdate.constructor.name)
    var new_date = new moment();
    if (momentdate.constructor.name == new_date.constructor.name) {
      var new_state = {
        ...this.state,
        points_configuration: {
          ...this.state.points_configuration,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.points_configuration[attr_name]);
      var date = new moment(this.state.points_configuration[attr_name]);
      var new_state = {
        ...this.state,
        points_configuration: {
          ...this.state.points_configuration,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      points_configuration: {
        ...this.state.points_configuration,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };
  onDateChanged = (attr_name, momentdate) => {
    // console.log("ClassName is", momentdate.constructor.name)
    console.log(momentdate);
    console.log(attr_name);
    var new_date = new moment();
    if (momentdate.constructor.name == new_date.constructor.name) {
      var new_state = {
        ...this.state,
        points_configuration: {
          ...this.state.points_configuration,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.points_configuration[attr_name]);
      var date = new moment(this.state.points_configuration[attr_name]);
      var new_state = {
        ...this.state,
        points_configuration: {
          ...this.state.points_configuration,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setPointsConfigurations = (state, points_configuration) => {
    var new_state = {
      ...state,
      points_configuration: {
        ...points_configuration,
        start_date: new moment(points_configuration.start_date),
        end_date: new moment(points_configuration.end_date),
      },
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      points_configuration: {
        ...this.state.points_configuration,
        [e]: val.floatValue,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      points_configuration: {
        ...this.state.points_configuration,
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
            points_configuration: {
              ...this.state.points_configuration,
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

    // Promise.all([]).then(() => {
    console.log("ID", this.props.match.params.id);
    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance
        .get(
          `/admins/points_configurations/${this.state.points_configuration_uuid}`
        )
        .then((response) => {
          var new_state = {
            ...this.state,
            existing_record: true,
            readOnly: true,
          };
          new_state = self.setPointsConfigurations(
            new_state,
            response.data.points_configuration
          );
          self.setState({ ...new_state });
        });
    } else {
      self.setState({
        ...this.state,
      });
    }

    // })
  };

  onSubmit = (e) => {
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
        instance = axiosInstance.post("/admins/points_configurations", {
          points_configuration: this.state.points_configuration,
        });
      } else {
        instance = axiosInstance.put(
          `/admins/points_configurations/${
            this.state.points_configuration_id ||
            this.state.points_configuration.uuid
          }`,
          { points_configuration: this.state.points_configuration }
        );
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setPointsConfigurations(
            this.state,
            response.data.points_configuration
          );
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `/promotions_n_more/product_configurations/points_configurations/${response.data.points_configuration.uuid}`
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
              PointsConfiguration
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/product_configurations/points_configurations/new"
                  >
                    New PointsConfiguration
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
                        <FormGroup className="col-md-4">
                          <Label for="name">Name</Label>
                          <Input
                            type="text"
                            name="name"
                            value={this.state.points_configuration.name}
                            placeholder="PointsConfiguration Name"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-2">
                          <Label for="exampleEmail">Start Date</Label>

                          <Datetime
                            type="name"
                            dateFormat="DD-MM-YYYY"
                            name="start_date"
                            timeFormat={false}
                            value={this.state.points_configuration.start_date}
                            onChange={this.onDateChanged.bind(
                              this,
                              "start_date"
                            )}
                            inputProps={{ disabled: this.state.readOnly }}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-2">
                          <Label for="exampleEmail">End Date</Label>
                          <Datetime
                            type="name"
                            dateFormat="DD-MM-YYYY"
                            name="end_date"
                            timeFormat={false}
                            value={this.state.points_configuration.end_date}
                            onChange={this.onDateChanged.bind(this, "end_date")}
                            inputProps={{ disabled: this.state.readOnly }}
                          />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-2">
                          <Label for="exampleEmail">Price Per Point</Label>
                          <NumberField
                            name="price_per_point"
                            thousandSeparator={true}
                            decimalScale={6}
                            displayType={"input"}
                            className={"right"}
                            value={
                              this.state.points_configuration.price_per_point
                            }
                            onValueChange={this.onValueChange.bind(
                              this,
                              "price_per_point"
                            )}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-2">
                          <Label for="exampleEmail">Redemption Threshold</Label>
                          <NumberField
                            name="redemption_threshold"
                            thousandSeparator={true}
                            displayType={"input"}
                            className={"right"}
                            value={
                              this.state.points_configuration
                                .redemption_threshold
                            }
                            onValueChange={this.onValueChange.bind(
                              this,
                              "redemption_threshold"
                            )}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-2">
                          <Label for="exampleEmail">
                            Commission Percentage
                          </Label>
                          <NumberField
                            name="commission_percentage"
                            thousandSeparator={true}
                            displayType={"input"}
                            className={"right"}
                            value={
                              this.state.points_configuration
                                .commission_percentage
                            }
                            onValueChange={this.onValueChange.bind(
                              this,
                              "commission_percentage"
                            )}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-2">
                          <Label for="exampleEmail">Referrer Percentage</Label>
                          <NumberField
                            name="referrer_percentage"
                            thousandSeparator={true}
                            displayType={"input"}
                            className={"right"}
                            value={
                              this.state.points_configuration
                                .referrer_percentage
                            }
                            onValueChange={this.onValueChange.bind(
                              this,
                              "referrer_percentage"
                            )}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="col-md-12">
                          <Label for="name">Description</Label>
                          <Input
                            type="textarea"
                            rows={5}
                            name="description"
                            value={this.state.points_configuration.description}
                            placeholder="PointsConfiguration Description"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Row>
                      <Row></Row>
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
