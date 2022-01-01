import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link, withRouter } from "react-router-dom";
import axiosInstance from "../misc/Axios";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { BarChart, ColumnChart, PieChart } from "react-chartkick";
import "chartkick/chart.js";

import _ from "lodash";

import { bindActionCreators } from "redux";
import Table from "reactstrap/lib/Table";
import NumberField from "../Controls/NumberField";
class TopSKUByOrders extends Component {
  state = {
    data: {},
  };
  componentDidMount = () => {
    axiosInstance.get(`/admins/reports/top_sku_by_orders`).then((response) => {
      console.log("THIS IS RESPONSE FON SERVER", response);
      if (response.status == 200) {
        this.setState({
          ...this.state,
          data: response.data.data,
        });
      }
    });
  };
  render() {
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>Top SKU's By Orders</CardTitle>
            <CardText>
              <ColumnChart data={this.state.data} />
              <p>&nbsp;</p>
              <Table striped={true} bordered={true}>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Orders Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(this.state.data).map((item) => {
                    return (
                      <tr>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
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
  connect(mapStateToProps, mapDispatchToProps)(TopSKUByOrders)
);
