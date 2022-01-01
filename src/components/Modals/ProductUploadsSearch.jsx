import React, { Component } from "react";
import { Col, FormGroup, Input, Button, Label } from "reactstrap";
import SubmitButton from "../Controls/SubmitButton";

import { FaArrowAltCircleRight, FaSearch } from "react-icons/fa";
import axiosInstance from "../misc/Axios";
import NumberField from "../Controls/NumberField";
import _ from "lodash";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import * as actions from "../../actions";
import { connect } from "react-redux";
import "react-toggle/style.css";
import Toggle from "react-toggle";
class ProductUploadsSearch extends Component {
  state = {
    product_upload: { entries: [] },
    search_string: "",
    update: false,
    dtOptions1: {
      paging: true, // Table pagination
      ordering: true, // Column ordering
      info: true, // Bottom left status text
      responsive: true,
      // Text translation options
      // Note the required keywords between underscores (e.g _MENU_)
      oLanguage: {
        sSearch: '<em class="fa fa-search"></em>',
        sLengthMenu: "_MENU_ records per page",
        info: "Showing page _PAGE_ of _PAGES_",
        zeroRecords: "Nothing found - sorry",
        infoEmpty: "No records available",
        infoFiltered: "(filtered from _MAX_ total records)",
        oPaginate: {
          sNext: '<em class="fa fa-caret-right"></em>',
          sPrevious: '<em class="fa fa-caret-left"></em>',
        },
      },
    },
  };
  selectProductUpload = (e) => {
    var result;
    console.log("SIZES", this.state.product_uploads);
    var product_upload = this.state.product_uploads.find(
      (current_product_upload) => {
        console.log("THIS IS CURRN OBJECT", current_product_upload);
        console.log(parseInt(e.target.getAttribute("data-item")));
        result =
          current_product_upload.id ==
          parseInt(e.target.getAttribute("data-item"));
        console.log("RESULT EVAL", result);
        return result;
      }
    );

    this.props.selectProductUpload(product_upload);
  };

  uploadFile = () => {
    let formData = new FormData();

    formData.append("file", this.state.file);
    formData.append("bulk_update", this.state.bulk_update);
    this.setState({
      ...this.state,
      uploading: true,
    });
    var link = this.props.authentication.default_path;
    link += "product_uploads";

    link += !_.isEmpty(this.props.authentication.user.current_company)
      ? `?company_id=${this.props.authentication.user.current_company_id}`
      : "";
    console.log("THIS IS LINK", link);
    axiosInstance
      .post(link, formData)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          this.setState({
            ...this.state,
            product_upload: response.data.product_upload,
            uploading: false,
            uploaded: true,
          });
        } else {
          this.setState({
            ...this.state,
            uploading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          ...this.state,
          uploading: false,
          // processing: false
        });
      });
  };

  processUpload = () => {
    this.setState({
      ...this.state,
      processing: true,
    });
    var link = this.props.authentication.default_path;
    link += `product_uploads/${this.state.product_upload.uuid}`;

    link += !_.isEmpty(this.props.authentication.user.current_company)
      ? `?company_id=${this.props.authentication.user.current_company_id}`
      : "";
    axiosInstance
      .put(link)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            ...this.state,
            // processing: true,
            processed: true,
          });
        } else {
          this.setState({
            ...this.state,
            processed: false,
            processing: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          ...this.state,
          processed: false,
          processing: false,
        });
      });
  };

  componentDidMount = () => {
    var product_uploads_array = [];
    console.log("THESE ARE GROUOPS", this.props.product_upload_groups);
    this.props.product_upload_groups.map((product_upload_group, index) => {
      console.log("SIZE GROUP", product_upload_group);
      console.log("SIZE ", product_upload_group.product_uploads);
      product_upload_group.product_uploads.map((product_upload, ind) => {
        product_uploads_array.push(product_upload);
      });
    });
    console.log("SIZES ARRAY", product_uploads_array);
    this.setState({
      ...this.state,
      product_uploads: product_uploads_array,
    });
  };
  selectFile = (e) => {
    console.log(e);
    this.setState({
      ...this.state,
      file: e.target.files[0],
      file_name: e.target.files[0].name,
    });
  };
  handleChangeToggle = (component) => {
    this.setState({
      ...this.state,

      [component.target.id]: component.target.checked,
    });
  };
  render() {
    return (
      <Col>
        <form className="form-horizontal" onSubmit={this.onSubmit}>
          <FormGroup row>
            <Col md={8}>
              <Label>&nbsp;</Label>
              <input
                type="file"
                name="search_string"
                className="block"
                disabled={this.state.uploading || this.state.uploaded}
                onChange={this.selectFile}
                readOnly={this.state.readonly}
              />
            </Col>
            {this.props.authentication.default_path == "/admins/" ? (
              <Col md={2}>
                <Label for="sale-price">Update</Label>
                <span className="block">
                  <Toggle
                    id="bulk_update"
                    name="bulk_update"
                    defaultChecked={this.state.bulk_update}
                    checked={this.state.bulk_update}
                    disabled={this.state.readOnly}
                    onChange={this.handleChangeToggle}
                  />
                </span>
              </Col>
            ) : (
              ""
            )}
            <Col md={2}>
              <Label>&nbsp;</Label>
              {this.state.uploaded ? (
                <Button
                  color="success"
                  className="form-control"
                  disabled={this.state.processing || this.state.processed}
                  onClick={this.processUpload}
                >
                  Process Upload
                </Button>
              ) : (
                <Button
                  className="form-control"
                  color={"primary"}
                  disabled={
                    !this.state.file ||
                    this.state.uploaded == true ||
                    this.state.uploading == true
                  }
                  onClick={this.uploadFile}
                >
                  {this.state.uploading ? "Uploading..." : "Upload"}{" "}
                </Button>
              )}
            </Col>
          </FormGroup>
        </form>
        <div className="scoll_horizontal">
          <table className="table table-striped my-4 w-100 table-bordered">
            <thead>
              <tr>
                <th width="5%" data-priority="1">
                  #
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  SKU
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Name
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Regular Price
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Sale Price
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Quantity
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Description
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Brand Name
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Main Material
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Tax Code
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Production Country
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Delivery Type
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Category
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Weight
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Dimensions
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Sizes
                </th>
                <th width="" className="sort-alpha" data-piority="2">
                  Colors
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.product_upload.entries.map((product_upload, newi) => {
                return (
                  <tr key={1 + newi}>
                    <td className="centered">
                      <FaArrowAltCircleRight />
                    </td>
                    <td>{product_upload.sku}</td>
                    <td>{product_upload.name}</td>
                    <td>
                      <NumberField value={product_upload.regular_price} />
                    </td>
                    <td>
                      <NumberField value={product_upload.sale_price} />
                    </td>
                    <td> {product_upload.quantity} </td>
                    <td> {product_upload.description}</td>
                    <td> {product_upload.brand_name}</td>
                    <td> {product_upload.main_material}</td>
                    <td> {product_upload.tax_code}</td>
                    <td> {product_upload.production_country_name}</td>
                    <td> {product_upload.delivery_type_name}</td>
                    <td> {product_upload.category_name}</td>
                    <td> {product_upload.weight}</td>
                    <td> {product_upload.dimensions}</td>
                    <td> {product_upload.sizes}</td>
                    <td> {product_upload.colors}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductUploadsSearch)
);
