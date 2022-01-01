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
import moment from "moment";
import axiosInstance, { baseurl } from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link } from "react-router-dom";
import {
  getIndirectCategoryWidgets,
  getCategoryWidgetsTypes,
  getGenders,
  getMaritalStatuses,
  getCategories,
} from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import "./category_widgets.scss";
import Dropzone from "react-dropzone";
import CategoriesModal from "../Modals/CategoriesModal";
import Table from "reactstrap/lib/Table";
export default class CategoryWidget extends Component {
  state = {
    showCategoriesModal: false,
    category_widget: {
      photo_id: null,
      description: "",
      link: "",
      products_list: []
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    category_widget_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      category_widget: {
        ...this.state.category_widget,
        [e.target.name]: e.target.value,
      },
    });
  };
  onItemChange = (i, e) => {
    console.log("THIS IS INDEX", i)
    console.log("THIS IS ELEMENT", e)
    var products_list = [...this.state.category_widget.products_list]
    console.log("THESE ARE PRODUCTS", products_list)
    products_list[i].product = null
    products_list[i].temp_sku = e.target.value
  }
  addProduct = e => {
    var products_list = this.state.category_widget.products_list
    products_list.push({temp_sku: "", product: {}})
    this.setState({
      ...this.state,
      category_widget: {
        ...this.state.category_widget,
        products_list: products_list
      }
    })
  }
  removeProduct = (i, e) => {
    var products_list = this.state.category_widget.products_list
    products_list.splice(i, 1)
    this.setState({
      ...this.state,
      category_widget: {
        ...this.state.category_widget,
        products_list: products_list
      }
    })
  }
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      category_widget: {
        ...this.state.category_widget,
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
        category_widget: {
          ...this.state.category_widget,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.category_widget[attr_name]);
      var date = new moment(this.state.category_widget[attr_name]);
      var new_state = {
        ...this.state,
        category_widget: {
          ...this.state.category_widget,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setCategoryWidgets = (state, category_widget) => {
    var new_state = {
      ...state,
      category_widget: category_widget,
      // category_id: state.categories.find(
      //   (obj) => obj.value == category_widget.category_id
      // ),
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);
    this.setState({
      ...this.state,
      category_widget: {
        ...this.state.category_widget,
        [e]: val.floatValue,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      category_widget: {
        ...this.state.category_widget,
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
            category_widget: {
              ...this.state.category_widget,
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

    // Promise.all([getCategories()]).then(([categories]) => {
      console.log("ID", this.props.match.params.id);
      if (self.state.existing_record == true) {
        console.log("FECHING EXISTING RECORD");
        axiosInstance
          .get(`/admins/category_widgets/${this.state.category_widget_uuid}`)
          .then((response) => {
            var new_state = {
              ...this.state,
              existing_record: true,
              readOnly: true,
              // categories: categories,
            };
            new_state = self.setCategoryWidgets(
              new_state,
              response.data.category_widget
            );
            self.setState({ ...new_state });
          });
      } else {
        self.setState({
          ...this.state,
          // categories: categories,
        });
      }
    // });
  };
  toggleCategoriesModal = () => {
    this.setState({
        ...this.state,
        showCategoriesModal: !this.state.showCategoriesModal
    })
}
  onSubmit = (e) => {
    e.preventDefault();
    var self = this;
    var product_ids = this.state.category_widget.products_list.map(item => {
      if (item.product != null ){
        return item.product.id
      }
    })
    console.log("PRODUCT_IDS", product_ids)
    if (self.state.readOnly == true && self.state.existing_record == true) {
      self.setState({
        ...self.state,
        readOnly: false,
      });
    } else {
      var instance;
      if (self.state.existing_record != true) {
        instance = axiosInstance.post("/admins/category_widgets", {
          category_widget: {...this.state.category_widget, product_ids: product_ids},
        });
      } else {
        instance = axiosInstance.put(
          `/admins/category_widgets/${
            this.state.category_widget_id || this.state.category_widget.uuid
          }`,
          { category_widget: {...this.state.category_widget, product_ids: product_ids} }
        );
      }
      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setCategoryWidgets(
            this.state,
            response.data.category_widget
          );
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `/appearances/category_widgets/${response.data.category_widget.uuid}`
          );
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  }; 
  fetchProduct = (i, e) => {
    console.log("THIS IS VALUE", e.target.value);
    var sku = e.target.value

    axiosInstance.get(`/admins/products/get_by_sku?sku=${sku}`).then(response => {
      console.log("THIS IS RESPONSE", response)
      if (response.status == 200){
        var products_list = this.state.category_widget.products_list;
        products_list[i].product = response.data.product;
        this.setState({
          ...this.state,
          category_widget: {...this.state.category_widget,

          }
        })
      }
    })
  }
  selectCategory = (category) => {
        
    this.setState({
      ...this.state,
      category_widget: {
        ...this.state.category_widget,
        category_id: category.id,
        category: category,
      },
    });
  };

  render() {
    return (
      <Col md={12}>
        <CategoriesModal
          isOpen={this.state.showCategoriesModal}
          category_id={this.state.category_widget.category_id}
          selectCategory={this.selectCategory.bind(this)}
          toggle={this.toggleCategoriesModal}
          parentForm={this}
        />
        <Card>
          <CardBody>
            <CardTitle className="col-md-12">
              CategoryWidget
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/appearances/category_widgets/new"
                  >
                    New CategoryWidget
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="row">
                <Col md={12}>
                  <Row>
                    <Col md={3}>
                      <Row>
                        <Dropzone
                          disabled={this.state.readOnly}
                          onDrop={
                            this.readOnly
                              ? null
                              : this.onDrop.bind(null, "photo")
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

                              {this.state.category_widget.photo ? (
                                <img
                                  src={
                                    this.state.category_widget.photo.image_url
                                  }
                                />
                              ) : null}
                            </Col>
                          )}
                        </Dropzone>
                      </Row>
                    </Col>
                    <Col md={9}>
                    <Row>
                      <FormGroup className="col-md-10">
                        <Label for="exampleEmail">Category</Label>
                        <Input
                          type="text"
                          name="name"
                          value={
                            this.state.category_widget.category
                              ? this.state.category_widget.category.name
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
                          Select 
                        </Button>
                      </FormGroup>
                      </Row>
                      <Row>
                       
                        <FormGroup className="col-md-12">
                          <Label for="name">Description</Label>
                          <Input
                            type="textarea"
                            name="description"
                            value={this.state.category_widget.description}
                            placeholder="Slider Description"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                        <FormGroup className="col-md-12">
                          <Label for="name">Link</Label>
                          <Input
                            type="text"
                            name="link"
                            value={this.state.category_widget.link}
                            placeholder="Slider Link"
                            onChange={this.onChange}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Table striped="true" bordered='true'>
                          <thead>
                            <tr>
                              <th width='25%'>Pruduct SKU</th>
                              <th width='70%'>Pruduct Name</th>
                              <th width='5%'></th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.category_widget.products_list.map((item, i )=> {
                              return <tr>
                                <td>
                                  <Input value={item.product == null ? item.temp_sku : item.product.sku} readOnly={this.state.readOnly} onBlur={this.fetchProduct.bind(this, i)} onChange={this.onItemChange.bind(this, i)}></Input>
                                </td>
                                <td>
                                <Input value={item.product != null ? item.product.name : "" } readOnly={true}></Input>
                                </td>
                                <td>
                                <Button color='danger' className='btn-sm' onClick={this.removeProduct} disabled={this.state.readOnly}> X </Button>
                                </td>
                              </tr>
                            })}

                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan='3' className='right'>
                                <Button color='success' className='btn-sm' onClick={this.addProduct} disabled={this.state.readOnly}> Add Product</Button>
                              </td>
                            </tr> 
                          </tfoot>
                    </Table>
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
