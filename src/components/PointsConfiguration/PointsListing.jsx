import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link, withRouter } from "react-router-dom";
import axiosInstance from "../misc/Axios";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { BarChart, ColumnChart, LineChart, PieChart } from "react-chartkick";
import "chartkick/chart.js";

import _ from "lodash";

import { bindActionCreators } from "redux";
import Table from "reactstrap/lib/Table";
import NumberField from "../Controls/NumberField";
import ReportFilterWidget from "../ReportFilterWidget/ReportFilterWidget";
import moment from "moment";

import "react-datetime/css/react-datetime.css";
class PointsListing extends Component {
  state = {
    data: [],
    loading: false,
    start_date: new moment(),
    end_date: new moment(),
  };
  componentDidMount = () => {
    this.populate();
  };
  run = (e) => {
    e.preventDefault();
    this.populate();
  };
  populate = () => {
    axiosInstance
      .get(
        `${
          this.props.authentication.default_path
        }customer_points_listings?start_date=${this.state.start_date.format(
          "YYYY-MM-DD"
        )}&end_date=${this.state.end_date.format("YYYY-MM-DD")}`
      )
      .then((response) => {
        console.log("THIS IS RESPONSE FON SERVER", response);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            data: response.data.data,
          });
        }
      });
  };
  onDateChanged = (attr_name, momentdate) => {
    var new_date = new moment();
    if (momentdate.constructor.name == new_date.constructor.name) {
      var new_state = {
        ...this.state,
        [attr_name]: momentdate,
      };
      this.setState({ ...new_state });
    } else {
      console.log(this.state[attr_name]);
      var date = new moment(this.state[attr_name]);
      var new_state = {
        ...this.state,
        [attr_name]: date,
      };
      this.setState({ ...new_state });
    }
  };
  render() {
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>Points Listing By Date</CardTitle>
            <CardText>
              <ReportFilterWidget
                run={this.run}
                onDateChanged={this.onDateChanged}
                start_date={this.state.start_date}
                end_date={this.state.end_date}
                detailed={this.state.detailed}
                handleChangeToggle={this.handleChangeToggle}
              />
              <LineChart data={this.state.data} />
              <p>&nbsp;</p>
              <Table striped={true} bordered={true}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order Number</th>
                    <th>Customer Name</th>
                    <th>Description</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map((item) => {
                    return (
                      <tr>
                        <td>{item.created_at}</td>
                        <td>{item.number}</td>
                        <td>{item.customer_name}</td>
                        <td>{item.description}</td>
                        <td>{item.points}</td>
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
  connect(mapStateToProps, mapDispatchToProps)(PointsListing)
);
