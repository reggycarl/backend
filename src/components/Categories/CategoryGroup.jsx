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
  getIndirectCategoryGroups,
  getProductsTypes,
  getGenders,
  getMaritalStatuses,
} from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import CategoryModal from "../Modals/CategoriesModal";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import Table from "reactstrap/lib/Table";
import Dropzone from "react-dropzone";
import "./category_group.scss";
export default class Category extends Component {
  state = {
    category_group: {
      name: "",
      categories: [],
      category_ids: [],
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    category_group_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    showCategoryModal: false,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      category_group: {
        ...this.state.category_group,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      category_group: {
        ...this.state.category_group,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };
  selectCategory = (category) => {
    console.log("SELECTING CATEGORY", category);
    var category_ids = this.state.category_group.category_ids;
    var categories = [...this.state.category_group.categories];
    var current_category = categories[this.state.current_index];
    console.log("THIS IS CURRENT CATEGORY", current_category);
    current_category = category;
    // current_category.category_id = category.id;
    categories[this.state.current_index] = category;
    var arr_index = category_ids.indexOf(category.id);
    if (arr_index < 0) {
      category_ids.push(category.id);
    } else {
      category_ids[this.state.current_index] = category.id;
    }
    this.setState({
      ...this.state,
      category_group: {
        ...this.state.category_group,
        categories: [...categories],
        category_ids: category_ids,
      },
    });
  };
  onDateChanged = (momentdate, attr_name) => {
    // console.log("ClassName is", momentdate.constructor.name)
    var new_date = new moment();
    if (momentdate.constructor.name == new_date.constructor.name) {
      var new_state = {
        ...this.state,
        category_group: {
          ...this.state.category_group,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.category_group[attr_name]);
      var date = new moment(this.state.category_group[attr_name]);
      var new_state = {
        ...this.state,
        category_group: {
          ...this.state.category_group,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setProducts = (state, category_group) => {
    console.log("THIS IS STATE", state);
    var new_state = {
      ...state,
      category_group: category_group,
      // type_id: state.category_group_types.
      // parent_id: state.category_group_groups.find(obj => obj.value == category_group.parent_id)
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      category_group: {
        ...this.state.category_group,
        [e]: val.floatValue,
      },
    });
  };
  componentDidMount = () => {
    var self = this;

    // Promise.all([getIndirectCategoryGroups()]).then(([category_group_groups,]) => {
    console.log("ID", this.props.match.params.id);
    // console.log("VEHICLE TYPES", category_group_groups)
    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance
        .get(`/admins/category_groups/${this.state.category_group_uuid}`)
        .then((response) => {
          var new_state = {
            ...this.state,
            existing_record: true,
            readOnly: true,
            // category_group_groups: category_group_groups
          };
          new_state = self.setProducts(new_state, response.data.category_group);
          self.setState({ ...new_state });
        });
    } else {
      self.setState({
        ...this.state,
        // category_group_groups: category_group_groups,
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
        instance = axiosInstance.post("/admins/category_groups", {
          ...this.state,
        });
      } else {
        console.log("UPDATING CATEGORY...");
        instance = axiosInstance.put(
          `/admins/category_groups/${
            this.state.category_group_id || this.state.category_group.uuid
          }`,
          { category_group: this.state.category_group }
        );
      }
      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setProducts(
            this.state,
            response.data.category_group
          );
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `/admins/category_groups/${response.data.category_group.uuid}`
          );
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  };
  addCategory = () => {
    this.setState({
      ...this.state,
      category_group: {
        ...this.state.category_group,
        categories: [
          ...this.state.category_group.categories,
          { category_id: null },
        ],
      },
    });
  };
  removeCategory = (index, e) => {
    console.log("THIS IS INDEX", index);
    console.log("THIS IS element", e);
    var categories_list = this.state.category_group.categories;
    categories_list.splice(index, 1);
    var category_ids = categories_list.map((cat) => {
      return cat.id;
    });
    this.setState({
      ...this.state,
      category_group: {
        ...this.state.category_group,
        categories: [...categories_list],
        category_ids: category_ids,
      },
    });
  };

  toggleCategoryModal = () => {
    this.setState({
      ...this.state,
      showCategoryModal: !this.state.showCategoryModal,
    });
  };
  setAndShowCategoryModal = (e) => {
    // this.toggleCategoryModal();
    this.setState({
      ...this.state,
      current_index: parseInt(e.target.name),
      showCategoryModal: true,
    });
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
            category_group: {
              ...this.state.category_group,
              [`${name}_id`]: response.data.photo.id,
              [`${name}`]: response.data.photo,
            },
          });
        });
      });
    }
  };
  handleChangeToggle = (component) => {
    this.setState({
      ...this.state,
      category_group: {
        ...this.state.category_group,
        [component.target.id]: component.target.checked,
      },
    });
  };
  render() {
    return (
      <Col md={12}>
        <CategoryModal
          isOpen={this.state.showCategoryModal}
          category_group_id={this.state.category_group.parent_id}
          selectCategory={this.selectCategory.bind(this)}
          toggle={this.toggleCategoryModal}
          parentForm={this}
        />
        <Card>
          <CardBody>
            <CardTitle className="col-md-12">
              Category Group
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/admins/category_groups/new"
                  >
                    New Product
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="row">
                <Col md={3}>
                  <Dropzone
                    readOnly={this.state.readOnly}
                    onDrop={
                      this.readOnly ? null : this.onDrop.bind(null, "photo")
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Col
                        id="photoBox"
                        {...getRootProps()}
                        className={`${
                          this.state.readOnly ? "" : "dropZone"
                        }  col-md-12`}
                      >
                        <input {...getInputProps()} />

                        {this.state.category_group.photo ? (
                          <img
                            src={this.state.category_group.photo.image_url}
                          />
                        ) : null}
                      </Col>
                    )}
                  </Dropzone>

                  <Dropzone
                    readOnly={this.state.readOnly}
                    onDrop={
                      this.readOnly ? null : this.onDrop.bind(null, "icon")
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Col
                        id="photoBox"
                        {...getRootProps()}
                        className={`${
                          this.state.readOnly ? "" : "dropZone"
                        }  col-md-12`}
                      >
                        <input {...getInputProps()} />

                        {this.state.category_group.icon ? (
                          <img src={this.state.category_group.icon.image_url} />
                        ) : null}
                      </Col>
                    )}
                  </Dropzone>
                </Col>
                <Col md={9}>
                  <Row>
                    <FormGroup className="col-md-8">
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        value={this.state.category_group.name}
                        placeholder="Category Name"
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                  </Row>

