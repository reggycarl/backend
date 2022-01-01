import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link } from "react-router-dom";
import axiosInstance from "../misc/Axios";
export default class PointsConfigurations extends Component {
  componentDidMount = () => {
    console.log("PROPS ARE", this.props);
  };
  render() {
    var columns = [{ name: "name" }, { name: "rate", number: true }];
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>
              Points Configurations
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/admins/points_configurations/new"
                  >
                    New PointsConfiguration
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText>
              <ReactWillPaginateTable
                axiosInstance={axiosInstance}
                columns={columns}
                endpoint={"/admins/points_configurations"}
                link_endpoint={"/admins/points_configurations"}
                {...this.props}
              />
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
