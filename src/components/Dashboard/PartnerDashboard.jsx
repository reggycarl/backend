import React, { Component } from "react";
import "./Dashboard.scss";
import { Row, Col, Card, CardTitle, CardText } from "reactstrap";
import NoDataYet from "../Layout/NoDataYet";
import { Fragment } from "react";
import axiosInstance from "../misc/Axios";
import NumberFormat from "react-number-format";
import NumberField from "../Controls/NumberField";
import { AreaChart, LineChart } from "react-chartkick";
import "chartkick/chart.js";
export default class Dashboard extends Component {
  state = {
    sales_trend: [],
    orders_trend: [],
    pending_orders: 0,
    products_count: 0,
    account_balance: 0,
    total_sales: 0,
    loading: false,
  };
  componentDidMount = () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    setTimeout(() => {
      console.log("CALLING>>>>");

      axiosInstance
        .get("/partners/dashboard/orders_pending")
        .then((response) => {
          this.setState({
            pending_orders: response.data.data,
          });
        });
      axiosInstance
        .get("/partners/dashboard/products_count")
        .then((response) => {
          this.setState({
            products_count: response.data.data,
          });
        });
      axiosInstance.get("/partners/dashboard/total_sales").then((response) => {
        this.setState({
          total_sales: response.data.data,
        });
      });
      axiosInstance.get("/partners/dashboard/sales_trend").then((response) => {
        this.setState({
          sales_trend: response.data.data,
        });
      });
      axiosInstance.get("/partners/dashboard/orders_trend").then((response) => {
        this.setState({
          orders_trend: response.data.data,
        });
      });
      axiosInstance
        .get("/partners/dashboard/account_balance")
        .then((response) => {
          this.setState({
            account_balance: response.data.data,
          });
        });
    }, 1000);
  };
  render() {
    var dashInfo = [
      { name: "Products", value: this.state.products_count },
      { name: "Orders Pending", value: parseInt(this.state.pending_orders) },
      { name: "Total Sales", value: this.state.total_sales },
      {
        name: "Account Balance (GHS) ",
        value: `GHS ${this.state.account_balance}`,
        type: "number",
      },
    ];
    return (
      <Col className="dashboardContent">
        <Row>
          {dashInfo.map((info, i) => {
            return (
              <Col md={3} className="infoBox">
                <Col className="inner">
                  <Row>
                    <Col className="h-100 value">
                      {info.type == "number" ? (
                        <NumberField value={info.value} />
                      ) : (
                        info.value
                      )}
                    </Col>
                  </Row>
                  <Col className="bottom">{info.name}</Col>
                </Col>
              </Col>
            );
          })}
        </Row>
        <Row>
          <Col md={6}>
            <Card body>
              <CardTitle>Sales in the Last 7 Days</CardTitle>
              <CardText>
                <AreaChart data={this.state.sales_trend} />
              </CardText>
            </Card>
          </Col>
          <Col md={6}>
            <Card body>
              <CardTitle>Orders in the Last 7 Days</CardTitle>
              <CardText>
                <AreaChart data={this.state.orders_trend} />
              </CardText>
            </Card>
          </Col>
          {/* <Col md={3} className="infoBox">
            <Card body className="card50 yellow ">
              <CardText className="inner">
                <h2 className="right">
                  <p>&nbsp;</p>
                  <NumberField value={this.state.total_sales} />
                </h2>
                <Row>
                  <Col className="bottom">Total Sales</Col>
                </Row>
              </CardText>
            </Card>
          </Col> */}
          {/* <Col md={4}>
                        <Card body>
                            <CardTitle>Revenue </CardTitle>
                            <CardText>
                                <NoDataYet />
                            </CardText>
                        </Card>
                    </Col> */}
        </Row>
      </Col>
    );
  }
}
