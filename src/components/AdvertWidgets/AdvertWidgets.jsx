import React, { Component } from "react";
import { Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import ReactWillPaginateTable from "../../lib/ReactWillPaginateTable";
import { Link } from "react-router-dom";
import axiosInstance from "../misc/Axios";
export default class AdvertWidgets extends Component {
  componentDidMount = () => {
    console.log("PROPS ARE", this.props);
  };
  render() {
    var columns = [{ name: "description" }, { name: "position" }];
    return (
      <Col md={12}>
        <Card>
          <CardBody>
            <CardTitle>
              Advert Widgets
              <ul>
                <li>
                  <Link
                    className="btn btn-success btn-sm"
                    to="/appearances/advert_widgets/new"
                  >
                    New AdvertWidget
                  </Link>
                </li>
              </ul>
            </CardTitle>
            <CardText>
              <ReactWillPaginateTable
                axiosInstance={axiosInstance}
                columns={columns}
                endpoint={"/admins/advert_widgets"}
                link_endpoint={"/appearances/advert_widgets"}
                {...this.props}
              />
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
