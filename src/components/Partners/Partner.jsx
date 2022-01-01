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
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import axiosInstance from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link, withRouter } from "react-router-dom";
import Toggle from "react-toggle";
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'
import { connect } from 'react-redux'

import './products.scss'

import {
  getCategories,
  getProductsTypes,
  getGenders,
  getMaritalStatuses,
} from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import "react-toggle/style.css";
import Dropzone from "react-dropzone";
import ProductImage from "./ProductImage";
class Product extends Component {
  state = {
    product: {
      regular_price: 0,
      sale_price: 0,
      name: "",
      description: "",
      category_id: null,
      on_sale: false,
      active: true,
      in_stock: true,
      photos: [],
      photo_ids: []
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    product_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        [e.target.name]: e.target.value,
      },
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      product: {
        ...this.state.product,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };

  handleChangeToggle = (component)=> {
    
    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        [component.target.id]: component.target.checked
      }
    })
    
  }
  onDateChanged = (momentdate, attr_name) => {
    // console.log("ClassName is", momentdate.constructor.name)
    var new_date = new moment();
    if (momentdate.constructor.name == new_date.constructor.name) {
      var new_state = {
        ...this.state,
        product: {
          ...this.state.product,
          [attr_name]: momentdate,
        },
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state.product[attr_name]);
      var date = new moment(this.state.product[attr_name]);
      var new_state = {
        ...this.state,
        product: {
          ...this.state.product,
          [attr_name]: date,
        },
      };
      this.setState({ ...new_state });
    }
  };

  setProducts = (state, product) => {
    console.log("THIS IS STATE", state);
    var new_state = {
      ...state,
      product: product,

      category_id: state.categories.find(
        (obj) => obj.value == product.category_id
      ),
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        [e]: val.floatValue,
      },
    });
  };
  componentDidMount = () => {
    var self = this;

    Promise.all([getCategories()]).then(([categories]) => {
      if (self.state.existing_record == true) {
        console.log("FECHING EXISTING RECORD");
        axiosInstance
          .get(`${this.props.authentication.default_path}products/${this.state.product_uuid}`)
          .then((response) => {
            var new_state = {
              ...this.state,
              existing_record: true,
              readOnly: true,
              categories: categories,
            };
            new_state = self.setProducts(new_state, response.data.product);
            self.setState({ ...new_state });
          });
      } else {
        self.setState({
          ...this.state,
          categories: categories,
        });
      }
    });
  };
  onDrop = (name, acceptedFiles) => {
    console.log(name);
    console.log(acceptedFiles);
    if (this.state.readOnly != true) {
        acceptedFiles.map((file, i) => {
            var formData = new FormData();
            formData.append("file", file)
            axiosInstance.post("/product_photos", formData).then(response => {
                this.setState({
                    ...this.state,
                    product: {
                        ...this.state.product,
                        photo_ids: [...this.state.product.photo_ids, response.data.product_photo.id],
                        photos: [...this.state.product.photos,
                            response.data.product_photo]
                    }
                })
            })
        })
    }

}

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
        instance = axiosInstance.post(`${this.props.authentication.default_path}products`, { ...this.state });
      } else {
        instance = axiosInstance.put(
          `${this.props.authentication.default_path}products/${
            this.state.product_id || this.state.product.uuid
          }`,
          { product: this.state.product }
        );
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setProducts(this.state, response.data.product);
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(
            `/products/${response.data.product.uuid}`
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
              New Product
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="${this.props.authentication.default_path}products/new"
                  >
                    New Product
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="row">
                <Col md={6}>
                <h5>Product Information</h5>
                  <Row>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">SKU</Label>
                      <Input
                        type="text"
                        name="sku"
                        value={this.state.product.sku}
                        placeholder="Product Code / SKU"
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-2">
                    <Label for="sale-price">Active</Label>
                    <Col md={12} className='block'>
                      <Row>
                      <Toggle
                        
                        
                        id='active'
                        defaultChecked={this.state.product.active}
                        checked={this.state.product.active}
                        disabled={this.state.readOnly}
                        onChange={this.handleChangeToggle} />
                        </Row>
                        </Col>
                    </FormGroup>
                    <FormGroup className="col-md-2">
                    <Label for="sale-price">In Stock</Label>
                    <Col md={12} className='block'>
                      <Row>
                      <Toggle
                        
                        id='in_stock'
                        defaultChecked={this.state.product.in_stock}
                        checked={this.state.product.in_stock}
                        disabled={this.state.readOnly}
                        onChange={this.handleChangeToggle} />
                        </Row>
                        </Col>
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-md-12">
                      <Label for="exampleEmail">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        value={this.state.product.name}
                        placeholder="Product Name"
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-md-12">
                      <Label for="exampleEmail">Description</Label>
                      <Input
                        type="textarea"
                        rows={10}
                        name="description"
                        value={this.state.product.description}
                        placeholder="Product Description"
                        onChange={this.onChange}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Price</Label>
                      <NumberField
                        name="regular_price"
                        thousandSeparator={true}
                        displayType={"input"}
                        className={"right"}
                        value={this.state.product.regular_price}
                        onValueChange={this.onValueChange.bind(
                          this,
                          "regular_price"
                        )}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>

                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Sale Price</Label>
                      <NumberField
                        name="sale_price"
                        thousandSeparator={true}
                        displayType={"input"}
                        value={this.state.product.sale_price}
                        onValueChange={this.onValueChange.bind(
                          this,
                          "sale_price"
                        )}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                    <Label for="sale-price">On Sale?</Label>
                    <Col md={12} className='block'>
                      <Row>
                      <Toggle
                        id="on_sale"
                        disabled={this.state.readOnly}
                        defaultChecked={this.state.product.on_sale}
                        checked={this.state.product.on_sale}
                        onChange={this.handleChangeToggle} />
                        </Row>
                        </Col>
                    </FormGroup>
                  </Row>

                  <Row>
                    <FormGroup className="col-md-12">
                      <Label for="exampleEmail">Category</Label>
                      <Select
                        name="category_id"
                        value={this.state.category_id}
                        onChange={this.handleChangeSelect.bind(
                          this,
                          "category_id"
                        )}
                        options={this.state.categories}
                        isDisabled={this.state.readOnly}
                      />
                    </FormGroup>
                  </Row>
                </Col>
                <Col md={6}>
                  <h5>Photos</h5>
                  <Row>
                    
                    <Dropzone onDrop={ this.readOnly ? null : this.onDrop.bind(null, "photos")}>
                                                        {({ getRootProps, getInputProps }) => (

                                                            <Col id='photoBox' {...getRootProps()} className={`${this.state.readOnly ? "" : "dropZone"}  col-md-12`} >
                                                              <input {...getInputProps()} />
                                                                
                                                                <Row>
                                                                {this.state.product.photos.map((img) => {
                                                                  return <ProductImage image={img}  />
                                                                })}
                                                                </Row>
                                                            </Col>

                                                        )}
                                                    </Dropzone>
                  </Row>
                </Col>
                <Col md={12}>
                </Col>

                <Col md={12}>
                  
                    <SubmitButton
                      onClick={this.onSubmit}
                      readOnly={this.state.readOnly}
                      editing={this.state.editing}
                      existing_record={this.state.existing_record}
                    />
                  
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
)(Product));