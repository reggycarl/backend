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
import axiosInstance, { mainBaseurl } from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link, withRouter } from "react-router-dom";
import {
  getOrdersTypes,
  getGenders,
  getMaritalStatuses,
} from "../misc/functions";
import { history } from "../../index";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import NumberField from "../Controls/NumberField";
import Table from "reactstrap/lib/Table";
import printJS from "print-js";
import ChangeStatusModal from "../Modals/ChangeStatusModal";
class Order extends Component {
  state = {
    showChangeStatusModal: false,
    order: {
      base_price: 0,
      insurance: 0,
      maintenance: 0,
      price_per_km: 0,
      price_per_min: 0,
      customer: {},
      order: {},
      product: {},
      status: {},
      carts: [],
    },
    editing: false,
    readOnly:
      this.props.match.params.id != "" && this.props.match.params.id != null,
    order_uuid: this.props.match.params.id,
    existing_record:
      this.props.match.params.id != "" && this.props.match.params.id != null,
  };
  onChange = (e) => {
    console.log(e.target.name);
    this.setState({
      ...this.state,
      order: {
        ...this.state.order,
        [e.target.name]: e.target.value,
      },
    });
  };
  printPickUpDropOffNote = () => {
    this.setState({
      ...this.state,
      printing: true,
    });
    printJS(
      mainBaseurl +
        `/order_docs/drop_off_pickup_note?order_id=${this.state.order.uuid}`
    );
    this.setState({
      ...this.state,
      printing: false,
    });
  };
  printInvoice = () => {
    this.setState({
      ...this.state,
      printing: true,
    });
    printJS(
      mainBaseurl + `/order_docs/invoice?order_id=${this.state.order.uuid}`
    );
    this.setState({
      ...this.state,
      printing: false,
    });
  };
  handleChangeSelect = (selectedOption, val) => {
    var state = {
      ...this.state,
      order: {
        ...this.state.order,
        [selectedOption]: val.value,
      },
      [selectedOption]: val,
    };
    this.setState({ ...state });
  };

  setOrders = (state, order) => {
    console.log("THIS IS STATE", state);
    var new_state = {
      ...state,
      order: order,
      // type_id: state.order_types.
    };
    return new_state;
  };
  onValueChange = (e, val) => {
    console.log(val);

    this.setState({
      ...this.state,
      order: {
        ...this.state.order,
        [e]: val.floatValue,
      },
    });
  };
  componentDidMount = () => {
    var self = this;

    // Promise.all([getVehicleTypes()]).then(([vehicle_types,]) => {
    console.log("ID", this.props.match.params.id);

    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance
        .get(
          this.props.authentication.default_path == "/admins/"
            ? `${this.props.authentication.default_path}cart_orders/${this.state.order_uuid}`
            : `${this.props.authentication.default_path}orders/${this.state.order_uuid}`
        )
        .then((response) => {
          var new_state = {
            ...this.state,
            existing_record: true,
            readOnly: true,
            // vehicle_types: vehicle_types
          };
          new_state = self.setOrders(new_state, response.data.order);
          self.setState({ ...new_state });
        });
    } else {
      self.setState({
        ...this.state,
        // vehicle_types: vehicle_types,
      });
    }

