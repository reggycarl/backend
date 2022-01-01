import React, { Component } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
export default class LoadingWidget extends Component {
  render() {
    return (
      <ScaleLoader
        sizeUnit={"px"}
        height={10}
        color={this.props.color || "#000"}
      />
    );
  }
}
