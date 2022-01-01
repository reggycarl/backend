import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link } from "react-router-dom";
import axiosInstance from "../misc/Axios";
export default class Categories extends Component {
  componentDidMount = () => {
    console.log("PROPS ARE", this.props);
  };
  render() {
    var columns = [
      { name: "code" },
      { name: "name" },
      { name: "parent_name" },
      { name: "full_path" },
      { name: "disabled", boolean: true, options: ["Disabled", "Enabled"] },
    ];
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>
              Categories
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/admins/categories/new"
                  >
                    New Category
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText>
              <ReactWillPaginateTable
                axiosInstance={axiosInstance}
                columns={columns}
                endpoint={"/admins/categories"}
                additional_params={"type=with_parent_and_path"}
                {...this.props}
              />
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
