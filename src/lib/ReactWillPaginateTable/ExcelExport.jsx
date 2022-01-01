import React, { Component } from "react";
import ReactExport from "react-export-excel";
import { FaFileExcel } from "react-icons/fa";
import Button from "reactstrap/lib/Button";
import qs from "query-string";
export default class ExcelExport extends Component {
  state = {
    downloadData: [],
  };
  componentDidMount = () => {
    var params = qs.parse(this.props.location.search || {});
    console.log("Populating download data");
    var new_params = this.props.location.search.replace("?", "");
    var search_string =
      params.search_string != "undefined" && params.search_string != undefined
        ? params.search_string
        : "";
    this.props.axiosInstance
      .get(
        this.props.endpoint +
          `?search_string=${search_string}&all=true&${this.props.additional_params}&${new_params}`
      )
      .then((response) => {
        console.log("THIS IS RESPONSE FON SERVER", response);

        if (response.status == 200) {
          console.log("Populating and setting state download data");
          this.setState({
            ...this.state,
            downloadData: response.data.data,
          });
        }
      });
  };
  render() {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    return (
      <ExcelFile
        element={
          <Button disabled={!(this.state.downloadData.length > 0)}>
            <FaFileExcel /> Export Data
          </Button>
        }
        className="btn btn-seconday"
      >
        <ExcelSheet data={this.state.downloadData} name="Data">
          {this.props.columns.map((d) => {
            return <ExcelColumn label={d.name} value={d.field || d.name} />;
          })}
        </ExcelSheet>
      </ExcelFile>
    );
  }
}
