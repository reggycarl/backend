import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { Input } from "reactstrap";
export default class NumberField extends Component {
  render() {
    // console.log("THIS THE DEPLAY TYPE", ths)
    return (
      <NumberFormat
        customInput={Input}
        value={this.props.value}
        className={`form-control ${this.props.className}`}
        displayType={this.props.displayType == "input" ? "input" : "text"}
        thousandSeparator={true}
        className={
          this.props.input ? "form-control right" : this.props.className || ""
        }
        fixedDecimalScale={true}
        decimalScale={this.props.decimalScale ?? 2}
        onValueChange={this.props.onValueChange}
        disabled={this.props.readOnly}
        readOnly={this.props.readOnly}
      />
    );
  }
}
