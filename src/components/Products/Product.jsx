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
  Nav,
  NavItem,
  NavLink,
  Button,
  TabContent,
  TabPane,
} from "reactstrap";
import Select from "../Controls/Select";
import SizesModal from "../Modals/SizesModal";
import _ from "lodash";
import moment from "moment";
import axiosInstance from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link, withRouter } from "react-router-dom";
import Toggle from "react-toggle";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import { connect } from "react-redux";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import "./products.scss";

import {
  getProductsTypes,
  getGenders,
  getMaritalStatuses,
  getCountries,
  getBrands,
  getDeliveryTypes,
  getProductTaxes,
} from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import "react-toggle/style.css";
import Dropzone from "react-dropzone";
import ProductImage from "./ProductImage";
import { FaCross, FaPlus } from "react-icons/fa";
import ColorsModal from "../Modals/ColorsModal";
import CategoriesModal from "../Modals/CategoriesModal";
import ProductUploadsModal from "../Modals/ProductsUploadModal";
import ProductTags from "../Controls/ProductTags";
import CustomEditor from "../Controls/Editor";
class Product extends Component {
  state = {
    activeTab: 1,
    product: {
      regular_price: 0,
      weight: 0,
      dimentaions: "",
      sale_price: 0,
      rank: 1,
      quantity: 0,
      name: "",
      description: "",
      production_country_id: null,
      category_id: null,
      on_sale: false,
      active: true,
      in_stock: true,
      photos: [],
      photo_ids: [],
      category_ids: [],
      categories: [],
      size_ids: [],
      tags: [],
      tag_ids: [],
      sizes: [],
      color_ids: [],
      colors: [],
    },
    categories: [],
    showProductsUploadModal: false,
    showCategoriesModal: false,
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    product_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  addTag = (tag) => {
    var tags = [tag];
    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        tags: tags,
        tag_ids: tags.map((tag) => {
          return tag.id;
        }),
      },
    });
  };
  removeTag = (index) => {
    var tags = [...this.state.product.tags];
    tags.splice(index, 1);
    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        tags: [...tags],
        tag_ids: tags.map((tag) => {
          return tag.id;
        }),
      },
    });
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
  onDateChanged = (attr_name, momentdate) => {
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
  handleEditorChange = (attr, val, e) => {
    console.log("VAL", val);
    console.log("ATTR", attr);
    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        [attr]: val,
      },
    });
  };
  onCheckBoxChanged = (e) => {
    console.log(e.target.id);
    var val = parseInt(e.target.id);
    var new_category_ids = this.state.product.category_ids;
    if (new_category_ids.includes(val)) {
      new_category_ids = new_category_ids.filter(function (item) {
        return item !== val;
      });
    } else {
      new_category_ids.push(val);
    }

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        category_ids: new_category_ids,
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
  handleChangeToggle = (component) => {
    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        [component.target.id]: component.target.checked,
      },
    });
  };

  onDateChanged = (attr_name, momentdate) => {
    // console.log("ClassName is", momentdate.constructor.name)
    console.log("THIS IS DATE", momentdate);
    console.log("THIS IS ATTR", attr_name);
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
  setInvoice = (state, invoice) => {
    console.log("THIS IS OBJ", invoice);
    invoice = {
      ...invoice,
      date: new moment(invoice.date),
      items_attributes: invoice.items_attributes.map((itm, i) => {
        return {
          ...itm,
          product: state.products.find((obj) => obj.value == itm.product_id),
        };
      }),
    };
    var new_state = {
      ...state,
      invoice: invoice,
    };
    return new_state;
  };
  setProducts = (state, product) => {
    console.log("THIS IS STATE", state);
    var new_state = {
      ...state,
      product: {
        ...product,

        sale_start: new moment(product.sale_start),
        sale_end: new moment(product.sale_end),
      },
      category_id: state.categories.find(
        (obj) => obj.value == product.category_id
      ),
      brand_id: state.brands.find((obj) => obj.value == product.brand_id),
      delivery_type_id: state.delivery_types.find(
        (obj) => obj.value == product.delivery_type_id
      ),
      tax_id: state.taxes.find((obj) => obj.value == product.tax_id),

      production_country_id: state.countries.find(
        (obj) => obj.value == product.production_country_id
      ),
    };
    return new_state;
  };
  delete = (e) => {
    e.preventDefault();
    axiosInstance
      .delete(
        `${this.props.authentication.default_path}products/${this.state.product_uuid}`
      )
      .then((response) => {
        this.props.history.push(
          `${this.props.authentication.default_path}products`
        );
      });
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

    Promise.all([
      getCountries(),
      getBrands(),
      getDeliveryTypes(),
      getProductTaxes(),
    ]).then(([countries, brands, delivery_types, taxes]) => {
      if (self.state.existing_record == true) {
        console.log("FECHING EXISTING RECORD");
        axiosInstance
          .get(
            `${this.props.authentication.default_path}products/${this.state.product_uuid}`
          )
          .then((response) => {
            var new_state = {
              ...this.state,
              existing_record: true,
              readOnly: true,
              brands: brands,
              countries: countries,
              delivery_types: delivery_types,
              taxes: taxes,
            };
            new_state = self.setProducts(new_state, response.data.product);
            self.setState({ ...new_state });
          });
      } else {
        self.setState({
          ...this.state,
          brands: brands,
          countries: countries,
          delivery_types: delivery_types,
          taxes: taxes,
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
        formData.append("file", file);
        axiosInstance.post("/product_photos", formData).then((response) => {
          this.setState({
            ...this.state,
            product: {
              ...this.state.product,
              photo_ids: [
                ...this.state.product.photo_ids,
                response.data.product_photo.id,
              ],
              photos: [
                ...this.state.product.photos,
                response.data.product_photo,
              ],
            },
          });
        });
      });
    }
  };

  removePhoto = (photo) => {
    axiosInstance.delete(`/product_photos/${photo.id}`).then((response) => {
      if (response.status == 200) {
        if (!_.isEmpty(response.data.product)) {
          console.log("USING 1");
          this.setState({
            ...this.state,
            product: {
              ...this.state.product,
              photo_ids: [
                ...response.data.product.photo_ids,
                // response.data.product_photo.id,
              ],
              photos: [
                ...response.data.product.photos,
                // response.data.product_photo,
              ],
            },
          });
        } else {
          console.log("USING 2");
          var photo_ids = this.state.product.photo_ids;
          var photos = this.state.product.photos;
          console.log("PHOTOIDS BEFORE", photo_ids);
          console.log("PHOTOS BEFORE", photos);
          photo_ids = photo_ids.filter((pid) => pid != photo.id);
          photos = photos.filter((curr_photo) => {
            console.log("THIS IS PHOTO", photo);
            return curr_photo.id != photo.id;
          });
          console.log("PHOTOIDS AFTER", photo_ids);
          console.log("PHOTOS AFTER", photos);
          this.setState({
            ...this.state,
            product: {
              ...this.state.product,
              photo_ids: photo_ids,
              photos: photos,
            },
          });
        }
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
        instance = axiosInstance.post(
          `${this.props.authentication.default_path}products?company_id=${this.props.authentication.user.current_company_id}`,
          { ...this.state }
        );
      } else {
        instance = axiosInstance.put(
          `${this.props.authentication.default_path}products/${
            this.state.product_id || this.state.product.uuid
          }?company_id=${this.props.authentication.user.current_company_id}`,
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
            `${this.props.authentication.default_path}products/${response.data.product.uuid}`
          );
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  };
  selectSize = (size) => {
    console.log(size);
    var new_size_ids = [...this.state.product.size_ids];
    var new_sizes = [...this.state.product.sizes];
    var index = new_size_ids.indexOf(size.id);
    if (index !== -1) {
      new_size_ids.splice(index, 1);
      new_sizes = new_sizes.filter((cat) => {
        return cat.id != size.id;
      });
    } else {
      new_size_ids.push(size.id);
      new_sizes.push(size);
    }

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        size_ids: new_size_ids,
        sizes: new_sizes,
      },
    });
  };

  removeSize = (e) => {
    console.log("THIS IS SIZE", e);
    // e.preventDefault();
    var new_size_ids = [...this.state.product.size_ids];
    var new_sizes = [...this.state.product.sizes];
    var id = parseInt(e);
    console.log("THIS IS ID", id);
    var index = new_size_ids.indexOf(id);
    if (index !== -1) {
      new_size_ids.splice(index, 1);
      new_sizes = new_sizes.filter((cat) => {
        return cat.id != id;
      });
    }

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        size_ids: new_size_ids,
        sizes: new_sizes,
      },
    });
  };

  selectColor = (color) => {
    console.log("THIS IS THE COLOR", color);
    var new_color_ids = [...this.state.product.color_ids];
    var new_colors = [...this.state.product.colors];
    var index = new_color_ids.indexOf(color.id);
    if (index !== -1) {
      new_color_ids.splice(index, 1);
      new_colors = new_colors.filter((cat) => {
        return cat.id != color.id;
      });
    } else {
      new_color_ids.push(color.id);
      new_colors.push(color);
    }
    console.log("NEW COLORS", new_colors);

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        color_ids: new_color_ids,
        colors: new_colors,
      },
    });
  };

  removeColor = (e) => {
    console.log(e);
    // e.preventDefault();
    var new_color_ids = [...this.state.product.color_ids];
    var new_colors = [...this.state.product.colors];
    var id = parseInt(e);
    console.log("THIS IS ID", id);
    var index = new_color_ids.indexOf(id);
    if (index !== -1) {
      new_color_ids.splice(index, 1);
      new_colors = new_colors.filter((cat) => {
        return cat.id != id;
      });
    }

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        color_ids: new_color_ids,
        colors: new_colors,
      },
    });
  };
  selectCategory = (category) => {
    console.log("THIS IS THE SELCTED CATEGORY", category);

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        category_id: category.id,
        category: category,
      },
    });
  };

  approveProduct = (e) => {
    e.preventDefault();
    axiosInstance
      .post(`/admins/products/${this.state.product.uuid}/approve`)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            product: response.data.product,
          });
        }
      });
  };

  removeCategory = (e) => {
    console.log(e);
    e.preventDefault();
    var new_category_ids = [...this.state.product.category_ids];
    var new_categories = [...this.state.product.categories];
    var id = parseInt(e.target.name);
    console.log("THIS IS ID", id);
    var index = new_category_ids.indexOf(id);
    if (index !== -1) {
      new_category_ids.splice(index, 1);
      new_categories = new_categories.filter((cat) => {
        return cat.id != id;
      });
    }

    this.setState({
      ...this.state,
      product: {
        ...this.state.product,
        category_ids: new_category_ids,
        categories: new_categories,
      },
    });
  };

  toggleSizesModal = () => {
    this.setState({
      ...this.state,
      showSizesModal: !this.state.showSizesModal,
    });
  };
  toggleProductsUploadModal = () => {
    this.setState({
      ...this.state,
      showProductsUploadModal: !this.state.showProductsUploadModal,
    });
  };
  toggleColorsModal = () => {
    this.setState({
      ...this.state,
      showColorsModal: !this.state.showColorsModal,
    });
  };
  toggleCategoriesModal = () => {
    this.setState({
      ...this.state,
      showCategoriesModal: !this.state.showCategoriesModal,
    });
  };

  render() {
    return (
      <Col md={12} className={"wrapper"}>
        <SizesModal
          isOpen={this.state.showSizesModal}
          selectSize={this.selectSize.bind(this)}
          toggle={this.toggleSizesModal}
          size_ids={this.state.product.size_ids}
          parentForm={this}
        />
        <CategoriesModal
          isOpen={this.state.showCategoriesModal}
          category_id={this.state.product.category_id}
          selectCategory={this.selectCategory.bind(this)}
          toggle={this.toggleCategoriesModal}
          parentForm={this}
        />
        <ColorsModal
          isOpen={this.state.showColorsModal}
          selectColor={this.selectColor.bind(this)}
          toggle={this.toggleColorsModal}
          color_ids={this.state.product.color_ids}
          parentForm={this}
        />
        <ProductUploadsModal
          isOpen={this.state.showProductsUploadModal}
          toggle={this.toggleProductsUploadModal}
          parentForm={this}
        />
        <Card>
          <CardBody>
            <CardTitle className="col-md-12">
              New Product
              <ul>
                {this.props.authentication.default_path == "/partners/" ? (
                  <li>
                    <Link
                      className="btn btn-success btn-sm"
                      to={`${this.props.authentication.default_path}products/new`}
                    >
                      New Product
                    </Link>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={{ active: this.state.activeTab == "1" }}
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        activeTab: 1,
                      });
                    }}
                  >
                    Product Information
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={{ active: this.state.activeTab == "2" }}
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        activeTab: 2,
                      });
                    }}
                  >
                    Additional Information
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={{ active: this.state.activeTab == "3" }}
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        activeTab: 3,
                      });
                    }}
                  >
                    Pictures
                  </NavLink>
                </NavItem>
              </Nav>
              <Form>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane
                    tabId="1"
                    className={this.state.activeTab == "1" ? "active" : ""}
                  >
                    <Row>
                      <Col md={4}>
                        <Row>
                          <FormGroup className="col-md-12">
                            <Label for="exampleEmail">SKU</Label>
                            <Input
                              type="text"
                              name="sku"
                              value={this.state.product.sku}
                              placeholder="Product Code / SKU"
                              onChange={this.onChange}
                              readOnly={true}
                            />
                          </FormGroup>
                        </Row>
                      </Col>
                      <Col md={4}>
                        <Row>
                          <FormGroup className="col-md-3">
                            <Label for="sale-price">Active</Label>
                            <Col md={12} className="block">
                              <Row>
                                <Toggle
                                  id="active"
                                  defaultChecked={this.state.product.active}
                                  checked={this.state.product.active}
                                  disabled={this.state.readOnly}
                                  onChange={this.handleChangeToggle}
                                />
                              </Row>
                            </Col>
                          </FormGroup>
                          <FormGroup className="col-md-3">
                            <Label for="sale-price">In Stock</Label>
                            <Col md={12} className="block">
                              <Row>
                                <Toggle
                                  id="in_stock"
                                  defaultChecked={this.state.product.in_stock}
                                  checked={this.state.product.in_stock}
                                  disabled={this.state.readOnly}
                                  onChange={this.handleChangeToggle}
                                />
                              </Row>
                            </Col>
                          </FormGroup>
                          <FormGroup className="col-md-3">
                            {this.props.authentication.default_path ==
                            "/admins/" ? (
                              <>
                                <Label for="sale-price">Featured</Label>
                                <Col md={12} className="block">
                                  <Row>
                                    <Toggle
                                      id="featured"
                                      defaultChecked={
                                        this.state.product.featured
                                      }
                                      checked={this.state.product.featured}
                                      disabled={this.state.readOnly}
                                      onChange={this.handleChangeToggle}
                                    />
                                  </Row>
                                </Col>
                              </>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                          <FormGroup className="col-md-3">
                            <Label for="sale-price">On Sale?</Label>
                            <Col md={12} className="block">
                              <Row>
                                <Toggle
                                  id="on_sale"
                                  disabled={this.state.readOnly}
                                  defaultChecked={this.state.product.on_sale}
                                  checked={this.state.product.on_sale}
                                  onChange={this.handleChangeToggle}
                                />
                              </Row>
                            </Col>
                          </FormGroup>
                        </Row>
                      </Col>
                      <Col md={4}>
                        <Row>
                          <FormGroup className="col-md-6">
                            <Label for="sale-price">Sale Start</Label>
                            <Col md={12} className="block">
                              <Row>
                                <Datetime
                                  type="name"
                                  dateFormat="DD-MM-YYYY"
                                  name="sale_start"
                                  timeFormat={false}
                                  value={this.state.product.sale_start}
                                  onChange={this.onDateChanged.bind(
                                    this,
                                    "sale_start"
                                  )}
                                  inputProps={{ disabled: this.state.readOnly }}
                                />
                              </Row>
                            </Col>
                          </FormGroup>
                          <FormGroup className="col-md-6">
                            <Label for="sale-price">Sale End</Label>
                            <Col md={12} className="block">
                              <Row>
                                <Datetime
                                  type="name"
                                  dateFormat="DD-MM-YYYY"
                                  name="sale_end"
                                  timeFormat={false}
                                  value={this.state.product.sale_end}
                                  onChange={this.onDateChanged.bind(
                                    this,
                                    "sale_end"
                                  )}
                                  inputProps={{ disabled: this.state.readOnly }}
                                />
                              </Row>
                            </Col>
                          </FormGroup>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <FormGroup className="col-md-10">
                        <Label for="exampleEmail">Category</Label>
                        <Input
                          type="text"
                          name="name"
                          value={
                            this.state.product.category
                              ? this.state.product.category.name
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
                      <FormGroup className="col-md-3">
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

                      <FormGroup className="col-md-3">
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
                      <FormGroup className="col-md-3">
                        <Label for="exampleEmail">Quantity</Label>
                        <NumberField
                          thousandSeparator={true}
                          displayType={"input"}
                          decimalScale={0}
                          value={this.state.product.quantity}
                          onValueChange={this.onValueChange.bind(
                            this,
                            "quantity"
                          )}
                          readOnly={this.state.readOnly}
                        />
                      </FormGroup>
                      {this.props.authentication.default_path == "/admins/" ? (
                        <FormGroup className="col-md-3">
                          <Label for="exampleEmail">Rank</Label>
                          <NumberField
                            thousandSeparator={true}
                            displayType={"input"}
                            decimalScale={0}
                            value={this.state.product.rank}
                            onValueChange={this.onValueChange.bind(
                              this,
                              "rank"
                            )}
                            readOnly={this.state.readOnly}
                          />
                        </FormGroup>
                      ) : (
                        ""
                      )}
                    </Row>
                    {/* <Col md={12}> */}
                    <Row>
                      <FormGroup className="col-md-12">
                        <Label for="exampleEmail">Description</Label>
                        <CustomEditor
                          disabled={this.state.disabled}
                          onChange={this.handleEditorChange.bind(
                            this,
                            "description"
                          )}
                          name={"description"}
                          value={this.state.product.description || ""}
                        />
                      </FormGroup>
                    </Row>

                    {/* </Col> */}
                  </TabPane>
                  <TabPane
                    tabId="2"
                    className={this.state.activeTab == "2" ? "active" : ""}
                  >
                    <Row>
                      <FormGroup className="col-md-3">
                        <Label for="exampleEmail">Brand </Label>

                        <Select
                          name="brand_id"
                          value={this.state.brand_id}
                          onChange={this.handleChangeSelect.bind(
                            this,
                            "brand_id"
                          )}
                          options={this.state.brands}
                          isDisabled={this.state.readOnly}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-3">
                        <Label for="exampleEmail">Main Material</Label>
                        <Input
                          type="text"
                          name="main_material"
                          value={this.state.product.main_material}
                          placeholder="Product Material "
                          onChange={this.onChange}
                          readOnly={this.state.readOnly}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-3">
                        <Label for="exampleEmail">Weight(kg)</Label>
                        <NumberField
                          name="weight"
                          thousandSeparator={true}
                          displayType={"input"}
                          className={"right"}
                          value={this.state.product.weight}
                          onValueChange={this.onValueChange.bind(
                            this,
                            "weight"
                          )}
                          readOnly={this.state.readOnly}
                        />
                      </FormGroup>

                      <FormGroup className="col-md-3">
                        <Label for="exampleEmail">Dimensions (LxWxH)</Label>
                        <Input
                          type="text"
                          rows={10}
                          name="dimensions"
                          value={this.state.product.dimensions}
                          placeholder="Product Dimensions "
                          onChange={this.onChange}
                          readOnly={this.state.readOnly}
                        />
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup className="col-md-3">
                        <Label for="exampleEmail">Tax</Label>

                        <Select
                          name="tax_id"
                          value={this.state.tax_id}
                          onChange={this.handleChangeSelect.bind(
                            this,
                            "tax_id"
                          )}
                          options={this.state.taxes}
                          isDisabled={this.state.readOnly}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-3">
                        <Label for="exampleEmail">Production Country</Label>

                        <Select
                          name="production_country_id"
                          value={this.state.production_country_id}
                          onChange={this.handleChangeSelect.bind(
                            this,
                            "production_country_id"
                          )}
                          options={this.state.countries}
                          isDisabled={this.state.readOnly}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-3">
                        <Label for="">Delivery Type</Label>

                        <Select
                          name="delivery_type_id"
                          value={this.state.delivery_type_id}
                          onChange={this.handleChangeSelect.bind(
                            this,
                            "delivery_type_id"
                          )}
                          options={this.state.delivery_types}
                          isDisabled={this.state.readOnly}
                        />
                      </FormGroup>
                    </Row>

                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    {/* <Row>
              <FormGroup className="col-md-12">
                  <Label for="exampleEmail">Categories</Label>
                 
                  <Col className={"attributesBox"}>
                        {this.state.product.categories.map((cat)=> {
                          return <Button className={"pill"} disabled={this.state.readOnly} size={"sm"} name={cat.id} onClick={this.removeCategory.bind(cat.id)} >{cat.name}  <span className='removeBtn'>x</span> </Button>
                        })}
                  </Col>
                  
                  <Button  color="primary" size={"sm"} className="action_button" disabled={this.state.readOnly} ><FaPlus /> Add Category</Button>

                </FormGroup>
                
              </Row> */}
                    <Row>
                      <FormGroup className="col-md-6">
                        <Label for="exampleEmail">Sizes</Label>

                        <Col className={"attributesBox"}>
                          {this.state.product.sizes.map((size) => {
                            return (
                              <Button
                                className={"pill"}
                                disabled={this.state.readOnly}
                                size={"sm"}
                                name={size.id}
                                onClick={(e) => this.removeSize(size.id)}
                              >
                                {size.name} <span className="removeBtn">x</span>{" "}
                              </Button>
                            );
                          })}
                        </Col>

                        <Button
                          color="primary"
                          size={"sm"}
                          className="action_button"
                          disabled={this.state.readOnly}
                          onClick={this.toggleSizesModal}
                        >
                          <FaPlus /> Add Size
                        </Button>
                      </FormGroup>

                      <FormGroup className="col-md-6">
                        <Label for="exampleEmail">Colors</Label>
                        <Col className={"attributesBox"}>
                          {this.state.product.colors.map((color) => {
                            return (
                              <Button
                                className={"pill"}
                                disabled={this.state.readOnly}
                                style={{
                                  backgroundColor: "#" + color.hex_code,
                                }}
                                size={"sm"}
                                name={color.id}
                                onClick={(e) => this.removeColor(color.id)}
                              >
                                {color.name}{" "}
                                <span className="removeBtn">x</span>{" "}
                              </Button>
                            );
                          })}
                        </Col>
                        <Button
                          color="primary"
                          size={"sm"}
                          className="action_button"
                          disabled={this.state.readOnly}
                          onClick={this.toggleColorsModal}
                        >
                          <FaPlus /> Add Color
                        </Button>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className="col-md-12">
                        <Label for="exampleEmail">Tags</Label>
                        <ProductTags
                          readOnly={this.state.readOnly}
                          tags={this.state.product.tags}
                          addTag={this.addTag}
                          removeTag={this.removeTag}
                        />
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className="col-md-12">
                        <Label for="exampleEmail">Key Features</Label>

                        <CustomEditor
                          disabled={this.state.disabled}
                          onChange={this.handleEditorChange.bind(
                            this,
                            "key_features"
                          )}
                          name={"key_features"}
                          value={this.state.product.key_features || ""}
                        />

                        {/* <Input
                          type="textarea"
                          rows={10}
                          name="key_features"
                          value={this.state.product.key_features}
                          placeholder="Key Features of Product"
                          onChange={this.onChange}
                          readOnly={this.state.readOnly}
                        /> */}
                      </FormGroup>
                      <FormGroup className="col-md-12">
                        <Label for="exampleEmail">Whats in the Box?</Label>
                        <CustomEditor
                          disabled={this.state.disabled}
                          onChange={this.handleEditorChange.bind(
                            this,
                            "whats_in_the_box"
                          )}
                          name={"whats_in_the_box"}
                          value={this.state.product.whats_in_the_box || ""}
                        />
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup className="col-md-12">
                        <Label for="exampleEmail">Warranty Information</Label>
                        <Input
                          type="textarea"
                          rows={10}
                          name="warranty"
                          value={this.state.product.warranty}
                          placeholder="Warranty Information"
                          onChange={this.onChange}
                          readOnly={this.state.readOnly}
                        />
                      </FormGroup>
                    </Row>
                  </TabPane>

                  <TabPane
                    tabId="2"
                    className={this.state.activeTab == "3" ? "active" : ""}
                  >
                    <Col md={12}>
                      <Row>
                        <Dropzone
                          onDrop={
                            this.readOnly
                              ? null
                              : this.onDrop.bind(null, "photos")
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

                              <Row>
                                {this.state.product.photos.map((img) => {
                                  return (
                                    <ProductImage
                                      image={img}
                                      removePhoto={this.removePhoto}
                                    />
                                  );
                                })}
                              </Row>
                            </Col>
                          )}
                        </Dropzone>
                      </Row>
                    </Col>
                  </TabPane>
                </TabContent>
                <Row>
                  <Col md={12}>
                    {this.props.authentication.default_path == "/partners/" ||
                    this.props.authentication.default_path == "/admins/" ||
                    !_.isEmpty(
                      this.props.authentication.user.current_company
                    ) ? (
                      <SubmitButton
                        onClick={this.onSubmit}
                        readOnly={this.state.readOnly}
                        editing={this.state.editing}
                        existing_record={this.state.existing_record}
                      />
                    ) : (
                      ""
                    )}
                    &nbsp;
                    {(this.props.authentication.default_path == "/partners/" ||
                      !_.isEmpty(
                        this.props.authentication.user.current_company
                      )) &&
                    this.state.existing_record != true ? (
                      <Button onClick={this.toggleProductsUploadModal}>
                        Bulk Products
                      </Button>
                    ) : (
                      ""
                    )}
                    &nbsp;
                    {this.props.authentication.default_path == "/admins/" &&
                    this.state.readOnly ? (
                      <Button
                        color={"success"}
                        onClick={this.approveProduct}
                        disabled={this.state.product.approver_id}
                      >
                        {this.state.product.approver_id
                          ? "Approved"
                          : "Approve Product"}
                      </Button>
                    ) : (
                      ""
                    )}
                    &nbsp;
                    {this.state.readOnly &&
                    this.state.product.approver_id == null ? (
                      <Button
                        color={"danger"}
                        onClick={this.delete}
                        disabled={this.state.product.approver_id}
                      >
                        Delete Product
                      </Button>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
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
  connect(mapStateToProps, mapDispatchToProps)(Product)
);
