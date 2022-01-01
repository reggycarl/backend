import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link, withRouter } from "react-router-dom";
import axiosInstance from "../misc/Axios";
import * as actions from "../../actions";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";

import { bindActionCreators } from "redux";
import Table from "reactstrap/lib/Table";
import NumberField from "../Controls/NumberField";
import ReportFilterWidget from "../ReportFilterWidget/ReportFilterWidget";
class KeyMetrics extends Component {
  state = {
    data: [],
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
        `/admins/reports/key_metrics?start_date=${this.state.start_date.format(
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
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>
              Key Metrics
              <ul>
                {this.props.authentication.default_path == "/key_metrics/" ? (
                  <li></li>
                ) : (
                  ""
                )}
              </ul>
            </CardTitle>
            <CardText>
              <ReportFilterWidget
                run={this.run}
                onDateChanged={this.onDateChanged}
                start_date={this.state.start_date}
                end_date={this.state.end_date}
                detailed={this.state.detailed}
                handleChangeToggle={this.handleChangeToggle}
              />
              <Table striped={true} bordered={true}>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map((data) => {
                    return (
                      <tr>
                        <td>{data.name}</td>
                        <td className="right">
                          <NumberField value={data.value} />
                        </td>
                      </tr>
                    );
                  })}
                  <tr></tr>
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
  connect(mapStateToProps, mapDispatchToProps)(KeyMetrics)
);
