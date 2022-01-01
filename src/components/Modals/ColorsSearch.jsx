import React, { Component } from "react";
import { Col, FormGroup, Input, Button } from "reactstrap";
import SubmitButton from "../Controls/SubmitButton";

import { FaArrowAltCircleRight, FaSearch } from "react-icons/fa";
import axiosInstance from "../misc/Axios";
export default class ColorsSearch extends Component {
  state = {
    colors: [],
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
  selectColor = (e) => {
    var result;
    console.log("SIZES", this.state.colors);
    var color = this.props.colors.find((current_color) => {
      console.log("THIS IS CURRN OBJECT", current_color);
      console.log(parseInt(e.target.getAttribute("data-item")));
      result = current_color.id == parseInt(e.target.getAttribute("data-item"));
      console.log("RESULT EVAL", result);
      return result;
    });

    console.log("THIS IS SELECTED SIZE", color);
    this.props.selectColor(color);
  };

  render() {
    return (
      <Col>
        <form className="form-horizontal" onSubmit={this.onSubmit}>
          {/* <FormGroup row>

                        <div className="col-xl-12 input-group">
                            <Input type="name" name='search_string' placeholder="Search for Color" onChange={this.onChange} value={this.state.search_string} readOnly={this.state.readonly} />

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
                Color
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.colors.map((color, i) => {
              return (
                <tr
                  key={i + 1}
                  data-item={color.id}
                  name={color.id}
                  onClick={this.selectColor}
                  style={
                    this.props.color_ids.includes(color.id)
                      ? { backgroundColor: "#eeac11", color: "#fff" }
                      : {}
                  }
                >
                  <td className="centered" data-item={color.id} name={color.id}>
                    <FaArrowAltCircleRight />
                  </td>
                  <td data-item={color.id} name={color.id}>
                    {color.name}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Col>
    );
  }
}