                  <Table bordered={true} striped={true}>
                    <thead>
                      <tr>
                        <th width={"90%"}>Category</th>
                        <th width={"10%"}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.category_group.categories.map(
                        (cat, index) => {
                          console.log(
                            "THIS IS CURRENT CAT",
                            this.state.category_group
                          );
                          return (
                            <tr>
                              <td>
                                <Row>
                                  <FormGroup className="col-md-10">
                                    <Input
                                      type="text"
                                      name="name"
                                      value={
                                        this.state.category_group.categories[
                                          index
                                        ]
                                          ? this.state.category_group
                                              .categories[index].name
                                          : ""
                                      }
                                      placeholder="Category Name"
                                      onChange={this.onChange}
                                      readOnly={true}
                                    />
                                  </FormGroup>
                                  <FormGroup className="col-md-2">
                                    <Button
                                      className="form-control"
                                      name={index}
                                      onClick={this.setAndShowCategoryModal}
                                      disabled={this.state.readOnly}
                                    >
                                      Select Category
                                    </Button>
                                  </FormGroup>
                                </Row>
                              </td>
                              <td>
                                <Button
                                  size={"sm"}
                                  className="form-control"
                                  color={"danger"}
                                  onClick={this.removeCategory.bind(
                                    this,
                                    index
                                  )}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          <Button
                            size={"sm"}
                            className="form-control"
                            color={"success"}
                            onClick={this.addCategory}
                          >
                            Add{" "}
                          </Button>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
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
