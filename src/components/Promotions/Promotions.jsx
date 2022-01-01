import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link } from "react-router-dom";
import axiosInstance from "../misc/Axios";
export default class Promotions extends Component {
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
              Promotions
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/admins/promotions_n_more/promotions/new"
                  >
                    New Promotion
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText>
              <ReactWillPaginateTable
                axiosInstance={axiosInstance}
                columns={columns}
                endpoint={"/admins/promotions"}
                link_endpoint={"/product_configurations/promotions"}
                {...this.props}
              />
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
