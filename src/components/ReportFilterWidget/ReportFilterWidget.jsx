import React, { Component } from "react";
import Col from "reactstrap/lib/Col";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import Row from "reactstrap/lib/Row";
import "react-toggle/style.css";
import Datetime from "react-datetime";
import Form from "reactstrap/lib/Form";
import Button from "reactstrap/lib/Button";
import Toggle from "react-toggle";
import "react-datetime/css/react-datetime.css";
export default class ReportFilterWidget extends Component {
  render() {
    return (
      <Form>
        <Row>
          <FormGroup className="col-md-2">
            <Label for="sale-price">Start Date </Label>
            <Col md={12} className="block">
              <Row>
                <Datetime
                  type="name"
                  dateFormat="DD-MM-YYYY"
                  name="start_date"
                  timeFormat={false}
                  value={this.props.start_date}
                  onChange={this.props.onDateChanged.bind(this, "start_date")}
                  inputProps={{ disabled: this.props.readOnly }}
                />
              </Row>
            </Col>
          </FormGroup>
          <FormGroup className="col-md-2">
            <Label for="sale-price">End Date </Label>
            <Col md={12} className="block">
              <Row>
                <Datetime
                  type="name"
                  dateFormat="DD-MM-YYYY"
                  name="end_date"
                  timeFormat={false}
                  value={this.props.end_date}
                  onChange={this.props.onDateChanged.bind(this, "end_date")}
                  inputProps={{ disabled: this.props.readOnly }}
                />
              </Row>
            </Col>
          </FormGroup>
          {this.props.showDetailed ? (
            <FormGroup className="col-md-1">
              <Row>
                <Label for="sale-price">Detailed </Label>
                <Col md={12} className="block">
                  <Row>
                    <Toggle
                      id="detailed"
                      defaultChecked={this.props.detailed}
                      checked={this.props.detailed}
                      onChange={this.props.handleChangeToggle}
                    />
                  </Row>
                </Col>
              </Row>
            </FormGroup>
          ) : (
            ""
          )}
          <FormGroup className="col-md-2">
            <Row>
              <Label for="sale-price">&nbsp; </Label>
              <Col md={12} className="block">
                <Button
                  type="submit"
                  className="form-control"
                  onClick={this.props.run}
                  color={"success"}
                >
                  Run{" "}
                </Button>
              </Col>
            </Row>
          </FormGroup>
        </Row>
      </Form>
    );
  }
}
