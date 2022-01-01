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
import moment from "moment";

import "react-datetime/css/react-datetime.css";
import Button from "reactstrap/lib/Button";
import LoadingWidget from "../LoadingWidget/LoadingWidget";

import ReportFilterWidget from "../ReportFilterWidget/ReportFilterWidget";
class AccountStatement extends Component {
  state = {
    data: {
      balance: 0.0,
      transactions: [],
    },
    loading: false,
    start_date: new moment(),
    end_date: new moment(),
    detailed: false,
  };
  handleChangeToggle = (component) => {
    this.setState({
      ...this.state,

      [component.target.id]: component.target.checked,
    });
  };
  componentDidMount = () => {
    this.setState({ ...this.state, loading: true });
    axiosInstance
      .get(
        this.props.authentication.default_path +
          `reports/account_statement?start_date=${this.state.start_date.format(
            "YYYY-MM-DD"
          )}&end_date=${this.state.end_date.format("YYYY-MM-DD")}&detailed=${
            this.state.detailed ? "true" : "false"
          }`
      )
      .then((response) => {
        console.log("THIS IS RESPONSE FON SERVER", response);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            data: response.data.data,
            loading: false,
          });
        } else {
          this.setState({
            ...this.state,
            loading: false,
          });
        }
      });
  };
  run = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      loading: true,
    });
    axiosInstance
      .get(
        this.props.authentication.default_path +
          `reports/account_statement?start_date=${this.state.start_date.format(
            "YYYY-MM-DD"
          )}&end_date=${this.state.end_date.format("YYYY-MM-DD")}&detailed=${
            this.state.detailed ? "true" : "false"
          }`
      )
      .then((response) => {
        console.log("THIS IS RESPONSE FON SERVER", response);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            data: response.data.data,
            loading: false,
          });
        }
      })
      .catch((error, errordata) => {
        // toast.error("Confirmation Resend Failed")
        this.setState({
          ...this.state,
          loading: false,
        });
      });
  };
  onDateChanged = (attr_name, momentdate) => {
    console.log("THIS IS DATE", momentdate);
    console.log("THIS IS ATTR NAME", attr_name);
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
    var balance = parseFloat(this.state.data.balance);
    var sales = parseFloat(this.state.data.sales);
    var commissions = parseFloat(this.state.data.commissions);
    var payouts = parseFloat(this.state.data.payouts);
    var closing_balance = balance + sales - commissions - payouts;

    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>Account Statement</CardTitle>
            <CardText>
              <ReportFilterWidget
                run={this.run}
                onDateChanged={this.onDateChanged}
                start_date={this.state.start_date}
                end_date={this.state.end_date}
                detailed={this.state.detailed}
                handleChangeToggle={this.handleChangeToggle}
                showDetailed={true}
              />
              <p>&nbsp;</p>
              {this.state.loading ? (
                <Col className="centered">
                  <LoadingWidget />
                </Col>
              ) : this.state.detailed ? (
                <Table striped={true} bordered={true}>
                  <thead>
                    <tr>
                      <th width="10%">Date</th>
                      <th width="10%">Reference</th>
                      <th width="41%">Narration</th>
                      <th width="7%">DR</th>
                      <th width="7%">CR</th>
                      <th width="10%">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {" "}
                      <tr>
                        <td>{this.state.start_date.format("YYYY-MM-DD")}</td>
                        <td>Bal b/f</td>
                        <td>Opening Balance</td>

                        <td className={"right"}>
                          <NumberField
                            value={
                              this.state.balance > 0 ? this.state.balance : 0.0
                            }
                          />
                        </td>
                        <td className={"right"}>
                          <NumberField
                            value={
                              this.state.balance < 0 ? this.state.balance : 0.0
                            }
                          />
                        </td>
                        <td className={"right"}>
                          <NumberField value={this.state.data.balance} />
                        </td>
                      </tr>
                      {this.state.data.transactions.map((item) => {
                        balance += parseFloat(item.amount);
                        return (
                          <tr>
                            <td>{item.date}</td>
                            <td>{item.reference}</td>
                            <td>{item.narration}</td>
                            <td className={"right"}>
                              <NumberField
                                value={item.amount > 0 ? item.amount : 0.0}
                              />
                            </td>
                            <td className={"right"}>
                              <NumberField
                                value={item.amount < 0 ? item.amount : 0.0}
                              />
                            </td>
                            <td className={"right"}>
                              <NumberField value={balance} />
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>{this.state.end_date.format("YYYY-MM-DD")}</td>
                        <td>Bal c/f</td>
                        <td>Closing Balance</td>
                        <td className={"right"}>
                          <NumberField value={balance > 0 ? balance : 0.0} />
                        </td>
                        <td className={"right"}>
                          <NumberField
                            value={balance < 0 ? balance || 0.0 : 0.0}
                          />
                        </td>
                        <td className={"right"}>
                          <NumberField value={balance} />
                        </td>
                      </tr>{" "}
                    </>
                  </tbody>
                </Table>
              ) : (
                <Table striped={true} bordered={false}>
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>Opening Balance</td>
                      <td className={"right"}>
                        <NumberField value={this.state.data.balance} />
                      </td>
                    </tr>
                    <tr>
                      <td>Sales</td>
                      <td className={"right"}>
                        <NumberField value={this.state.data.sales} />
                      </td>
                    </tr>
                    <tr>
                      <td>Less Commissions</td>
                      <td className={"right"}>
                        (<NumberField value={this.state.data.commissions} />)
                      </td>
                    </tr>
                    <tr>
                      <td>Net Sales</td>
                      <td className={"right"}>
                        <NumberField value={this.state.data.sales} />
                      </td>
                    </tr>
                    <tr>
                      <td>Less Payouts </td>
                      <td className={"right"}>
                        <NumberField value={this.state.data.payouts} />
                      </td>
                    </tr>
                    <tr>
                      <td>Less Payouts </td>
                      <td className={"right"}>
                        (<NumberField value={this.state.data.payouts} />)
                      </td>
                    </tr>
                    <tr>
                      <td>Closing Balance </td>
                      <td className={"right"}>
                        <NumberField value={closing_balance} />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
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
  connect(mapStateToProps, mapDispatchToProps)(AccountStatement)
);
