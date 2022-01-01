import React, { Component } from "react";
import { Col, FormGroup, Input, Button } from "reactstrap";
import SubmitButton from "../Controls/SubmitButton";

import { FaArrowAltCircleRight, FaSearch } from "react-icons/fa";
import axiosInstance from "../misc/Axios";
export default class SizesSearch extends Component {
  state = {
    sizes: [],
    search_string: "",
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
  selectSize = (e) => {
    var result;
    console.log("SIZES", this.state.sizes);
    var size = this.state.sizes.find((current_size) => {
      console.log("THIS IS CURRN OBJECT", current_size);
      console.log(parseInt(e.target.getAttribute("data-item")));
      result = current_size.id == parseInt(e.target.getAttribute("data-item"));
      console.log("RESULT EVAL", result);
      return result;
    });

    // console.log("THIS IS SELECTED SIZE", size)
    this.props.selectSize(size);
  };

  componentDidMount = () => {
    var sizes_array = [];
    console.log("THESE ARE GROUOPS", this.props.size_groups);
    this.props.size_groups.map((size_group, index) => {
      console.log("SIZE GROUP", size_group);
      console.log("SIZE ", size_group.sizes);
      size_group.sizes.map((size, ind) => {
        sizes_array.push(size);
      });
    });
    console.log("SIZES ARRAY", sizes_array);
    this.setState({
      ...this.state,
      sizes: sizes_array,
    });
  };
  render() {
    return (
      <Col>
        <form className="form-horizontal" onSubmit={this.onSubmit}>
          {/* <FormGroup row>

                        <div className="col-xl-12 input-group">
                            <Input type="name" name='search_string' placeholder="Search for Size" onChange={this.onChange} value={this.state.search_string} readOnly={this.state.readonly} />

                            <div class="input-group-append">
                                <Button type='submit' color="primary"  >
                                    <FaSearch />
                                </Button>
                            </div>
                        </div>
                    </FormGroup> */}
        </form>
        <table className="table table-striped my-4 w-100 table-bordered">
          <thead>
            <tr>
              <th width="5%" data-priority="1">
                #
              </th>
              <th width="55%" className="sort-alpha" data-piority="2">
                Size
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.size_groups.map((row, i) => {
              return (
                <React.Fragment key={i + 1}>
                  <tr data-item={row.id} key={i + 1} sizes={row}>
                    <td colSpan="2" data-item={row.id} name={row.id}>
                      <b>{row.name}</b>{" "}
                    </td>
                  </tr>
                  {row.sizes.map((size, newi) => {
                    return (
                      <tr
                        key={i + 1 + newi}
                        data-item={size.id}
                        name={size.id}
                        onClick={this.selectSize}
                        style={
                          this.props.size_ids.includes(size.id)
                            ? { backgroundColor: "#eeac11", color: "#fff" }
                            : {}
                        }
                      >
                        <td
                          className="centered"
                          data-item={size.id}
                          name={size.id}
                        >
                          <FaArrowAltCircleRight />
                        </td>
                        <td data-item={size.id} name={size.id}>
                          {size.name}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Col>
    );
  }
}
