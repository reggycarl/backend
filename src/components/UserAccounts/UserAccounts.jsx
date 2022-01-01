import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link, withRouter } from "react-router-dom";
import axiosInstance from "../misc/Axios";
import * as actions from "../../actions";
import { connect } from "react-redux";

import _ from "lodash";

import { bindActionCreators } from "redux";
class UserAccounts extends Component {
  componentDidMount = () => {};
  render() {
    var columns = [{ name: "full_name" }, { name: "email" }, { name: "phone" }];
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>
              Users
              <ul></ul>
            </CardTitle>
            <CardText>
              <ReactWillPaginateTable
                axiosInstance={axiosInstance}
                columns={columns}
                endpoint={`/admins/users`}
                link_endpoint={`/admins/users`}
                {...this.props}
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
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserAccounts)
);