    // })
  };
  confirmPickup = () => {
    console.log("confirming Pickup");
    axiosInstance
      .post(
        `${mainBaseurl}/partners/orders/${this.state.order.uuid}/confirm_available_for_pickup`
      )
      .then((response) => {
        console.log(response.inspect);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            order: {
              ...this.state.order,
              ...response.data.data,
            },
          });
        }
      });
  };
  markAvailableForPickup = () => {
    axiosInstance
      .get(
        `${mainBaseurl}/partners/orders/${this.state.order.uuid}/confirm_available_for_pickup`
      )
      .then((response) => {});
  };
  changeStatus = (id) => {
    console.log("CHANGING STATUS FROM ORDER");
    this.setState({
      ...this.state,
      changingStatus: true,
    });
    axiosInstance
      .post(
        mainBaseurl +
          `/admins/cart_orders/${this.state.order_uuid}/change_status`,
        { status_id: id }
      )
      .then((response) => {
        console.log(response);
        this.setState({
          ...this.state,
          order: {
            ...this.state.order,
            ...response.data.order,
          },
          showChangeStatusModal: false,
          changingStatus: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          changingStatus: false,
        });
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
        instance = axiosInstance.post("/admins/orders", { ...this.state });
      } else {
        instance = axiosInstance.put(
          `/admins/orders/${this.state.order_id || this.state.order.uuid}`,
          { order: this.state.order }
        );
      }

      instance.then((response) => {
        console.log("RESPONSE", response);

        // console.log("Setting state")
        if (this.state.existing_record == true) {
          var new_state = this.setOrders(this.state, response.data.order);
          console.log("THIS IS NEW STATE", new_state);
          this.setState({ ...new_state, readOnly: true });
        } else {
          this.props.history.push(`/admins/orders/${response.data.order.uuid}`);
          // this.setState({ ...this.state, readOnly: true, existing_record: true, editing: false })
        }
      });
    }
  };
  toggleChangeStatusModal = () => {
    this.setState({
      ...this.state,
      showChangeStatusModal: !this.state.showChangeStatusModal,
    });
  };

  render() {
    return (
      <Col md={12}>
        <ChangeStatusModal
          isOpen={this.state.showChangeStatusModal}
          changeStatus={this.changeStatus.bind(this)}
          toggle={this.toggleChangeStatusModal}
          changingStatus={this.state.changingStatus}
          parentForm={this}
        />
        <Card>
          <CardBody>
            <CardTitle className="col-md-12">
              Order Information
              <ul></ul>
            </CardTitle>
            <CardText className="col-md-12">
              <Form className="row">
                <Col md={12}>
                  <Row>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Order Number</Label>
                      <Input
                        type="text"
                        value={this.state.order.order.number}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Status</Label>
                      <Input
                        type="text"
                        value={this.state.order.status_name}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    {this.props.authentication.default_path == "/admins/" ? (
                      <FormGroup className="col-md-4">
                        <Label for="exampleEmail">Merchant</Label>
                        <Input
                          type="text"
                          value={this.state.order.company_name}
                          readOnly={this.state.readOnly}
                        />
                      </FormGroup>
                    ) : (
                      ""
                    )}
                  </Row>
                </Col>

                {/* <Col md={12}>
                                    
                                    <Row>
                                        <FormGroup className='col-md-4'>
                                            <Label for="exampleEmail">Product SKU</Label>
                                            <Input type='text' value={this.state.order.product.sku}  readOnly={this.state.readOnly} />
                                            
                                        </FormGroup>
                                        <FormGroup className='col-md-8'>
                                            <Label for="exampleEmail">Product Name</Label>
                                            <Input type='text' value={this.state.order.product.name}  readOnly={this.state.readOnly} />                                            
                                        </FormGroup>

                                        </Row>
                                     
                                </Col> */}
                {/* <Col md={12}>
                                    
                                    <Row>
                                        <FormGroup className='col-md-4'>
                                            <Label for="exampleEmail">Size</Label>
                                            <Input type='text' value={this.state.order.size_name}  readOnly={this.state.readOnly} />
                                            
                                        </FormGroup>
                                        <FormGroup className='col-md-4'>
                                            <Label for="exampleEmail">Color </Label>
                                            <Input type='text' value={this.state.order.color_name}  readOnly={this.state.readOnly} />                                            
                                        </FormGroup>
                                        </Row>
                                </Col>
                                 */}
                <Col>
                  <Table bordered="true" striped="true">
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.state.order.product.sku}</td>
                        <td>
                          {this.state.order.product.name}
                          <br />
                          <b>Color: </b>
                          {this.state.order.color_name} | <b>Size:</b>{" "}
                          {this.state.order.size_name}{" "}
                        </td>
                        <td className="right">
                          <NumberField value={this.state.order.price} />
                        </td>
                        <td className="right">
                          <NumberField
                            value={this.state.order.quantity}
                            decimalScale={0}
                          />
                        </td>
                        <td className="right">
                          <NumberField
                            value={
                              this.state.order.price * this.state.order.quantity
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Form>
              {this.props.authentication.default_path == "/partners/" ? (
                <Button
                  color="success"
                  onClick={this.confirmPickup}
                  disabled={this.state.order.available_for_pickup}
                >
                  Confirm Pickup
                </Button>
              ) : (
                ""
              )}
              &nbsp;
              <Button
                color="primary"
                onClick={this.printPickUpDropOffNote}
                disabled={
                  !this.state.order.available_for_pickup || this.state.printing
                }
              >
                Print Pick Up/ Drop Off Note
              </Button>
              &nbsp;
              {this.props.authentication.default_path == "/admins/" ? (
                <Button
                  color="primary"
                  onClick={this.printInvoice}
                  disabled={
                    !this.state.order.available_for_pickup ||
                    this.state.printing
                  }
                >
                  Print Invoice
                </Button>
              ) : (
                ""
              )}
              &nbsp;
              {this.props.authentication.default_path == "/admins/" ? (
                <Button
                  color="primary"
                  onClick={this.toggleChangeStatusModal}
                  disabled={this.state.printing}
                >
                  Change Status
                </Button>
              ) : (
                ""
              )}
              &nbsp;
              <Button
                color="danger"
                disabled={
                  this.state.order.available_for_pickup ||
                  this.state.order.confirmed
                }
              >
                Cancel Order
              </Button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));
