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
import { getProductTagGroups } from "../misc/functions";
import Dropzone from "react-dropzone";
import NumberField from "../Controls/NumberField";
export default class ProductTag extends Component {
  state = {
    product_tag: {
      name: "",
      description: "",
      rate: 0,
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    product_tag_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      product_tag: {
        ...this.state.product_tag,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      product_tag: {
        ...this.state.product_tag,
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
        product_tag: {
          ...this.state.product_tag,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.product_tag[attr_name]);
      var date = new moment(this.state.product_tag[attr_name]);
      var new_state = {
        ...this.state,
        product_tag: {
          ...this.state.product_tag,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setProductTages = (state, product_tag) => {
    var new_state = {
      ...state,
      product_tag: product_tag,
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      product_tag: {
        ...this.state.product_tag,
        [e]: val.floatValue,
      },
    });
  };

  componentDidMount = () => {
    var self = this;

    // Promise.all([]).then(() => {
    console.log("ID", this.props.match.params.id);
    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance
        .get(`/admins/product_tags/${this.state.product_tag_uuid}`)
        .then((response) => {
          var new_state = {
            ...this.state,
            existing_record: true,
            readOnly: true,
          };
          new_state = self.setProductTages(
            new_state,
            response.data.product_tag
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
        instance = axiosInstance.post("/admins/product_tags", {
          product_tag: this.state.product_tag,
        });
      } else {
        instance = axiosInstance.put(
          `/admins/product_tags/${
            this.state.product_tag_id || this.state.product_tag.uuid
          }`,
          { product_tag: this.state.product_tag }
        );
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setProductTages(
            this.state,
            response.data.product_tag
          );
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `/product_configurations/product_tags/${response.data.product_tag.uuid}`
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
              ProductTag
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/product_configurations/product_tags/new"
                  >
                    New ProductTag
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
                            value={this.state.product_tag.name}
                            placeholder="ProductTag Name"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
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
