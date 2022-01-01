import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link, withRouter } from "react-router-dom";
import axiosInstance, { baseurl, mainBaseurl } from "../misc/Axios";
import * as actions from "../../actions";
import { connect } from "react-redux";
import _ from "lodash";
import { bindActionCreators } from "redux";

class Orders extends Component {
  componentDidMount = () => {
    // console.log("PROPS ARE", this.props)
  };
  render() {
    var actions = [
      {
        name: "Available for Pickup",
        color: "success",
        url: `${mainBaseurl}/partners/orders/:uuid/confirm_available_for_pickup`,
        active_param: "available_for_pickup",
      },

      {
        name: "Cancel",
        color: "danger",
        url: `${mainBaseurl}/partners/orders/:uuid/cancel`,
      },
    ];
    var columns = [
      { name: "number", field: "order_number" },
      { name: "Product", field: "product_name" },
      { name: "quantity" },
      { name: "price", number: true },
      { name: "created_at" },
      { name: "status", field: "status_name" },
    ];
    if (this.props.authentication.default_path == "/admins/") {
      var columns = [
        { name: "number", field: "order_number" },

        { name: "Product", field: "product_name" },
        { name: "Customer", field: "customer_name" },
        { name: "quantity" },
        { name: "price", number: true },
        { name: "created_at" },
        { name: "status", field: "status_name" },
        { name: "merchant", field: "company_name" },
      ];
    }
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>
              Orders
              <ul>
                {false ? (
                  <li>
                    <Link
                      className="btn btn-success btn-sm"
                      to="/partners/orders/new"
                    >
                      Orders
                    </Link>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </CardTitle>
            <CardText>
              <ReactWillPaginateTable
                axiosInstance={axiosInstance}
                columns={columns}
                endpoint={
                  this.props.authentication.default_path == "/admins/"
                    ? `${this.props.authentication.default_path}cart_orders`
                    : `${this.props.authentication.default_path}orders`
                }
                link_endpoint={
                  this.props.authentication.default_path == "/admins/"
                    ? `${this.props.authentication.default_path}cart_orders`
                    : `${this.props.authentication.default_path}orders`
                }
                {...this.props}
                actions={
                  this.props.authentication.default_path == "/partners/"
                    ? actions
                    : []
                }
              />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Orders));
