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

import moment from "moment";
import axiosInstance from "../misc/Axios";
import SubmitButton from "../Controls/SubmitButton";
import { Link } from "react-router-dom";
import {
  formatDateTime,
  getOrdersTypes,
  getGenders,
  getMaritalStatuses,
} from "../misc/functions";
import { history } from "../../index";
import NumberField from "../Controls/NumberField";
import Table from "reactstrap/lib/Table";
import _ from "lodash";
import CancelModal from "../Modals/CancelModal";
import ConfirmOrderModal from "../Modals/ConfirmModal";
import ConfirmModal from "../Modals/ConfirmModal";
export default class Order extends Component {
  state = {
    order: {
      base_price: 0,
      insurance: 0,
      maintenance: 0,
      price_per_km: 0,
      price_per_min: 0,
      customer: {},
      status: {},
      carts: [],
    },
    showConfirmModal: false,
    showCancelModal: false,
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
    // console.log("VEHICLE TYPES", vehicle_types)
    if (self.state.existing_record == true) {
      console.log("FECHING EXISTING RECORD");
      axiosInstance
        .get(`/admins/orders/${this.state.order_uuid}`)
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
      });
    }

    // })
  };
  confirmOrder = () => {
    console.log("confirming Order");
    this.setState({
      ...this.state,
      showConfirmModal: true,
    });
  };
  cancelOrder = () => {
    console.log("cancelling Order");
    this.setState({
      ...this.state,
      showCancelModal: true,
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
  toggleCancelModal = () => {
    this.setState({
      ...this.state,
      showCancelModal: !this.state.showCancelModal,
    });
  };
  toggleConfirmModal = () => {
    this.setState({
      ...this.state,
      showConfirmModal: !this.state.showConfirmModal,
    });
  };

  setOrder = (data) => {
    this.setState({
      ...this.state,
      showCancelModal: false,
      showConfirmModal: false,
      order: {
        ...data.order,
      },
    });
  };
  render() {
    return (
      <Col md={12}>
        <CancelModal
          object_name={"Order"}
          action_url={`/admins/orders/${this.state.order.uuid}`}
          setObject={this.setOrder}
          isOpen={this.state.showCancelModal}
          toggle={this.toggleCancelModal}
          parentForm={this}
        />
        <ConfirmModal
          object_name={"Order"}
          action_url={`/admins/orders/${this.state.order.uuid}/confirm`}
          setObject={this.setOrder}
          isOpen={this.state.showConfirmModal}
          toggle={this.toggleConfirmModal}
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
                        value={this.state.order.number}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Status</Label>
                      <Input
                        type="text"
                        value={this.state.order.status.name}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Date</Label>
                      <Input
                        type="text"
                        value={formatDateTime(this.state.order.created_at)}
                        readOnly={true}
                      />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Customer Name </Label>
                      <Input
                        type="text"
                        value={this.state.order.customer.full_name}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Customer Phone </Label>
                      <Input
                        type="text"
                        value={this.state.order.customer.phone}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Customer Email </Label>
                      <Input
                        type="text"
                        value={this.state.order.customer.email}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-md-8">
                      <Label for="exampleEmail">Shipping Address </Label>
                      <Input
                        type="textarea"
                        rows={7}
                        value={this.state.order.shipping_address_information}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="exampleEmail">Delivery Method</Label>
                      <Input
                        type="text"
                        rows={7}
                        value={this.state.order.delivery_method_name}
                        readOnly={this.state.readOnly}
                      />
                    </FormGroup>
                  </Row>
                </Col>

                <Col md={12}>
                  <h4>Items in Order</h4>
                  <Table striped={true} bordered={true}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Partner</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.order.carts.map((cart, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{cart.product.sku}</td>
                            <td>
                              {cart.product.name} <br />
                              <b>Size:</b> {cart.size_name || "N/A"} |{" "}
                              <b>Color:</b> {cart.color_name || "N/A"}
                            </td>
                            <td>{cart.product.company.name}</td>
                            <td className="right">
                              <NumberField value={cart.product.price} />
                            </td>
                            <td className="right">{cart.quantity}</td>
                            <td className="right">
                              <NumberField
                                value={cart.product.price * cart.quantity}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={6}>Discounts</td>
                        <td className="right">
                          (
                          <NumberField
                            value={this.state.order.discount_amount}
                          />
                          )
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6}>Delivery Fee</td>
                        <td className="right">
                          <NumberField value={this.state.order.delivery_fee} />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6}>
                          <b>Total</b>
                        </td>
                        <td className="right">
                          <b>
                            <NumberField
                              value={this.state.order.total_amount}
                            />
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <h5>Payments on Order</h5>
                  <Table striped={true} bordered={true}>
                    <thead>
                      <td>Reference</td>
                      <td>Description</td>
                      <td>Amount</td>
                      <td>Status</td>
                    </thead>
                    <tbody>
                      {_.isEmpty(this.state.order.payments)
                        ? this.noPayments()
                        : this.paymentsList()}
                    </tbody>
                  </Table>
                </Col>
              </Form>
              <Button
                color="success"
                onClick={this.confirmOrder}
                disabled={
                  this.state.order.confirmed || this.state.order.cancelled
                }
              >
                Confirm Order
              </Button>
              &nbsp;
              <Button
                color="danger"
                disabled={
                  this.state.order.confirmed || this.state.order.cancelled
                }
                onClick={this.cancelOrder}
              >
                Cancel Order
              </Button>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
  noPayments() {
    return (
      <tr>
        <td colSpan={4} className="centered">
          No Payments for this Order
        </td>
      </tr>
    );
  }
  paymentsList() {
    return this.state.order.payments.map((pmt) => {
      return (
        <tr>
          <td>{pmt.number} </td>
          <td>{pmt.description} </td>
          <td className="right">
            <NumberField value={pmt.amount} />
          </td>
          <td>{pmt.status_name} </td>
        </tr>
      );
    });
  }
}
