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
import axiosInstance from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link } from "react-router-dom";
import {
  getIndirectCategories,
  getProductsTypes,
  getGenders,
  getMaritalStatuses,
} from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import CategoriesModal from "../Modals/CategoriesModal";
import "react-toggle/style.css";
import Toggle from "react-toggle";
export default class Category extends Component {
  state = {
    category: {
      base_price: 0,
      insurance: 0,
      maintenance: 0,
      price_per_km: 0,
      price_per_min: 0,
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    category_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    showCategoriesModal: false,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      category: {
        ...this.state.category,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      category: {
        ...this.state.category,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };
  selectCategory = (category) => {
    this.setState({
      ...this.state,
      category: {
        ...this.state.category,
        parent_id: category.id,
        parent: category,
      },
    });
  };
  onDateChanged = (momentdate, attr_name) => {
    // console.log("ClassName is", momentdate.constructor.name)
    var new_date = new moment();
    if (momentdate.constructor.name == new_date.constructor.name) {
      var new_state = {
        ...this.state,
        category: {
          ...this.state.category,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.category[attr_name]);
      var date = new moment(this.state.category[attr_name]);
      var new_state = {
        ...this.state,
        category: {
          ...this.state.category,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setProducts = (state, category) => {
    console.log("THIS IS STATE", state);
    var new_state = {
      ...state,
      category: category,
      // type_id: state.category_types.
      // parent_id: state.categories.find(obj => obj.value == category.parent_id)
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      category: {
        ...this.state.category,
        [e]: val.floatValue,
      },
    });
  };
  componentDidMount = () => {
    var self = this;

    // Promise.all([getIndirectCategories()]).then(([categories,]) => {
    console.log("ID", this.props.match.params.id);
    // console.log("VEHICLE TYPES", categories)
    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance
        .get(`/admins/categories/${this.state.category_uuid}`)
        .then((response) => {
          var new_state = {
            ...this.state,
            existing_record: true,
            readOnly: true,
            // categories: categories
          };
          new_state = self.setProducts(new_state, response.data.category);
          self.setState({ ...new_state });
        });
    } else {
      self.setState({
        ...this.state,
        // categories: categories,
      });
    }

    // })
  };
  toggleStatus = (e) => {
    e.preventDefault();
    var self = this;
    axiosInstance
      .get(`/admins/categories/${this.state.category.uuid}/toggle_status`)
      .then((response) => {
        if (response.status == 200) {
          var new_state = {
            ...this.state,
            existing_record: true,
            readOnly: true,
            // categories: categories
          };
          new_state = self.setProducts(new_state, response.data.category);
          self.setState({ ...new_state });
        }
      });
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
        instance = axiosInstance.post("/admins/categories", { ...this.state });
      } else {
        console.log("UPDATING CATEGORY...");
        instance = axiosInstance.put(
          `/admins/categories/${
            this.state.category_id || this.state.category.uuid
          }`,
          { category: this.state.category }
        );
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setProducts(this.state, response.data.category);
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `/admins/categories/${response.data.category.uuid}`
          );
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  };

  toggleCategoriesModal = () => {
    this.setState({
      ...this.state,
      showCategoriesModal: !this.state.showCategoriesModal,
    });
  };
  handleChangeToggle = (component) => {
    this.setState({
      ...this.state,
      category: {
        ...this.state.category,
        [component.target.id]: component.target.checked,
      },
    });
  };
  render() {
    return (
      <Col md={12}>
        <CategoriesModal
          isOpen={this.state.showCategoriesModal}
          category_id={this.state.category.parent_id}
          selectCategory={this.selectCategory.bind(this)}
          toggle={this.toggleCategoriesModal}
          parentForm={this}
        />
        <Card>
          <CardBody>
            <CardTitle className="col-md-12">
              Category
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/admins/categories/new"
                  >
                    New Product
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="row">
                <Col md={12}>
                  <Row>
                    <FormGroup className="col-md-8">
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        value={this.state.category.name}
                        placeholder="Category Name"
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>

                    <FormGroup className="col-md-2">
                      <Label for="sale-price">Featured</Label>
                      <Col md={12} className="block">
                        <Row>
                          <Toggle
                            id="featured"
                            defaultChecked={this.state.category.featured}
                            checked={this.state.category.featured}
                            disabled={this.state.readOnly}
                            onChange={this.handleChangeToggle}
                          />
                        </Row>
                      </Col>
                    </FormGroup>
                    <FormGroup className="col-md-2">
                      <Label for="sale-price">Disabled</Label>
                      <Col md={12} className="block">
                        <Row>
                          <Toggle
                            id="disabled"
                            defaultChecked={this.state.category.disabled}
                            checked={this.state.category.disabled}
                            disabled={this.state.readOnly}
                            onChange={this.handleChangeToggle}
                          />
                        </Row>
                      </Col>
                    </FormGroup>

                    <FormGroup className="col-md-8">
                      <Label for="exampleEmail">Parent Category</Label>
                      <Input
                        type="text"
                        name="name"
                        value={
                          this.state.category.parent
                            ? this.state.category.parent.name
                            : ""
                        }
                        placeholder="Category Name"
                        onChange={this.onChange}
                        readOnly={true}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-2">
                      <Label for="exampleEmail">&nbsp;</Label>
                      <Button
                        className="form-control"
                        onClick={this.toggleCategoriesModal}
                        disabled={this.state.readOnly}
                      >
                        Select Category
                      </Button>
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-md-6">
                      <Label for="name">Full Path</Label>
                      <Input
                        type="text"
                        name="full_path"
                        value={this.state.category.full_path}
                        readOnly={true}
                      />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-md-2">
                      <Label for="name">Commission Rate</Label>
                      <Input
                        type="number"
                        name="commission_rate"
                        value={this.state.category.commission_rate}
                        placeholder="0.0"
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-2">
                      <Label for="name">Featured Rank</Label>
                      <Input
                        type="number"
                        name="rank"
                        value={this.state.category.rank}
                        placeholder="Rank"
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
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
                  <span>&nbsp;</span>
                  {/* <Button
                    onClick={this.toggleStatus}
                    color={this.state.category.disabled ? "success" : "warning"}
                  >
                    {this.state.category.disabled ? "Enable" : "Disabled"}
                  </Button> */}

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
